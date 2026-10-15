import { Injectable } from '@nestjs/common';
import { SettingsService as AdminSettingsService } from '../../admin/settings/settings.service';

@Injectable()
export class SiteSettingsService {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  getPublicSettings() {
    const res = this.adminSettingsService.getSettings();
    const {
      site_name,
      tagline,
      contact_email,
      contact_phone,
      logo_url,
      social_links,
      seo,
      maintenance_mode,
    } = res.data || {};

    return {
      success: true,
      data: {
        site_name,
        tagline,
        contact_email,
        contact_phone,
        logo_url,
        social_links,
        seo,
        maintenance_mode,
      },
    };
  }
}
