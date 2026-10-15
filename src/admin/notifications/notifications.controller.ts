import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { NotificationsService, NotificationItem } from './notifications.service';

@ApiTags('Admin - Notifications')
@Controller('api/v1/admin/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'List admin notifications', operationId: 'get-admin-notifications' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.notificationsService.findAll(
      category,
      unreadOnly === 'true' || unreadOnly === '1',
    );
  }

  @ApiOperation({ summary: 'Mark all notifications as read', operationId: 'mark-all-notifications-read' })
  @Post('mark-all-read')
  markAllAsRead() {
    return this.notificationsService.markAllAsRead();
  }

  @ApiOperation({ summary: 'Clear all notifications', operationId: 'clear-all-notifications' })
  @Delete('clear-all')
  clearAll() {
    return this.notificationsService.clearAll();
  }

  @ApiOperation({ summary: 'Simulate live notification event', operationId: 'simulate-live-notification' })
  @Post('simulate')
  simulateLive(@Body() body: Partial<NotificationItem>) {
    return this.notificationsService.simulateLive(body);
  }

  @ApiOperation({ summary: 'Mark single notification as read', operationId: 'mark-notification-read' })
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @ApiOperation({ summary: 'Mark single notification as unread', operationId: 'mark-notification-unread' })
  @Patch(':id/unread')
  markAsUnread(@Param('id') id: string) {
    return this.notificationsService.markAsUnread(id);
  }

  @ApiOperation({ summary: 'Delete single notification', operationId: 'delete-notification' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
