import { Injectable, Logger } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { CreateFeedbackReqDto } from './dto/req/createFeedbackReq.dto';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);
  private readonly slackWebhookUrl: string;
  private readonly apiBaseUrl: string;
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.slackWebhookUrl = this.configService.get<string>('SLACK_WEBHOOK_URL');
    this.apiBaseUrl = this.configService.get<string>('API_BASE_URL');
  }

  async createFeedback({
    service,
    email,
    feedback,
    photos,
  }: CreateFeedbackReqDto) {
    const feedbackData = await this.feedbackRepository.createFeedback({
      service,
      email,
      feedback,
      photos,
    });

    await firstValueFrom(
      this.httpService
        .post(this.slackWebhookUrl, {
          text: '사용자 피드백 접수',
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
        .pipe(
          catchError((error) => {
            this.logger.error(error);
            return error;
          }),
        ),
    );

    return feedbackData;
  }
}
