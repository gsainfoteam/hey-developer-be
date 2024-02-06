import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Feedback } from './global/entities/feedback.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Feedback)
    private repo: Repository<Feedback>,
  ) {}

  async setFeedback(
    feedback: string,
    email: string,
    photos: string[],
  ): Promise<Feedback> {
    return await this.repo.save({
      feedback,
      email,
      photos: photos.map((photo) => ({ photo })),
    });
  }
}
