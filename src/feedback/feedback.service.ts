import { Injectable } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { CreateFeedbackReqDto } from './dto/req/createFeedbackReq.dto';

@Injectable()
export class FeedbackService {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  async createFeedback({
    service,
    email,
    feedback,
    photos,
  }: CreateFeedbackReqDto) {
    return this.feedbackRepository.createFeedback({
      service,
      email,
      feedback,
      photos,
    });
  }
}
