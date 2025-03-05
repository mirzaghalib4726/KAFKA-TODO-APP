import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private producer: Producer;

  constructor() {
    const kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID_PRODUCER,
      brokers: [process.env.KAFKA_BROKER],
    });
    this.producer = kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async publishEvent(eventType, task) {
    await this.producer.connect();
    const record: ProducerRecord = {
      topic: process.env.KAFKA_TOPIC,
      messages: [{ key: eventType, value: JSON.stringify(task) }],
    };
    await this.producer.send(record);
    await this.producer.disconnect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
