import { Body, Controller, Post } from '@nestjs/common';
import { Feedback } from '@prisma/client';
import { CreateFeedbackReqDto } from './dto/req/createFeedbackReq.dto';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async createFeedback(@Body() body: CreateFeedbackReqDto): Promise<Feedback> {
    return this.feedbackService.createFeedback(body);
  }
}
