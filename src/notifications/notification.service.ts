import {
  HttpException,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';
import { Model } from 'mongoose';
import { Notification } from 'src/notifications/schemas/notification.schema';
import { formatResponse } from 'src/utils/response';

@Injectable()
export class NotificationService implements OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {
    const kafka = new Kafka({
      clientId: 'nestjs-kafka-consumer',
      brokers: ['localhost:9092'],
    });

    this.consumer = kafka.consumer({ groupId: 'notification-consumer-group' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'task-events',
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const { topic, partition, message } = payload;
        const eventKey = message.key ? message.key.toString() : null;
        const value = message.value?.toString();
        await this.createNotification(eventKey, value);
        await this.consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (Number(message.offset) + 1).toString(),
          },
        ]);
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }

  private async createNotification(eventType, message) {
    try {
      const jsonParse = JSON.parse(message);
      const { title, description, completed } = jsonParse;

      const createdNotification = new this.notificationModel({
        event: eventType,
        data: { title, description, completed },
        user: jsonParse.user,
      });
      const savedNotification = await createdNotification.save();

      return formatResponse(
        201,
        'Notification Created Successfully',
        savedNotification,
      );
    } catch (e) {
      throw new HttpException(e.message, e.status || 500);
    }
  }

  async getNotifications(user_id) {
    try {
      const notifications = await this.notificationModel
        .find({
          user: user_id,
          read: false,
        })
        .lean();

      if (notifications.length == 0) {
        throw {
          message: 'No notification found for the user',
          status: 404,
        };
      }

      await this.notificationModel.updateMany(
        {
          user: user_id,
          read: false,
        },
        {
          $set: { read: true },
        },
      );

      return formatResponse(
        200,
        'Notifications fetched successfully',
        notifications,
      );
    } catch (e) {
      throw new HttpException(e.message, e.status || 500);
    }
  }
}
