import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { PrismaModule } from '@lib/prisma';
import { FeedbackRepository } from './feedback.repository';
import { FeedbackController } from './feedback.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SlackModule } from 'nestjs-slack';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    SlackModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'webhook',
          url: configService.getOrThrow<string>('slack.webhookUrl'),
        };
      },
    }),
  ],
  providers: [FeedbackService, FeedbackRepository],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
