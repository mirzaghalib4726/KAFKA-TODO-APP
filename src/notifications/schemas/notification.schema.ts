import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: String, required: true })
  event: string;

  @Prop({ type: Object, required: true })
  data: object;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
