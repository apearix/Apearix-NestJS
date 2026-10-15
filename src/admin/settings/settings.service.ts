import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {
  private settings: Record<string, any> = {
    site_name: 'Apearix',
    tagline: 'Next-Gen Digital & Cloud Solutions',
    contact_email: 'support@apearix.com',
    contact_phone: '+91 9876543210',
    logo_url: '/storage/logo.png',
    social_links: {
      twitter: 'https://x.com/apearix',
      linkedin: 'https://linkedin.com/company/apearix',
      github: 'https://github.com/apearix',
    },
    seo: {
      default_meta_title: 'Apearix - Modern Digital Platform',
      default_meta_description: 'Enterprise solutions, blogs, products, and digital services by Apearix.',
    },
    maintenance_mode: false,
  };

  getSettings() {
    return {
      success: true,
      data: this.settings,
    };
  }

  updateSettings(body: Record<string, any>) {
    this.settings = {
      ...this.settings,
      ...body,
    };
    return {
      success: true,
      message: 'Settings updated successfully',
      data: this.settings,
    };
  }
}
