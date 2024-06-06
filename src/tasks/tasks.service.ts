import { Injectable, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import NewTask from './NewTask.interface';

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

  async createTask(req: any, task: NewTask):Promise<Task> {
    await validateAuthorization(req, this.usersService);

    const { title, details, tags } = task;

    // Check if tags exist

    return await this.prisma.task
      .create({
        data: {
          userId: req.session.userId,
          title,
          details,
          status: 'BACKLOG',
          tags: { connect: tags.map((tagId) => ({ id: tagId })) as any }
        }
      })
      .catch(() => { throw new InternalServerErrorException() });
  }
}
