import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UsersService } from 'src/users/users.service';
import { Register } from './register.validator';

@Injectable()
export class RegisterService {
  constructor(
    private usersService: UsersService,
  ) {}

  private readonly logger = new Logger(RegisterService.name);

  async register({ username, password }: Register): Promise<any> {

    const usernameExists = await this.usersService.exists(username);

    if (usernameExists) {
      throw new BadRequestException('This username is already taken');
    }

    const hash = await argon2.hash(password);

    await this.usersService.insertOne({ username, password: hash });

    this.logger.log(`${username} registered`);
    return { message: 'You have been successfully registered' };
  }
}
