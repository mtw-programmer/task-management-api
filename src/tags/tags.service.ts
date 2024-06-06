import { Injectable, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tag } from '@prisma/client';
import { Tag as TagValidator } from './tags.validator';
import { UsersService } from 'src/users/users.service';
import validateAuthorization from 'src/common/utils/validateAuthorization';

@Injectable()
export class TagsService {
  constructor (
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService
  ) {}

  async idExists(req: any, id: number):Promise<boolean> {
    const result = await this.prisma.tag.findUnique({ where: { userId: req.session.user, id } });
    return !!result;
  }

  async findOne(req: any, id: number):Promise<Tag> {
    await validateAuthorization(req, this.usersService);

    return await this.prisma.tag
      .findUniqueOrThrow({
        where: { id, userId: req.session.user }
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async getAll(req: any):Promise<Tag[]> {
    await validateAuthorization(req, this.usersService);

    return await this.prisma.tag
      .findMany({ where: { userId: req.session.user } })
      .catch(() => { throw new InternalServerErrorException() });
  }

  async create(req: any, tag: TagValidator): Promise<any> {
    await validateAuthorization(req, this.usersService);

    const userExists = await this.usersService.idExists(req.session.user);
    if (!userExists) {
      throw new UnauthorizedException('User does not exist');
    }

    try {
      const newTag = await this.prisma.tag.create({
        data: {
          userId: req.session.user,
          title: tag.title,
          color: tag.color,
        },
      });

      return { tagId: newTag.id, message: 'Successfully created a new tag' };
    } catch (error) {
      console.error('Error creating tag:', error);
      throw new InternalServerErrorException('Failed to create tag');
    }
  }
}
