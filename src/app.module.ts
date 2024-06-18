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
import { TagsService } from './tags/tags.service';
import { TagsController } from './tags/tags.controller';
import { TagsResolver } from './tags/tags.resolver';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
    }),
    TasksModule,
  ],
  controllers: [AppController, RegisterController, AuthController, TagsController],
  providers: [AppService, PrismaService, UsersService, RegisterService, AuthService, TagsService, TagsResolver],
})
export class AppModule {}
