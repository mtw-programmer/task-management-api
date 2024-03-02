import { Resolver, Query, Context } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from '@prisma/client';

@Resolver('Task')
export class TasksResolver {
  constructor (private readonly tasksService: TasksService) {}

  @Query()
  async getTasks(@Context() context: { req: Request }):Promise<Task[]> {
    const { req } = context;
    return await this.tasksService.getAll(req);
  }
}
