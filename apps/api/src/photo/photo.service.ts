import { Injectable, Logger } from '@nestjs/common';
import { PhotoRepository } from './photo.repository';
import { GetPhotoResDto } from './dto/res/getPhotoRes.dto';

@Injectable()
export class PhotoService {
  private readonly logger = new Logger(PhotoService.name);
  constructor(private readonly photoRepository: PhotoRepository) {}

  async getPhoto(uuid: string): Promise<GetPhotoResDto> {
    this.logger.log(`Getting photo with uuid: ${uuid}`);

    const photo = await this.photoRepository.getPhotoByUuid(uuid);

    const data = Buffer.from(photo.photo).toString();
    return {
      mime: data.split(';')[0].split(':')[1],
      buffer: Buffer.from(data.split(';')[1].split(',')[1], 'base64'),
    };
  }
}
