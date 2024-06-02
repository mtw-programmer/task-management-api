import { Controller, Post, Body, ValidationPipe, Res, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { TagsService } from './tags.service';
import { Tag } from './tags.validator';
import { SuccessResponse, BadRequest, InternalServerError } from './tags.docs';

@Controller('tags')
@ApiTags('Tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create new tag' })
  @ApiResponse(SuccessResponse)
  @ApiResponse(BadRequest)
  @ApiResponse(InternalServerError)
  async create(
    @Req() req: Request,
    @Body(new ValidationPipe()) Tag: Tag,
    @Res() res: Response,
  ) {
    const { message, tagId } = await this.tagsService.create(req, Tag);
    return res.send({ message, tagId });
  }
}
