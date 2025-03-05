import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';
import { UpdateTaskDto } from 'src/task/dto/update-task.dto';
import { TaskService } from 'src/task/task.service';

@ApiTags('task')
@ApiBearerAuth()
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  createTask(@Body() data: CreateTaskDto) {
    return this.taskService.createTask(data);
  }

  @Get('all/:user_id')
  findAllTask(@Param('user_id') user_id: string) {
    return this.taskService.findAllTask(user_id);
  }

  @Patch(':task_id')
  updateTask(@Param('task_id') task_id: string, @Body() data: UpdateTaskDto) {
    return this.taskService.updateTask(task_id, data);
  }

  @Delete(':task_id')
  deleteTask(@Param('task_id') task_id: string) {
    return this.taskService.deleteTask(task_id);
  }
}
