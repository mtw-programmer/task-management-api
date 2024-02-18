import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { RegisterService } from './register.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('RegisterService', () => {
  let registerService: RegisterService;
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        UsersService,
        PrismaService,
      ],
    }).compile();

    registerService = module.get<RegisterService>(RegisterService);
    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(registerService).toBeDefined();
  });

  it('returns 400 when username is already taken', async () => {
    await usersService.insertOne({ username: 'register_test', password: '1234567890' });

    await expect(
      registerService.register({ username: 'register_test', password: '1234567890' })
    ).rejects.toEqual(new BadRequestException(['This username is already taken']));

    await usersService.deleteOne('register_test');
  });

  it('saves user to database', async () => {
    const username = 'register_test2';
    const password = '1234567890';

    await registerService.register({ username, password });
    const res = await usersService.findOne(username);

    await usersService.deleteOne(username);

    expect(res.username).toBe(username);
    expect(argon2.verify(res.password, password)).resolves.toBeTruthy();
  });
});
