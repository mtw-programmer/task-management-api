import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { user } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor (private prisma: PrismaService) {}

  async exists(username: string):Promise<boolean> {
    const result = await this.prisma.user.findUnique({ where: { username } });
    return !!result;
  }

  async findOne(username: string):Promise<user> {
    return await this.prisma.user
      .findUniqueOrThrow({
        where: { username }
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async insertOne({ username, password }):Promise<user> {
    return await this.prisma.user
      .create({
        data: {
          username,
          password,
        }
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });
  }

  async deleteOne(username:string):Promise<user> {
    return await
      this.prisma.user.delete({ where: { username } })
      .catch(() => {
        throw new InternalServerErrorException();
      });
  }
}
