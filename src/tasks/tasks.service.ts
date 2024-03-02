import { Injectable, NotFoundException, InternalServerErrorException, UnauthorizedException, UseGuards, ExecutionContext } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { task } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
  constructor (
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService
  ) {}

  async findOne(id: number):Promise<task> {
    return await this.prisma.task
      .findUniqueOrThrow({
        where: { id }
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async getAll(req: any):Promise<task[]> {
    if (!req || !req.session.user || !this.usersService.idExists(req.session.user)) {
      throw new UnauthorizedException();
    }

    return await this.prisma.task
      .findMany({ where: { userId: req.session.user } })
      .catch(() => { throw new InternalServerErrorException() });
  }
}
