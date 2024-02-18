import { Test, TestingModule } from '@nestjs/testing';
import { RegisterService } from './register.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('RegisterService', () => {
  let registerService: RegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegisterService, UsersService, PrismaService],
    }).compile();

    registerService = module.get<RegisterService>(RegisterService);

  });

  it('should be defined', () => {
    expect(registerService).toBeDefined();
  });
});
