import { Module } from '@nestjs/common';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { PhotoRepository } from './photo.repository';
import { PrismaModule } from '@lib/prisma';

@Module({
  imports: [PrismaModule],
  controllers: [PhotoController],
  providers: [PhotoService, PhotoRepository],
})
export class PhotoModule {}
