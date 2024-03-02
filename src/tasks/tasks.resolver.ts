import { Resolver, Query, Context } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver('Task')
export class TasksResolver {
  constructor (private readonly tasksService: TasksService) {}

  @Query()
  @UseGuards(AuthGuard)
  async getTasks(@Context() context: { req: Request }):Promise<Task[]> {
    const { req } = context;
    return await this.tasksService.getAll(req);
  }
}
