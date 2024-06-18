
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { TasksController } from './tasks.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { TagsService } from 'src/tags/tags.service';

@Module({
  providers: [TasksService, TasksResolver, PrismaService, UsersService, TagsService],
  controllers: [TasksController],
})
export class TasksModule {}