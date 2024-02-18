import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);

    await usersService.insertOne({ username: 'test', password: '1234567890' });
  });

  afterEach(async () => {
    await usersService.deleteOne('test');
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('[insertOne]: should insert user', async () => {
    const username = 'test2';
    const password = '1234567890';

    const res = await usersService.insertOne({ username, password });

    await usersService.deleteOne(username);

    expect(res.username).toBe(username);
    expect(res.password).toBe(password);
  });

  it('[insertOne]: should throw internal server error when duplicated username', () => {
    const username = 'test';
    const password = '1234567890';

    expect(usersService.insertOne({ username, password })).rejects.toThrow(
      InternalServerErrorException
    );
  });

  it('[exists]: should return false when no user', async () => {
    const res = await usersService.exists('404');
    expect(res).toBeFalsy();
  });

  it('[exists]: should return true when user exists', async () => {
    const res = await usersService.exists('test');
    expect(res).toBeTruthy();
  });

  it('[findOne]: should return user', async () => {
    const res = await usersService.findOne('test');
    expect(res.username).toBe('test');
    expect(res.password).toBe('1234567890');
  });

  it('[findOne]: should throw not found when no username', () => {
    expect(usersService.findOne('404')).rejects.toThrow(
      NotFoundException
    );
  });

  it('[deleteOne]: should delete user', async () => {
    const username = 'test2';
    const password = '1234567890';

    await usersService.insertOne({ username, password });

    const res = await usersService.deleteOne(username);
    expect(res.username).toBe(username);
  });

  it('[deleteOne]: should throw internal server error when no username', () => {
    expect(usersService.deleteOne('404')).rejects.toThrow(
      InternalServerErrorException
    );
  });
});
