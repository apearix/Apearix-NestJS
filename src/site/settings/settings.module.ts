import { Module } from '@nestjs/common';
import { SettingsModule as AdminSettingsModule } from '../../admin/settings/settings.module';
import { SiteSettingsController } from './settings.controller';
import { SiteSettingsService } from './settings.service';

@Module({
  imports: [AdminSettingsModule],
  controllers: [SiteSettingsController],
  providers: [SiteSettingsService],
})
export class SiteSettingsModule {}
