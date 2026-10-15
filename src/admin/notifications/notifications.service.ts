import { Injectable } from '@nestjs/common';

export interface NotificationItem {
  id: string;
  title: string;
  actor?: {
    name: string;
    avatar?: string;
    initials?: string;
    role?: string;
  };
  action: string;
  target?: string;
  targetUrl?: string;
  snippet: string;
  category: 'activity' | 'system' | 'security' | 'billing';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  read: boolean;
  cta?: {
    label: string;
    href?: string;
    action?: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  };
  metadata?: Record<string, any>;
  groupCount?: number;
  groupActors?: string[];
}

@Injectable()
export class NotificationsService {
  private notifications: NotificationItem[] = [
    {
      id: 'notif-1',
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
      category: 'activity',
      priority: 'medium',
      createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      read: false,
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
      id: 'notif-2',
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
      category: 'security',
      priority: 'urgent',
      createdAt: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
      read: false,
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
      id: 'notif-3',
      title: 'Payment Received',
      action: 'successfully processed invoice',
      target: '#INV-2026-089',
      targetUrl: '/admin/settings',
      snippet: 'Enterprise Cloud Cluster subscription payment of $2,450.00 was confirmed via Stripe recurring billing.',
      category: 'billing',
      priority: 'medium',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
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
      id: 'notif-4',
      title: 'Scheduled Maintenance Alert',
      action: 'scheduled automated cluster maintenance',
      target: 'Sirus Core DB',
      targetUrl: '/admin/dashboard',
      snippet: 'PostgreSQL 17 replication failover and vacuum optimization window is scheduled for Sunday at 02:00 AM IST (approx 15 mins downtime).',
      category: 'system',
      priority: 'high',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      read: true,
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
      id: 'notif-5',
      title: 'Team Kudos & Likes',
      actor: {
        name: 'Ananya Verma',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        initials: 'AV',
        role: 'Frontend Architect',
      },
      action: 'and 4 others reacted to your architectural doc',
      target: 'Building Modern Microservices with NestJS',
      targetUrl: '/admin/blogs',
      snippet: 'Team members bookmarked your RFC document and added 5 comments regarding caching strategies.',
      category: 'activity',
      priority: 'low',
      createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
      read: true,
      groupCount: 5,
      groupActors: ['Ananya Verma', 'Vikram Sen', 'Priya Das', 'Mohit Jain', 'Rohan Mehta'],
      cta: {
        label: 'View Reactions',
        href: '/admin/blogs',
        variant: 'secondary',
      },
    },
    {
      id: 'notif-6',
      title: 'Automated Backup Completed',
      action: 'finished daily snapshot verification',
      target: 'Primary Storage Cluster',
      snippet: 'Backup snapshot verified with SHA-256 checksum. Total archive size 18.42 GB stored across AWS S3 Mumbai region.',
      category: 'system',
      priority: 'low',
      createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
      read: true,
      metadata: {
        snapshotId: 'snp-20261015-0400',
        size: '18.42 GB',
        status: 'Verified Healthy',
      },
    },
    {
      id: 'notif-7',
      title: 'Domain SSL Certificate Auto-Renewed',
      action: 'renewed Let\'s Encrypt wildcard certificate',
      target: '*.apearix.com',
      snippet: 'Wildcard SSL certificates for api.apearix.com and admin.apearix.com have been renewed for 90 days with zero downtime.',
      category: 'security',
      priority: 'low',
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      read: true,
      metadata: {
        validUntil: '15 Jan 2027',
        issuer: 'Let\'s Encrypt Authority X3',
      },
    },
    {
      id: 'notif-8',
      title: 'Annual License Renewal Reminder',
      action: 'sent an upcoming renewal notification',
      target: 'Apearix Platform Pro',
      targetUrl: '/admin/settings',
      snippet: 'Your annual enterprise tier expires in 14 days. Auto-renew is enabled with default payment method on file.',
      category: 'billing',
      priority: 'medium',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      read: true,
      cta: {
        label: 'Manage Subscription',
        href: '/admin/settings',
        variant: 'primary',
      },
    },
  ];

  findAll(category?: string, unreadOnly?: boolean) {
    let result = [...this.notifications];
    if (category && category !== 'all') {
      result = result.filter((n) => n.category === category);
    }
    if (unreadOnly) {
      result = result.filter((n) => !n.read);
    }
    return {
      status: 'success',
      data: {
        items: result,
        total: result.length,
        unread: this.notifications.filter((n) => !n.read).length,
      },
    };
  }

  markAsRead(id: string) {
    const item = this.notifications.find((n) => n.id === id);
    if (item) {
      item.read = true;
    }
    return {
      status: 'success',
      data: item,
      unread: this.notifications.filter((n) => !n.read).length,
    };
  }

  markAsUnread(id: string) {
    const item = this.notifications.find((n) => n.id === id);
    if (item) {
      item.read = false;
    }
    return {
      status: 'success',
      data: item,
      unread: this.notifications.filter((n) => !n.read).length,
    };
  }

  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true));
    return {
      status: 'success',
      data: { updatedCount: this.notifications.length },
      unread: 0,
    };
  }

  remove(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    return {
      status: 'success',
      data: { deletedId: id },
      unread: this.notifications.filter((n) => !n.read).length,
    };
  }

  clearAll() {
    this.notifications = [];
    return {
      status: 'success',
      data: { cleared: true },
      unread: 0,
    };
  }

  simulateLive(data: Partial<NotificationItem>) {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: data.title || 'Live System Alert',
      action: data.action || 'dispatched an event',
      snippet: data.snippet || 'System notification triggered via live sync.',
      category: data.category || 'system',
      priority: data.priority || 'medium',
      createdAt: new Date().toISOString(),
      read: false,
      actor: data.actor,
      target: data.target,
      targetUrl: data.targetUrl,
      cta: data.cta,
      metadata: data.metadata,
      groupCount: data.groupCount,
      groupActors: data.groupActors,
    };
    this.notifications.unshift(newNotif);
    return {
      status: 'success',
      data: newNotif,
      unread: this.notifications.filter((n) => !n.read).length,
    };
  }
}
