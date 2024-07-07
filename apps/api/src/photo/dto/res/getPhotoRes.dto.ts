import { ApiProperty } from '@nestjs/swagger';

export class GetPhotoResDto {
  @ApiProperty()
  mime: string;

  @ApiProperty()
  buffer: Buffer;
}
