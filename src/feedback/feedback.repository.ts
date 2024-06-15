import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Feedback } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedbackRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createFeedback({
    service,
    email,
    feedback,
    photos,
  }: Pick<Feedback, 'service' | 'email' | 'feedback'> & {
    photos?: string[];
  }): Promise<Feedback> {
    return this.prismaService.feedback
      .create({
        data: {
          service,
          email,
          feedback,
          Photos: {
            createMany: {
              data: photos?.map((photo) => ({ photo })),
            },
          },
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          throw new InternalServerErrorException(error.message);
        }
        throw new InternalServerErrorException(
          'Unexpected server error occurred',
        );
      });
  }
}
