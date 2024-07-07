import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Hey developer backend API')
    .setDescription('The Hey developer API recipe book')
    .setVersion(configService.getOrThrow('API_VERSION'))
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
