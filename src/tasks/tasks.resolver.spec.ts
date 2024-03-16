import { Test, TestingModule } from '@nestjs/testing';
import { TasksResolver } from './tasks.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TasksService } from './tasks.service';
import { UsersService } from 'src/users/users.service';

describe('TasksResolver', () => {
  let resolver: TasksResolver;

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
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
