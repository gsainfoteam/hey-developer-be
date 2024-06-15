import { Controller, Get, Param, Res } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { Response } from 'express';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Get(':uuid')
  async getPhoto(
    @Param('uuid') uuid: string,
    @Res() res: Response,
  ): Promise<void> {
    const { mime, buffer } = await this.photoService.getPhoto(uuid);
    res.setHeader('Content-Type', mime);
    res.end(buffer);
  }
}
