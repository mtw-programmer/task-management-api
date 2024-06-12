import { Controller, Post, Body, ValidationPipe, Res, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { TasksService } from './tasks.service';
import { Task } from './tasks.validator';
import { Task as TaskValidator } from './tasks.validator';

@Controller('tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create new task' })
  async create(
    @Req() req: Request,
    @Body(new ValidationPipe()) Task: Task,
    @Res() res: Response,
  ) {
    const { id } = await this.tasksService.create(req, Task as TaskValidator);
    return res.send({ id });
  }
}
