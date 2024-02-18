import { Controller, Post, Res, Body, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Register } from './register.validator';
import { RegisterService } from './register.service';
import { SuccessResponse, BadRequest, InternalServerError } from './register.docs';

@Controller('register')
@ApiTags('Register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('account')
  @ApiOperation({ summary: 'Create new account' })
  @ApiResponse(SuccessResponse)
  @ApiResponse(BadRequest)
  @ApiResponse(InternalServerError)
  async account(
    @Body(new ValidationPipe()) Register: Register,
    @Res() res: Response,
  ) {
    const { message } = await this.registerService.register(
      Register
    );
    return res.send({
      message
    });
  }
}
