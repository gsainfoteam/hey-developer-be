import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PhotoService } from './photo.service';
import { Response } from 'express';

@ApiTags('photo')
@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @ApiOperation({
    summary: 'Get photo',
    description: '사진을 가져오는 api입니다.',
  })
  @Get(':uuid')
  async getPhoto(
    @Param('uuid') uuid: string,
    @Res() res: Response,
  ): Promise<void> {
    const { mime, buffer } = await this.photoService.getPhoto(uuid);
    res.setHeader('Content-Type', mime);
    res.send(buffer);
  }
}
