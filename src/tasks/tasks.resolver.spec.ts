import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { TasksResolver } from './tasks.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TasksService } from './tasks.service';
import { UsersService } from 'src/users/users.service';
import { Task } from '@prisma/client';

function createContext(data: any): any {
  const ctx = new ExecutionContextHost([]);
  ctx.switchToHttp().getRequest = () => data.req;
  return ctx;
}

describe('TasksResolver', () => {
  let resolver: TasksResolver;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksResolver,
        TasksService,
        UsersService,
        PrismaService
      ],
      controllers: [
        AuthGuard
      ]
    }).compile();

    resolver = module.get<TasksResolver>(TasksResolver);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('returns task with the given id', async () => {
    const task: Task = { id: 1, userId: 1, title: 'Task 1', details: 'details', status: 'BACKLOG' };

    jest.spyOn(tasksService, 'findOne').mockResolvedValue(task);

    const ctx = createContext({ req: { session: { user: 1 } } });

    const res = await resolver.getTask(ctx, 1);
    expect(res).toEqual(task);
  });

  it('returns all tasks', async () => {
    const tasks: Task[] = [
      { id: 1, userId: 1, title: 'Task 1', details: 'details', status: 'BACKLOG' },
      { id: 2, userId: 1, title: 'Task 2', details: 'details', status: 'IN_PROGRESS' }
    ];

    jest.spyOn(tasksService, 'getAll').mockResolvedValue(tasks);

    const ctx = createContext({ req: { session: { user: 1 } } });

    const res = await resolver.getTasks(ctx);
    expect(res).toEqual(tasks);
  });
});
