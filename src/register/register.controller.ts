import { Controller, Post, Res, Body, ValidationPipe } from '@nestjs/common'
import { Response } from 'express'
import { Register } from './register.validator'
import { RegisterService } from './register.service'

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('account')
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
