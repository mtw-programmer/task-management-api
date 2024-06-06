import { Injectable, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

const validateAuthorization = async (req: any, usersService: UsersService) => {
  if (!req || !req.session.user || !await usersService.idExists(req.session.user)) {
    throw new UnauthorizedException();
  }
}

@Injectable()
export class TasksService {
  constructor (
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService
  ) {}

  async findOne(req: any, id: number):Promise<Task> {
    await validateAuthorization(req, this.usersService);

    return await this.prisma.task
      .findUniqueOrThrow({
        where: { id, userId: req.session.user }
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async getAll(req: any):Promise<Task[]> {
    await validateAuthorization(req, this.usersService);

    return await this.prisma.task
      .findMany({ where: { userId: req.session.user } })
      .catch(() => { throw new InternalServerErrorException() });
  }
}
