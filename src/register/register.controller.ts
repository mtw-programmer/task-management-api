import { Controller, Post, Res, Body, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Register } from './register.validator';
import { RegisterService } from './register.service';

@Controller('register')
@ApiTags('Register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('account')
  @ApiOperation({ summary: 'Create new account' })
  @ApiResponse({
    status: 201,
    description: 'Successfully registered',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'You have been successfully registered',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          type: 'string',
          example: 'This username is already taken',
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      properties: {
        statusCode: {
          type: 'number',
          example: 500,
        },
        message: {
          type: 'string',
          example: 'Internal Server Error',
        },
      },
    }
  })
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
