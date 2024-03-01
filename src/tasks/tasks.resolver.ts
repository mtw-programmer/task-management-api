import { Resolver, Query } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { task } from '@prisma/client';

@Resolver('Task')
export class TasksResolver {
  constructor (private readonly tasksService: TasksService) {}

  @Query()
  async getTasks():Promise<task[]> {
    return await this.tasksService.getAll();
  }
}
