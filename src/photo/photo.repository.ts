import { Injectable, NotFoundException } from '@nestjs/common';
import { Photo } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PhotoRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getPhotoByUuid(uuid: string): Promise<Photo> {
    return this.prismaService.photo
      .findUniqueOrThrow({
        where: {
          uuid,
        },
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }
}
