import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

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

  @Get('photos/:uuid')
  async getPhoto(@Param('uuid') uuid: string, @Res() res: Response) {
    const { mime, buffer } = await this.appService.getPhoto(uuid);
    res.setHeader('Content-Type', mime);
    res.end(buffer);
  }

  @Get()
  async getHello() {
    return 'Hello World!';
  }
}
