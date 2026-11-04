import { Injectable, OnModuleInit, Logger, MessageEvent } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { Subject, Observable, interval, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Notification,
  NotificationCategory,
  NotificationPriority,
  NotificationActor,
  NotificationCta,
} from '../../entities/notification.entity';

export interface NotificationItem {
  id: string;
  title: string;
  actor?: NotificationActor;
  action: string;
  target?: string;
  targetUrl?: string;
  snippet: string;
  category: 'activity' | 'system' | 'security' | 'billing';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  read: boolean;
  cta?: NotificationCta;
  metadata?: Record<string, any>;
  groupCount?: number;
  groupActors?: string[];
}

export interface CreateNotificationDto {
  userId?: string | null;
  targetRole?: string;
  title: string;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  action: string;
  target?: string;
  targetUrl?: string;
  snippet: string;
  actor?: NotificationActor;
  cta?: NotificationCta;
  metadata?: Record<string, any>;
  groupCount?: number;
  groupActors?: string[];
}

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly notificationStream$ = new Subject<MessageEvent>();

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async onModuleInit() {
    await this.seedInitialNotificationsIfEmpty();
  }

  /**
   * Real-time SSE Observable Stream for live push updates
   */
  getEventStream(): Observable<MessageEvent> {
    const heartbeat$ = interval(30000).pipe(
      map(
        () =>
          ({
            data: { type: 'HEARTBEAT', timestamp: new Date().toISOString() },
          }) as MessageEvent,
      ),
    );

    return merge(this.notificationStream$.asObservable(), heartbeat$);
  }

  /**
   * Broadcast a live event to all connected admin SSE clients
   */
  private broadcastLive(type: string, data: any) {
    try {
      this.notificationStream$.next({
        data: { type, payload: data },
      } as MessageEvent);
    } catch (err) {
      this.logger.error('Error broadcasting SSE notification:', err);
    }
  }

  private mapEntityToItem(entity: Notification): NotificationItem {
    return {
      id: entity.id,
      title: entity.title,
      actor: entity.actor || undefined,
      action: entity.action,
      target: entity.target || undefined,
      targetUrl: entity.target_url || undefined,
      snippet: entity.snippet,
      category: entity.category as any,
      priority: entity.priority as any,
      createdAt: entity.created_at ? new Date(entity.created_at).toISOString() : new Date().toISOString(),
      read: entity.read,
      cta: entity.cta || undefined,
      metadata: entity.metadata || undefined,
      groupCount: entity.group_count || undefined,
      groupActors: entity.group_actors || undefined,
    };
  }

  /**
   * List notifications with search, filters, and pagination
   */
  async findAll(options?: {
    category?: string;
    unreadOnly?: boolean;
    search?: string;
    sortBy?: 'newest' | 'oldest' | 'unread' | 'priority';
    page?: number;
    limit?: number;
  }) {
    const category = options?.category;
    const unreadOnly = options?.unreadOnly;
    const search = options?.search?.trim();
    const sortBy = options?.sortBy || 'newest';
    const page = Math.max(1, Number(options?.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options?.limit) || 50));
    const skip = (page - 1) * limit;

    const qb = this.notificationRepo.createQueryBuilder('n');

    if (category && category !== 'all' && category !== 'unread') {
      qb.andWhere('n.category = :category', { category });
    }

    if (unreadOnly || category === 'unread') {
      qb.andWhere('n.read = :read', { read: false });
    }

    if (search) {
      qb.andWhere(
        '(LOWER(n.title) LIKE :q OR LOWER(n.snippet) LIKE :q OR LOWER(n.action) LIKE :q OR LOWER(n.target) LIKE :q)',
        { q: `%${search.toLowerCase()}%` },
      );
    }

    if (sortBy === 'oldest') {
      qb.orderBy('n.created_at', 'ASC');
    } else if (sortBy === 'priority') {
      qb.addSelect(
        `CASE n.priority 
          WHEN '${NotificationPriority.URGENT}' THEN 4 
          WHEN '${NotificationPriority.HIGH}' THEN 3 
          WHEN '${NotificationPriority.MEDIUM}' THEN 2 
          ELSE 1 END`,
        'priority_rank',
      );
      qb.orderBy('priority_rank', 'DESC');
      qb.addOrderBy('n.created_at', 'DESC');
    } else if (sortBy === 'unread') {
      qb.orderBy('n.read', 'ASC');
      qb.addOrderBy('n.created_at', 'DESC');
    } else {
      qb.orderBy('n.created_at', 'DESC');
    }

    const [entities, total] = await qb.skip(skip).take(limit).getManyAndCount();
    const unreadCount = await this.notificationRepo.count({ where: { read: false } });

    return {
      status: 'success',
      data: {
        items: entities.map((e) => this.mapEntityToItem(e)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      unread: unreadCount,
    };
  }

  /**
   * Fast unread count for Navbar badge
   */
  async getUnreadCount() {
    const unread = await this.notificationRepo.count({ where: { read: false } });
    return {
      status: 'success',
      unread,
    };
  }

  /**
   * Create a new notification, persist it in DB, and broadcast live
   */
  async createNotification(dto: CreateNotificationDto): Promise<NotificationItem> {
    const notification = this.notificationRepo.create({
      user_id: dto.userId || null,
      target_role: dto.targetRole || 'admin',
      title: dto.title,
      category: dto.category || NotificationCategory.ACTIVITY,
      priority: dto.priority || NotificationPriority.LOW,
      action: dto.action,
      target: dto.target,
      target_url: dto.targetUrl,
      snippet: dto.snippet,
      actor: dto.actor || null,
      cta: dto.cta || null,
      metadata: dto.metadata || null,
      read: false,
      group_count: dto.groupCount || null,
      group_actors: dto.groupActors || null,
    });

    const saved = await this.notificationRepo.save(notification);
    const item = this.mapEntityToItem(saved);

    // Live push via SSE
    this.broadcastLive('NOTIFICATION_CREATED', item);

    return item;
  }

  /**
   * Mark single notification as read
   */
  async markAsRead(id: string) {
    const notification = await this.notificationRepo.findOne({ where: { id } });
    if (notification && !notification.read) {
      notification.read = true;
      notification.read_at = new Date();
      await this.notificationRepo.save(notification);
      this.broadcastLive('NOTIFICATION_UPDATED', { id, read: true });
    }
    const unread = await this.notificationRepo.count({ where: { read: false } });
    return {
      status: 'success',
      data: notification ? this.mapEntityToItem(notification) : null,
      unread,
    };
  }

  /**
   * Mark single notification as unread
   */
  async markAsUnread(id: string) {
    const notification = await this.notificationRepo.findOne({ where: { id } });
    if (notification && notification.read) {
      notification.read = false;
      notification.read_at = null;
      await this.notificationRepo.save(notification);
      this.broadcastLive('NOTIFICATION_UPDATED', { id, read: false });
    }
    const unread = await this.notificationRepo.count({ where: { read: false } });
    return {
      status: 'success',
      data: notification ? this.mapEntityToItem(notification) : null,
      unread,
    };
  }

  /**
   * Mark all unread notifications as read
   */
  async markAllAsRead() {
    await this.notificationRepo
      .createQueryBuilder()
      .update(Notification)
      .set({ read: true, read_at: new Date() })
      .where('read = :read', { read: false })
      .execute();

    this.broadcastLive('ALL_NOTIFICATIONS_READ', {});

    return {
      status: 'success',
      data: { updatedAll: true },
      unread: 0,
    };
  }

  /**
   * Delete single notification
   */
  async remove(id: string) {
    await this.notificationRepo.delete({ id });
    this.broadcastLive('NOTIFICATION_DELETED', { id });
    const unread = await this.notificationRepo.count({ where: { read: false } });
    return {
      status: 'success',
      data: { deletedId: id },
      unread,
    };
  }

  /**
   * Clear all notifications
   */
  async clearAll() {
    await this.notificationRepo.clear();
    this.broadcastLive('ALL_NOTIFICATIONS_CLEARED', {});
    return {
      status: 'success',
      data: { cleared: true },
      unread: 0,
    };
  }

  /**
   * Simulate a live notification and persist in DB (Dev & Testing)
   */
  async simulateLive(data: Partial<NotificationItem>) {
    const item = await this.createNotification({
      title: data.title || 'Live System Alert',
      action: data.action || 'dispatched an event',
      target: data.target,
      targetUrl: data.targetUrl,
      snippet: data.snippet || 'System notification triggered via live sync.',
      category: (data.category as any) || NotificationCategory.SYSTEM,
      priority: (data.priority as any) || NotificationPriority.MEDIUM,
      actor: data.actor,
      cta: data.cta,
      metadata: data.metadata,
      groupCount: data.groupCount,
      groupActors: data.groupActors,
    });

    const unread = await this.notificationRepo.count({ where: { read: false } });
    return {
      status: 'success',
      data: item,
      unread,
    };
  }

  // ==============================================================
  // REAL-WORLD EVENT LISTENERS (NestJS EventEmitter)
  // ==============================================================

  @OnEvent('user.created')
  async handleUserCreated(payload: { user: any; actor?: any }) {
    try {
      const u = payload.user || {};
      const fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'New Member';
      await this.createNotification({
        title: 'New User Registered',
        action: 'completed registration for',
        target: u.email || 'Apearix Platform',
        targetUrl: '/admin/users',
        snippet: `${fullName} (${u.email}) joined the workspace. Role assigned: ${u.role?.name || 'User'}.`,
        category: NotificationCategory.ACTIVITY,
        priority: NotificationPriority.LOW,
        actor: payload.actor || {
          name: fullName,
          avatar: u.avatar || undefined,
          initials: (u.first_name?.[0] || 'U').toUpperCase(),
          role: 'Registered User',
        },
        cta: {
          label: 'View User',
          href: '/admin/users',
          variant: 'primary',
        },
        metadata: {
          userId: u.id,
          email: u.email,
          createdAt: u.created_at || new Date().toISOString(),
        },
      });
    } catch (err) {
      this.logger.error('Failed to handle user.created notification event:', err);
    }
  }

  @OnEvent('blog.created')
  async handleBlogCreated(payload: { blog: any; actor?: any }) {
    try {
      const b = payload.blog || {};
      await this.createNotification({
        title: 'New Blog Post Published',
        action: 'published a new article',
        target: b.title || 'Untitled Post',
        targetUrl: '/admin/blogs',
        snippet: `Article "${b.title}" is now live on the platform under category "${b.category?.name || 'General'}".`,
        category: NotificationCategory.ACTIVITY,
        priority: NotificationPriority.MEDIUM,
        actor: payload.actor || {
          name: b.author?.name || 'Content Team',
          avatar: b.author?.avatar,
          initials: 'CT',
          role: 'Editor',
        },
        cta: {
          label: 'Open Blog',
          href: '/admin/blogs',
          variant: 'secondary',
        },
        metadata: {
          blogId: b.id,
          slug: b.slug,
          status: b.status,
        },
      });
    } catch (err) {
      this.logger.error('Failed to handle blog.created notification event:', err);
    }
  }

  @OnEvent('auth.suspicious_login')
  async handleSuspiciousLogin(payload: {
    email: string;
    ip: string;
    browser?: string;
    location?: string;
    reason?: string;
  }) {
    try {
      await this.createNotification({
        title: 'Suspicious Login Intercepted',
        action: 'detected an anomalous login attempt for',
        target: payload.email,
        targetUrl: '/admin/profile?tab=security',
        snippet: `An unauthorized login attempt was intercepted from IP ${payload.ip} (${payload.browser || 'Unknown Device'}). Two-factor challenge triggered.`,
        category: NotificationCategory.SECURITY,
        priority: NotificationPriority.URGENT,
        actor: {
          name: 'Security Sentinel',
          initials: 'SS',
          role: 'Security Engine',
        },
        cta: {
          label: 'Review Security Logs',
          href: '/admin/profile?tab=security',
          variant: 'danger',
        },
        metadata: {
          ip: payload.ip,
          browser: payload.browser,
          location: payload.location || 'Unknown',
          riskScore: 'High (85/100)',
          reason: payload.reason,
        },
      });
    } catch (err) {
      this.logger.error('Failed to handle auth.suspicious_login notification event:', err);
    }
  }

  @OnEvent('system.alert')
  async handleSystemAlert(payload: {
    title: string;
    snippet: string;
    target?: string;
    targetUrl?: string;
    priority?: NotificationPriority;
    metadata?: any;
  }) {
    try {
      await this.createNotification({
        title: payload.title,
        action: 'dispatched an automated system telemetry alert for',
        target: payload.target || 'Apearix Cloud Cluster',
        targetUrl: payload.targetUrl || '/admin/dashboard',
        snippet: payload.snippet,
        category: NotificationCategory.SYSTEM,
        priority: payload.priority || NotificationPriority.HIGH,
        cta: {
          label: 'View Dashboard',
          href: payload.targetUrl || '/admin/dashboard',
          variant: 'secondary',
        },
        metadata: payload.metadata,
      });
    } catch (err) {
      this.logger.error('Failed to handle system.alert notification event:', err);
    }
  }

  /**
   * Seed standard realistic notifications if the table is completely empty
   */
  private async seedInitialNotificationsIfEmpty() {
    try {
      const count = await this.notificationRepo.count();
      if (count > 0) return;

      this.logger.log('Seeding initial realistic notifications into PostgreSQL...');

      const initialSeeds: CreateNotificationDto[] = [
        {
          title: 'Project Comment',
          actor: {
            name: 'Rahul Sharma',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            initials: 'RS',
            role: 'Lead ML Engineer',
          },
          action: 'commented on your project',
          target: 'NYAYA AI',
          targetUrl: '/admin/blogs',
          snippet: 'The latency in the vector embeddings query dropped by 38% after the Milvus index update. Ready for staging review.',
          category: NotificationCategory.ACTIVITY,
          priority: NotificationPriority.MEDIUM,
          cta: {
            label: 'Open Discussion',
            href: '/admin/blogs',
            variant: 'primary',
          },
          metadata: {
            affectedResource: 'NYAYA AI Microservice',
            details: 'Thread #4912 in PR #28',
          },
        },
        {
          title: 'Suspicious Login Alert',
          actor: {
            name: 'Security Sentinel',
            initials: 'SS',
            role: 'System Bot',
          },
          action: 'detected an unauthorized login attempt from an unknown IP',
          target: 'Admin Portal',
          targetUrl: '/admin/profile?tab=security',
          snippet: 'New login attempt intercepted from IP 103.21.244.2 (Mumbai, Chrome on macOS). Two-Factor challenge was triggered.',
          category: NotificationCategory.SECURITY,
          priority: NotificationPriority.URGENT,
          cta: {
            label: 'Review Security Log',
            href: '/admin/profile?tab=security',
            variant: 'danger',
          },
          metadata: {
            ip: '103.21.244.2',
            location: 'Mumbai, Maharashtra, IN',
            browser: 'Chrome 128.0.0 (macOS Sequoia)',
            riskScore: 'High (88/100)',
          },
        },
        {
          title: 'Payment Received',
          action: 'successfully processed invoice',
          target: '#INV-2026-089',
          targetUrl: '/admin/settings',
          snippet: 'Enterprise Cloud Cluster subscription payment of $2,450.00 was confirmed via Stripe recurring billing.',
          category: NotificationCategory.BILLING,
          priority: NotificationPriority.MEDIUM,
          cta: {
            label: 'View Invoice',
            href: '/admin/settings',
            variant: 'outline',
          },
          metadata: {
            invoiceId: 'INV-2026-089',
            amount: '$2,450.00 USD',
            method: 'Corporate Visa ending in 4091',
            status: 'Settled',
          },
        },
        {
          title: 'Scheduled Maintenance Alert',
          action: 'scheduled automated cluster maintenance',
          target: 'Sirus Core DB',
          targetUrl: '/admin/dashboard',
          snippet: 'PostgreSQL 17 replication failover and vacuum optimization window is scheduled for Sunday at 02:00 AM IST.',
          category: NotificationCategory.SYSTEM,
          priority: NotificationPriority.HIGH,
          cta: {
            label: 'Maintenance Schedule',
            href: '/admin/dashboard',
            variant: 'secondary',
          },
          metadata: {
            affectedResource: 'Sirus PostgreSQL Primary + Replica',
            window: 'Sunday 02:00 AM - 02:30 AM IST',
            impact: 'Read-only mode during switchover',
          },
        },
        {
          title: 'Automated Backup Completed',
          action: 'finished daily snapshot verification',
          target: 'Primary Storage Cluster',
          targetUrl: '/admin/dashboard',
          snippet: 'Backup snapshot verified with SHA-256 checksum. Total archive size 18.42 GB stored across AWS S3 Mumbai region.',
          category: NotificationCategory.SYSTEM,
          priority: NotificationPriority.LOW,
          metadata: {
            snapshotId: 'snp-20261015-0400',
            size: '18.42 GB',
            status: 'Verified Healthy',
          },
        },
        {
          title: 'Domain SSL Certificate Auto-Renewed',
          action: 'renewed Let\'s Encrypt wildcard certificate',
          target: '*.apearix.com',
          targetUrl: '/admin/settings',
          snippet: 'Wildcard SSL certificates for api.apearix.com and admin.apearix.com have been renewed for 90 days with zero downtime.',
          category: NotificationCategory.SECURITY,
          priority: NotificationPriority.LOW,
          metadata: {
            validUntil: '15 Jan 2027',
            issuer: 'Let\'s Encrypt Authority X3',
          },
        },
      ];

      for (const seed of initialSeeds) {
        await this.createNotification(seed);
      }

      this.logger.log('Successfully seeded initial notifications.');
    } catch (err) {
      this.logger.error('Failed to seed notifications:', err);
    }
  }
}
