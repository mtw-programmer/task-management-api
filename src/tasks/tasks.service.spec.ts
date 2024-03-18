import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterService } from 'src/register/register.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Task } from '@prisma/client';

describe('TasksService', () => {
  let tasksService: TasksService;
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        UsersService,
        PrismaService,
        RegisterService
      ],
      controllers: [
        AuthGuard
      ]
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  it('throws 401 when user is not authenticated', async () => {
    const req = undefined;
    await expect(tasksService.findOne(req, 1)).rejects.toThrow(UnauthorizedException);
    await expect(tasksService.getAll(req)).rejects.toThrow(UnauthorizedException);
  });

  it('throws 401 when user id not found', async () => {
    const req = { session: { user: 1 } };
    usersService.idExists = jest.fn().mockResolvedValue(false);
    await expect(tasksService.findOne(req, 1)).rejects.toThrow(UnauthorizedException);
    await expect(tasksService.getAll(req)).rejects.toThrow(UnauthorizedException);
  });

  it('throws 404 when task id not found', async () => {
    const req = { session: { user: 1 } };
    usersService.idExists = jest.fn().mockResolvedValue(true);
    // No 0 ID in db, so rejects
    await expect(tasksService.findOne(req, 0)).rejects.toThrow(NotFoundException);
  });

  it('returns task with the given id for authenticated user', async () => {
    const req = { session: { user: 1 } };
    usersService.idExists = jest.fn().mockResolvedValue(true);

    const task: Task = { id: 1, userId: 1, title: 'Task 1', details: 'details', status: 'BACKLOG' };

    const findOneSpy = jest.spyOn(tasksService['prisma'].task, 'findUniqueOrThrow').mockResolvedValue(task);
    const res = await tasksService.findOne(req, 1);

    expect(res).toEqual(task);
    expect(findOneSpy).toHaveBeenCalledWith({ where: { id: 1, userId: 1 } });
  });

  it('returns all tasks for authenticated user', async () => {
    const req = { session: { user: 1 } };
    usersService.idExists = jest.fn().mockResolvedValue(true);

    const tasks: Task[] = [
      { id: 1, userId: 1, title: 'Task 1', details: 'details', status: 'BACKLOG' },
      { id: 2, userId: 1, title: 'Task 2', details: 'details', status: 'IN_PROGRESS' },
    ];

    const findOneSpy = jest.spyOn(tasksService['prisma'].task, 'findMany').mockResolvedValue(tasks);
    const res = await tasksService.getAll(req);

    expect(res).toEqual(tasks);
    expect(findOneSpy).toHaveBeenCalledWith({ where: { userId: 1 } });
  });
});
