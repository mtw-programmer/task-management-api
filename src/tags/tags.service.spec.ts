import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterService } from 'src/register/register.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Tag } from '@prisma/client';

describe('TagsService', () => {
  let tagsService: TagsService;
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        UsersService,
        PrismaService,
        RegisterService
      ],
      controllers: [
        AuthGuard
      ]
    }).compile();

    tagsService = module.get<TagsService>(TagsService);
    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(tagsService).toBeDefined();
  });

  it('throws 401 when user is not authenticated', async () => {
    const req = undefined;
    await expect(tagsService.findOne(req, 1)).rejects.toThrow(UnauthorizedException);
    await expect(tagsService.getAll(req)).rejects.toThrow(UnauthorizedException);
  });

  it('throws 401 when user id not found', async () => {
    const req = { session: { user: 1 } };
    usersService.idExists = jest.fn().mockResolvedValue(false);
    await expect(tagsService.findOne(req, 1)).rejects.toThrow(UnauthorizedException);
    await expect(tagsService.getAll(req)).rejects.toThrow(UnauthorizedException);
  });

  it('throws 404 when tag id not found', async () => {
    const req = { session: { user: 1 } };
    usersService.idExists = jest.fn().mockResolvedValue(true);
    // No 0 ID in db, so rejects
    await expect(tagsService.findOne(req, 0)).rejects.toThrow(NotFoundException);
  });

  it('returns tag with the given id for authenticated user', async () => {
    const req = { session: { user: 1 } };
    usersService.idExists = jest.fn().mockResolvedValue(true);

    const tag: Tag = { id: 1, userId: 1, title: 'Tag 1', color: 'ff0000' };

    const findOneSpy = jest.spyOn(tagsService['prisma'].tag, 'findUniqueOrThrow').mockResolvedValue(tag);
    const res = await tagsService.findOne(req, 1);

    expect(res).toEqual(tag);
    expect(findOneSpy).toHaveBeenCalledWith({ where: { id: 1, userId: 1 } });
  });

  it('returns all tags for authenticated user', async () => {
    const req = { session: { user: 1 } };
    usersService.idExists = jest.fn().mockResolvedValue(true);

    const tags: Tag[] = [
      
      { id: 1, userId: 1, title: 'Tag 1', color: 'ff0000' },
      { id: 2, userId: 1, title: 'Tag 2', color: '0000ff' },
    ];

    const findOneSpy = jest.spyOn(tagsService['prisma'].tag, 'findMany').mockResolvedValue(tags);
    const res = await tagsService.getAll(req);

    expect(res).toEqual(tags);
    expect(findOneSpy).toHaveBeenCalledWith({ where: { userId: 1 } });
  });
});
