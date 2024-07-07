import { Body, Controller, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Feedback } from '@prisma/client';
import { CreateFeedbackReqDto } from './dto/req/createFeedbackReq.dto';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @ApiOperation({
    summary: 'Create feedback',
    description: '유저의 피드백을 받아서 저장하는 api입니다.',
  })
  @ApiCreatedResponse({
    description: '피드백이 성공적으로 저장되었을 때 반환됩니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '서버 에러가 발생했을 때 반환됩니다.',
  })
  @Post()
  async createFeedback(@Body() body: CreateFeedbackReqDto): Promise<Feedback> {
    return this.feedbackService.createFeedback(body);
  }
}
