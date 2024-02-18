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

    await usersService.insertOne({ username: 'test', password: '1234567890' });
  })

  afterEach(async () => {
    await usersService.deleteOne('test');
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(registerService).toBeDefined();
  })

  it('returns 400 when username is already taken', async () => {
    await expect(
      registerService.register({ username: 'test', password: '1234567890' })
    ).rejects.toEqual(new BadRequestException(['This username is already taken']));
  });

  it('saves user to database', async () => {
    const username = 'test2';
    const password = '1234567890';

    await registerService.register({ username, password });
    const res = await usersService.findOne(username);

    await usersService.deleteOne(username);

    expect(res.username).toBe(username);
    expect(argon2.verify(res.password, password)).resolves.toBeTruthy();
  });
});
