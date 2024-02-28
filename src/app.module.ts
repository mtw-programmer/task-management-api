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
import { GraphqlService } from './graphql/graphql.service';
import { TasksService } from './tasks/tasks.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
    }),
  ],
  controllers: [AppController, RegisterController, AuthController],
  providers: [AppService, PrismaService, UsersService, RegisterService, AuthService, GraphqlService, TasksService],
})
export class AppModule {}
