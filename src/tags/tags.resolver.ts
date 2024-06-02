import { Resolver, Query, Context } from '@nestjs/graphql';
import { TagsService } from './tags.service';
import { Tag } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver('Tag')
export class TagsResolver {
  constructor (private readonly tagsService: TagsService) {}

  @Query()
  @UseGuards(AuthGuard)
  async getTag(@Context() context: { req: Request }, id: number):Promise<Tag> {
    const { req } = context;
    return await this.tagsService.findOne(req, id);
  }
  
  @Query()
  @UseGuards(AuthGuard)
  async getTags(@Context() context: { req: Request }):Promise<Tag[]> {
    const { req } = context;
    return await this.tagsService.getAll(req);
  }
}
