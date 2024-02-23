import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { RegisterService } from 'src/register/register.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let registerService: RegisterService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        RegisterService,
        PrismaService
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    registerService = module.get<RegisterService>(RegisterService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('returns 404 when user was not found', async () => {
    expect(authService.login({ username: '404', password: '1234567890' })).rejects.toThrow(
      new NotFoundException()
    );
  });

  it('returns 400 when password is invalid', async () => {
    await registerService.register({ username: 'auth_test1', password: '1234567890' });
    await expect(authService.login({ username: 'auth_test1', password: 'Invalid_Password' })).rejects.toThrow(
      new BadRequestException(['Invalid username or password'])
    );
    await usersService.deleteOne('auth_test1');
  });

  it('returns 200 when correct credentials were given', async () => {
    await registerService.register({ username: 'auth_test1', password: '1234567890' });
    const res = await authService.login({ username: 'auth_test1', password: '1234567890' });
    expect(res.message).toBeDefined();
    await usersService.deleteOne('auth_test1');
  });
});
