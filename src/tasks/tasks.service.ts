import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor (private prisma: PrismaService) {}

  async findOne(id: number):Promise<task> {
    return await this.prisma.task
      .findUniqueOrThrow({
        where: { id }
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async getAll():Promise<task[]> {
    return await this.prisma.task.findMany();
  }
}
