import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ConfigModule } from '@nestjs/config';
import { FeedbackModule } from './feedback/feedback.module';

import { PhotoModule } from './photo/photo.module';
import { HealthModule } from './health/health.module';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    FeedbackModule,
    PhotoModule,
    HealthModule,
  ],
  controllers: [ApiController],
})
export class ApiModule {}
