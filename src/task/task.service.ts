import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KafkaService } from 'src/kafka/kafka.service';
import { Task } from 'src/task/schemas/task.schema';
import { formatResponse } from 'src/utils/response';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private readonly kafkaService: KafkaService,
  ) {}

  async createTask(data) {
    try {
      const createdTask = new this.taskModel({ ...data, user: data.user_id });
      const savedTask = await createdTask.save();
      this.kafkaService.publishEvent('task_created', savedTask);
      return formatResponse(201, 'Task Created Successfully', savedTask);
    } catch (e) {
      throw new HttpException(e.message, e.status || 500);
    }
  }

  async findAllTask(user_id) {
    try {
      const allTasks = await this.taskModel.find({ user: user_id }).lean();

      if (allTasks.length == 0) {
        throw { message: 'Tasks Not Found', status: 404 };
      }

      return formatResponse(200, 'Tasks fetched successfully', allTasks);
    } catch (e) {
      throw new HttpException(e.message, e.status || 500);
    }
  }

  async updateTask(task_id, data) {
    try {
      const updatedTask = await this.taskModel.findOneAndUpdate(
        { _id: task_id },
        { $set: data },
        { new: true, runValidators: true },
      );

      if (!updatedTask) {
        throw { message: 'Task Not Found', status: 404 };
      }

      await this.kafkaService.publishEvent('task_updated', updatedTask);

      return formatResponse(200, 'Task updated successfully', updatedTask);
    } catch (e) {
      throw new HttpException(e.message, e.status || 500);
    }
  }

  async deleteTask(task_id) {
    try {
      const result = await this.taskModel.findOneAndDelete({ _id: task_id });

      if (!result) {
        throw { message: 'Task Not Found', status: 404 };
      }

      await this.kafkaService.publishEvent('task_deleted', result);

      return formatResponse(200, 'Task deleted successfully', result);
    } catch (e) {
      throw new HttpException(e.message, e.status || 500);
    }
  }
}
