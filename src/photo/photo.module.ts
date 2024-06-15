import { Module } from '@nestjs/common';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PhotoRepository } from './photo.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PhotoController],
  providers: [PhotoService, PhotoRepository],
})
export class PhotoModule {}
