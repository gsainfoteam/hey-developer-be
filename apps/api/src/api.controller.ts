import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class ApiController {
  private readonly API_VERSION = this.configService.getOrThrow('api.version');
  private readonly publishedAt = new Date().toISOString();
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getApiInfo() {
    return {
      name: 'Hey developer',
      version: this.API_VERSION,
      publishedAt: this.publishedAt,
    };
  }
}
