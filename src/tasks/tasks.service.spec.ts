import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterService } from 'src/register/register.service';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Task, Tag } from '@prisma/client';
import { Task as TaskValidator } from './tasks.validator';
import { TagsService } from 'src/tags/tags.service';

describe('TasksService', () => {
  let tasksService: TasksService;
  let tagsService: TagsService;
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        TagsService,
        UsersService,
        PrismaService,
        RegisterService
      ],
      controllers: [
        AuthGuard
      ]
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tagsService = module.get<TagsService>(TagsService);
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

  describe('Get', () => {
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

  describe('Create', () => {
    it('returns 400 when invalid tag id given', async () => {
      const req: Request = { session: { user: 1 } } as unknown as Request;
      jest.spyOn(usersService, 'idExists').mockResolvedValue(true);
      jest.spyOn(tagsService, 'areTagsValid').mockResolvedValue(false);

      const task: TaskValidator = { title: 'Task 1', details: 'Details', tags: [1, 2, 3] };

      await expect(tasksService.create(req, task)).rejects.toThrow(BadRequestException);
    });
    
    it('creates task', async () => {
      const req = { session: { user: 1 } };
      const taskValidator = { title: 'New Task', details: 'Task details', tags: [1, 2] };

      jest.spyOn(usersService, 'idExists').mockResolvedValue(true);
      jest.spyOn(tagsService, 'areTagsValid').mockResolvedValue(true);

      jest.spyOn(prismaService.task, 'create').mockResolvedValue({ id: 1 } as any);

      const result = await tasksService.create(req, taskValidator);

      expect(result).toEqual({ taskId: 1, message: 'Successfully created a new task' });
    });
  });
});
