import { Injectable, NotFoundException, InternalServerErrorException, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from '@prisma/client';
import { Task as TaskValidator } from './tasks.validator';
import { UsersService } from 'src/users/users.service';
import validateAuthorization from 'src/common/utils/validateAuthorization';
import { TagsService } from 'src/tags/tags.service';

@Injectable()
export class TasksService {
  constructor (
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService
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

  async create(req: any, task: TaskValidator): Promise<any> {
    await validateAuthorization(req, this.usersService);

    const { title, details, tags } = task;

    if (!await this.tagsService.areTagsValid(req, tags)) {
      throw new BadRequestException(['Invalid tags']);
    }

    try {
      const newTask = await this.prisma.task.create({
        data: {
          userId: req.session.user,
          title,
          details,
          status: 'BACKLOG',
          tags: {
            create: tags.map(tagId => ({ tagId }))
          }
        }
      });

      return { taskId: newTask.id, message: 'Successfully created a new task' };
    } catch (error) {
      Logger.error('Error creating a task: ', error);
      throw new InternalServerErrorException('Failed to create tag');
    }
  }
}
