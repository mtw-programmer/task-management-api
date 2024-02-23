import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UsersService } from 'src/users/users.service';
import { Auth } from './auth.validator';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async login({ username, password }: Auth):Promise<any> {
    const user = await this.usersService.findOne(username);

    if (!await argon2.verify(user.password, password)) {
      this.logger.warn(`${username} failed to login`);
      throw new BadRequestException(['Invalid username or password']);
    }

    this.logger.log(`${username} logged in`);
    return { message: 'Successfully logged in' };
  }
}
