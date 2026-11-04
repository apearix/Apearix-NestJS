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
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationsService, NotificationItem } from './notifications.service';

@ApiTags('Admin - Notifications')
@Controller('api/v1/admin/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Real-time Server-Sent Events stream for live notifications', operationId: 'stream-notifications' })
  @Sse('stream')
  streamNotifications(): Observable<MessageEvent> {
    return this.notificationsService.getEventStream();
  }

  @ApiOperation({ summary: 'Get total unread notification count', operationId: 'get-unread-count' })
  @Get('unread-count')
  getUnreadCount() {
    return this.notificationsService.getUnreadCount();
  }

  @ApiOperation({ summary: 'List admin notifications with pagination and search', operationId: 'get-admin-notifications' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['newest', 'oldest', 'unread', 'priority'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: 'newest' | 'oldest' | 'unread' | 'priority',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notificationsService.findAll({
      category,
      unreadOnly: unreadOnly === 'true' || unreadOnly === '1',
      search,
      sortBy,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
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

  @ApiOperation({ summary: 'Simulate live notification event (persisted in DB + live SSE)', operationId: 'simulate-live-notification' })
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
