import { Injectable, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tag } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TagsService {
  constructor (
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService
  ) {}

  async findOne(req: any, id: number):Promise<Tag> {
    if (!req || !req.session.user || !await this.usersService.idExists(req.session.user)) {
      throw new UnauthorizedException();
    }

    return await this.prisma.tag
      .findUniqueOrThrow({
        where: { id, userId: req.session.user }
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async getAll(req: any):Promise<Tag[]> {
    if (!req || !req.session.user || !await this.usersService.idExists(req.session.user)) {
      throw new UnauthorizedException();
    }

    return await this.prisma.tag
      .findMany({ where: { userId: req.session.user } })
      .catch(() => { throw new InternalServerErrorException() });
  }
}
