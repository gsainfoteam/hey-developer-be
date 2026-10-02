import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';
import {
  initializeMetrics,
  MetricsInterceptor,
  shutdownOpenTelemetry,
} from '@gsainfoteam/nest-observability';
import { Logger } from '@nestjs/common';

const serviceName = process.env.OTEL_SERVICE_NAME ?? 'hey-developer-admin';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);
  app.useGlobalInterceptors(new MetricsInterceptor());

  let isShuttingDown = false;
  const shutdown = (signal: NodeJS.Signals) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    const logger = new Logger('Bootstrap');
    logger.log(`Received ${signal}. Starting graceful shutdown.`);

    void (async () => {
      let exitCode = 0;
      try {
        await app.close();
      } catch (error) {
        exitCode = 1;
        logger.error('Failed to close Nest application', error);
      }
      try {
        await shutdownOpenTelemetry();
      } catch (error) {
        exitCode = 1;
        logger.error('Failed to shutdown OpenTelemetry', error);
      }
      process.exit(exitCode);
    })();
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

async function bootstrapWithObservability() {
  const logger = new Logger('Bootstrap');
  try {
    initializeMetrics(serviceName);
    await bootstrap();
  } catch (error) {
    logger.error('Failed to bootstrap application', error);
    try {
      await shutdownOpenTelemetry();
    } catch (shutdownError) {
      logger.error('Failed to shutdown OpenTelemetry', shutdownError);
    }
    process.exit(1);
  }
}

void bootstrapWithObservability();
