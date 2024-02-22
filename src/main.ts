import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import RedisStore from 'connect-redis';
import { createClient } from "redis";
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const redisClient = createClient();
  redisClient.connect();

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: "tasks:",
  });

  app.use(cookieParser());
  app.enableCors({
    origin: configService.get('TARGET_SITE', 'localhost:3000'),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  app.use(helmet());

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API allowing to manage tasks on your account')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(configService.get('PORT', 3000));
}
bootstrap();
