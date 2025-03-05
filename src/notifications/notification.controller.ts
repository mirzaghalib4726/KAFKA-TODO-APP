import { Controller, Get, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('unread/:user_id')
  getNotifications(@Param('user_id') user_id: string) {
    return this.notificationService.getNotifications(user_id);
  }
}
