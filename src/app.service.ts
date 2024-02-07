import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Feedback } from './global/entities/feedback.entity';
import { InjectRepository } from '@nestjs/typeorm';
import sendSlackMessage from './global/utils/sendMessage';
import { Photo } from './global/entities/photo.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Feedback)
    private repo: Repository<Feedback>,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
  ) {}

  async setFeedback(
    service?: string,
    feedback?: string,
    email?: string,
    photos?: string[],
  ): Promise<Feedback> {
    sendSlackMessage(process.env.SLACK_WEBHOOK_URL, {
      text: `사용자 피드백 접수`,
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
            email && {
              title: '이메일',
              value: email,
              short: false,
            },
          ],
        },
      ],
    });
    const newFeedback = await this.repo.save({
      service,
      feedback,
      email,
    });

    if (photos && photos.length > 0) {
      const photoEntities = photos.map((photo) => ({
        photo,
        feedback_uuid: newFeedback.feedback_uuid,
      }));
      this.photoRepository.save(photoEntities);
    }

    return newFeedback;
  }
}
