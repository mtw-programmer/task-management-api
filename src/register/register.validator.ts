import { IsString, Length } from 'class-validator';

export class Register {
  @IsString()
  @Length(1,30)
  username: string;

  @IsString()
  @Length(8,32)
  password: string;
}
