import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';
import { RegisterService } from './register/register.service';
import { RegisterController } from './register/register.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { TasksService } from './tasks/tasks.service';
import { TasksResolver } from './tasks/tasks.resolver';
import { TagsService } from './tags/tags.service';
import { TagsController } from './tags/tags.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
    }),
  ],
  controllers: [AppController, RegisterController, AuthController, TagsController],
  providers: [AppService, PrismaService, UsersService, RegisterService, AuthService, TasksService, TasksResolver, TagsService],
})
export class AppModule {}
