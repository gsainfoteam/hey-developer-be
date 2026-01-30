import { Injectable, Logger } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { SlackService } from 'nestjs-slack';
import { ConfigService } from '@nestjs/config';
import { CreateFeedbackReqDto } from './dto/req/createFeedbackReq.dto';
import { Feedback } from '@prisma/client';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);
  private readonly apiBaseUrl: string;
  private readonly transporter: Transporter;
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly slackService: SlackService,
    configService: ConfigService,
  ) {
    this.apiBaseUrl = configService.getOrThrow<string>('api.baseUrl');
    this.transporter = createTransport({
      host: configService.getOrThrow<string>('EMAIL_HOST'),
      port: configService.getOrThrow<number>('EMAIL_PORT'),
      secure: true,
      auth: {
        type: 'oauth2',
        user: configService.getOrThrow<string>('EMAIL_USER'),
        serviceClient: configService.getOrThrow<string>('EMAIL_SERVICE_CLIENT'),
        privateKey: configService
          .getOrThrow<string>('EMAIL_PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
        accessUrl: configService.getOrThrow<string>('EMAIL_ACCESS_URL'),
      },
      from: `Infoteam Feedback <${configService.getOrThrow<string>('EMAIL_SENDER')}>`,
      tls: { rejectUnauthorized: false },
    });
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

    const tag = feedbackData.uuid.slice(-4);

    await Promise.allSettled([
      this.slackService
        .postMessage({
          text: `사용자 피드백 접수! #${tag}`,
          username: 'Hey Developer!',
          icon_emoji: ':wave:',
          attachments: [
            {
              color: '#2eb886',
              fields: [
                { title: '서비스', value: service, short: false },
                { title: '피드백 내용', value: feedback, short: false },
                { title: '이메일', value: email, short: false },
              ],
            },
            ...feedbackData.Photos.map((photo) => ({
              image_url: `${this.apiBaseUrl}/photo/${photo.uuid}`,
            })),
          ],
        })
        .catch((err) => {
          this.logger.error(`Failed to send feedback to slack: ${err}`);
        }),
      this.transporter.sendMail({
        to: 'infoteam@gistory.me',
        replyTo: email || undefined,
        subject: `문의 요청 (#${tag})`,
        html: `${feedback} ${photos.map((p) => `<img src="${p}" />`)}`,
      }),
    ]);

    return feedbackData;
  }
}
