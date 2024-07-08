import { PrismaService } from '@lib/prisma';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Photo } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PhotoRepository {
  private readonly logger = new Logger(PhotoRepository.name);
  constructor(private readonly prismaService: PrismaService) {}

  async getPhotoByUuid(uuid: string): Promise<Photo> {
    this.logger.log(`Getting photo with uuid: ${uuid}`);
    return this.prismaService.photo
      .findUniqueOrThrow({
        where: { uuid },
      })
      .catch((error) => {
        this.logger.error(error);
        if (error instanceof PrismaClientKnownRequestError) {
          throw new InternalServerErrorException('database error occurred');
        }
        throw new InternalServerErrorException('unknown error occurred');
      });
  }
}
