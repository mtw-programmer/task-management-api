import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { RegisterService } from './register.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('RegisterService', () => {
  let registerService: RegisterService;
  let usersService:UsersService;

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

    await usersService.insertOne({ username: 'test', password: '1234567890' });
  })

  afterEach(async () => {
    await usersService.deleteOne('test');
  })

  it('should be defined', () => {
    expect(registerService).toBeDefined();
  })

  it('returns 400 when username is already taken', () => {
    expect(
      registerService.register({ username: 'test', password: '1234567890' })
    ).rejects.toEqual(new BadRequestException('This username is already taken'));
  });

  it('saves user to database', async () => {
    await registerService.register({ username: 'test2', password: '1234567890' });
    const res = await usersService.findOne('test2');

    await usersService.deleteOne('test2');

    expect(res.username).toBe('test2');
    expect(argon2.verify(res.password, '1234567890')).resolves.toBeTruthy();
  });
});
