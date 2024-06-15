import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateFeedbackReqDto {
  @ApiProperty()
  @IsString()
  service: string;

  @ApiProperty()
  @IsString()
  feedback: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  photos: string[];
}
