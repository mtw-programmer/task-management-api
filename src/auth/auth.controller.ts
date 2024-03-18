import { Controller, Post, Res, Body, ValidationPipe, Session } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from './auth.validator';
import { AuthService } from './auth.service';
import { SuccessResponse, BadRequest, NotFoundException, InternalServerError } from './auth.docs';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate with your account' })
  @ApiResponse(SuccessResponse)
  @ApiResponse(BadRequest)
  @ApiResponse(NotFoundException)
  @ApiResponse(InternalServerError)
  async account(
    @Body(new ValidationPipe()) Auth: Auth,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    const { userId, message } = await this.authService.login(
      Auth
    );

    session.user = userId;
    await session.save();

    return res.send({
      message
    });
  }
}
