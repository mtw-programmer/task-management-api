import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterService } from 'src/register/register.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Task } from '@prisma/client';
import NewTask from './NewTask.interface';
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
      usersService.idExists = jest.fn().mockResolvedValue(true);

      const task: NewTask = { title: 'Task 1', details: 'Details', tags: [1, 2, 3] };

      tagsService.idExists = jest.fn().mockImplementation(async (tagId) => {
        return [1, 2].includes(tagId);
      });

      let response;

      try {
        response = await tasksService.createTask(req, task);
      } catch (ex) {
        response = ex.response;
      }

      expect(response.statusCode).toBe(400);
    });
    
    it('creates task', async () => {
      const req = { session: { user: 1 } };
      usersService.idExists = jest.fn().mockResolvedValue(true);

      const task: NewTask = { title: 'Task 1', details: 'Details', tags: [1] };

      const response = await tasksService.createTask(req, task);

      const savedTask = await tasksService.findOne(req, response.id);

      const containsProperties = (obj: object, target: object): boolean =>
        Object.keys(target).every(key => obj[key] === target[key]);

      expect(containsProperties(task, savedTask)).toBeTruthy();
    });
  });
});
