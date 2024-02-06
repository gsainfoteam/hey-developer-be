import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async setFeedback(
    @Body('service') service: string,
    @Body('feedback') feedback: string,
    @Body('email') email: string,
    @Body('photos') photos: string[],
  ) {
    return this.appService.setFeedback(service, feedback, email, photos);
  }
}
