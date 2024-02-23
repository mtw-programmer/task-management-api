import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        PrismaService,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should call authService.login and return the response', async () => {
    const authData = { username: 'auth_test2', password: '1234567890' };
    const responseMock: any = {
      send: jest.fn(),
    };
    const sessionMock: Record<string, any> = {
      user: undefined,
      save: jest.fn().mockResolvedValueOnce(undefined),
    };

    const authSpy = jest.spyOn(authService, 'login').mockResolvedValueOnce({ message: 'Successfully logged in' });
    await authController.account(authData, sessionMock,responseMock);

    expect(authSpy).toHaveBeenCalledWith(authData);

    expect(sessionMock.save).toHaveBeenCalledTimes(1);

    expect(sessionMock.user).toBe(authData.username);
    expect(responseMock.send).toHaveBeenCalledWith({ message: 'Successfully logged in' });
  });
});
