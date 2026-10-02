import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import {
  initializeMetrics,
  MetricsInterceptor,
  shutdownOpenTelemetry,
  Trace,
} from '@gsainfoteam/nest-observability';
import { Logger } from '@nestjs/common';
import { FeedbackRepository } from './feedback/feedback.repository';
import { FeedbackService } from './feedback/feedback.service';
import { PhotoRepository } from './photo/photo.repository';
import { PhotoService } from './photo/photo.service';

const serviceName = process.env.OTEL_SERVICE_NAME ?? 'hey-developer-api';

Trace()(FeedbackService);
Trace()(FeedbackRepository);
Trace()(PhotoService);
Trace()(PhotoRepository);

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  const configService = app.get(ConfigService);
  // set CORS config
  const whitelist = [/https:\/\/.*cs.gistory.me/, /http:\/\/localhost:3000/];
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.some((regex) => regex.test(origin))) {
        callback(null, origin);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  // swagger auth config
  const config = new DocumentBuilder()
    .setTitle('Hey developer backend API')
    .setDescription('The Hey developer API recipe book')
    .setVersion(configService.getOrThrow('API_VERSION'))
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(json({ limit: '50mb' }));
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
