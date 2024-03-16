import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterService } from 'src/register/register.service';
import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

describe('TasksService', () => {
  let tasksService: TasksService;
  let usersService: UsersService;
  let registerService: RegisterService;
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
    registerService = module.get<RegisterService>(RegisterService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
  });
});
