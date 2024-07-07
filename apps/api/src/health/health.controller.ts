import { PrismaService } from '@lib/prisma';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async healthCheck() {
    return this.health.check([
      () =>
        this.prisma.pingCheck('database', this.prismaService, { timeout: 300 }),
      () =>
        this.disk.checkStorage('storage', {
          path: this.configService.getOrThrow('health.diskRootPath'),
          threshold:
            1024 *
            1024 *
            1024 *
            this.configService.getOrThrow<number>('health.diskThresholdGb'),
        }),
      () =>
        this.memory.checkRSS(
          'memory_rss',
          1024 *
            1024 *
            this.configService.getOrThrow<number>('health.memoryThresholdMb'),
        ),
    ]);
  }
}
