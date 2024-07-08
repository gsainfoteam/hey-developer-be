import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrismaModule } from '@lib/prisma';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TerminusModule.forRoot({ errorLogStyle: 'pretty' }),
    PrismaModule,
    ConfigModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
