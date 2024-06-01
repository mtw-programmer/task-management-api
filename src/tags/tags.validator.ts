import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Tag {
  @ApiProperty({ minLength: 1, maxLength: 30 })
  @IsString()
  @Length(1, 30)
  title: string;

  @ApiProperty({ minLength: 6, maxLength: 6 })
  @IsString()
  @Length(6)
  color: string;
}