import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { TagsResolver } from './tags.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TagsService } from './tags.service';
import { UsersService } from 'src/users/users.service';
import { Tag } from '@prisma/client';

function createContext(data: any): any {
  const ctx = new ExecutionContextHost([]);
  ctx.switchToHttp().getRequest = () => data.req;
  return ctx;
}

describe('TagsResolver', () => {
  let resolver: TagsResolver;
  let tagsService: TagsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsResolver,
        TagsService,
        UsersService,
        PrismaService
      ],
      controllers: [
        AuthGuard
      ]
    }).compile();

    resolver = module.get<TagsResolver>(TagsResolver);
    tagsService = module.get<TagsService>(TagsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('returns tag with the given id', async () => {
    const tag: Tag = { id: 1, userId: 1, title: 'Tag 1', color: 'ff0000' };

    jest.spyOn(tagsService, 'findOne').mockResolvedValue(tag);

    const ctx = createContext({ req: { session: { user: 1 } } });

    const res = await resolver.getTag(ctx, 1);
    expect(res).toEqual(tag);
  });

  it('returns all tags', async () => {
    const tags: Tag[] = [
      { id: 1, userId: 1, title: 'Tag 1', color: 'ff0000' },
      { id: 2, userId: 1, title: 'Tag 2', color: '0000ff' }
    ];

    jest.spyOn(tagsService, 'getAll').mockResolvedValue(tags);

    const ctx = createContext({ req: { session: { user: 1 } } });

    const res = await resolver.getTags(ctx);
    expect(res).toEqual(tags);
  });
});
