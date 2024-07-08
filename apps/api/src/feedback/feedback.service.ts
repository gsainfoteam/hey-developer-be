import { Injectable, Logger } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { SlackService } from 'nestjs-slack';
import { ConfigService } from '@nestjs/config';
import { CreateFeedbackReqDto } from './dto/req/createFeedbackReq.dto';
import { Feedback } from '@prisma/client';

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);
  private readonly apiBaseUrl: string;
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly slackService: SlackService,
    private readonly configSerivce: ConfigService,
  ) {
    this.apiBaseUrl = this.configSerivce.getOrThrow<string>('api.baseUrl');
  }

  async createFeedback({
    service,
    email = '',
    feedback,
    photos,
  }: CreateFeedbackReqDto): Promise<Feedback> {
    this.logger.log(`Create feedback for ${service}`);
    const feedbackData = await this.feedbackRepository.createFeedback({
      service,
      email,
      feedback,
      photos,
    });

    await this.slackService
      .postMessage({
        text: '사용자 피드백 접수!',
        username: 'Hey Developer!',
        icon_emoji: ':wave:',
        attachments: [
          {
            color: '#2eb886',
            fields: [
              {
                title: '서비스',
                value: service,
                short: false,
              },
              {
                title: '피드백 내용',
                value: feedback,
                short: false,
              },
              {
                title: '이메일',
                value: email,
                short: false,
              },
            ],
          },
          ...feedbackData.Photos.map((photo) => ({
            image_url: `${this.apiBaseUrl}/photo/${photo.uuid}`,
          })),
        ],
      })
      .catch((err) => {
        this.logger.error(`Failed to send feedback to slack: ${err}`);
      });

    return feedbackData;
  }
}
