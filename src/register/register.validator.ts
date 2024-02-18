import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Register {
  @ApiProperty({ minLength: 1, maxLength: 30 })
  @IsString()
  @Length(1,30)
  username: string;

  @ApiProperty({ minLength: 8, maxLength: 32 })
  @IsString()
  @Length(8,32)
  password: string;
}
