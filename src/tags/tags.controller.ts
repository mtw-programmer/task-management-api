import { Controller, Post, Body, ValidationPipe, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { TagsService } from './tags.service';
import { Tag } from './tags.validator';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post('create')
  async create(
    @Req() req: Request,
    @Body(new ValidationPipe()) Tag: Tag,
    @Res() res: Response,
  ) {
    const { message, tagId } = await this.tagsService.create(req, Tag);
    return res.send({ message, tagId });
  }
}
