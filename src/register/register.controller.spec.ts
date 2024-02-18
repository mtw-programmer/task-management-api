import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('RegisterController', () => {
  let controller: RegisterController;
  let registerService: RegisterService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [RegisterService, UsersService, PrismaService],
    }).compile();

    controller = module.get<RegisterController>(RegisterController);
    registerService = module.get<RegisterService>(RegisterService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call registerService.register and return the response', async () => {
    const registerData = { username: 'register_test3', password: '1234567890' };
    const responseMock: any = { send: jest.fn() } as any;

    const registerServiceSpy = jest.spyOn(registerService, 'register').mockResolvedValueOnce({ message: 'You have been successfully registered' });

    await controller.account(registerData, responseMock);

    expect(registerServiceSpy).toHaveBeenCalledWith(registerData);

    expect(responseMock.send).toHaveBeenCalledWith({ message: 'You have been successfully registered' });
  });
});
