import { Injectable, NotFoundException } from '@nestjs/common';
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
    const newFeedback = await this.repo.save({
      service,
      feedback,
      email,
    });

    const photoEntities = await Promise.all(
      photos.map((photo) =>
        this.photoRepository.save({
          photo,
          feedback_uuid: newFeedback.feedback_uuid,
        }),
      ),
    );

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
        ...photoEntities.map((photo) => ({
          image_url: `${process.env.API_BASE_URL}/photos/${photo.photo_uuid}`,
        })),
      ],
    });

    return newFeedback;
  }

  async getPhoto(uuid: string) {
    const photo = await this.photoRepository.findOne({
      where: { photo_uuid: uuid },
    });
    if (!photo) throw new NotFoundException();
    const data = Buffer.from(photo.photo).toString();
    const mime = data.split(';')[0].split(':')[1];
    const base64 = data.split(';')[1].split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    return { mime, buffer };
  }
}
