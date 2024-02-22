import { Controller, Post, Res, Body, ValidationPipe, Session } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from './auth.validator';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate with your account' })
  async account(
    @Body(new ValidationPipe()) Auth: Auth,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    const { message } = await this.authService.login(
      Auth
    );

    session.user = Auth.username;
    await session.save();

    return res.send({
      message
    });
  }
}
