import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaModule } from 'src/kafka/kafka.module';
import { Task, TaskSchema } from 'src/task/schemas/task.schema';
import { TaskController } from 'src/task/task.controller';
import { TaskService } from 'src/task/task.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    KafkaModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
