import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SiteSettingsService } from './settings.service';

@ApiTags('Site - Settings')
@Controller('api/v1/settings')
export class SiteSettingsController {
  constructor(private readonly service: SiteSettingsService) {}

  @ApiOperation({
    summary: 'Get public website settings (site name, logo, social links, SEO)',
    operationId: 'site-get-public-settings',
  })
  @Get()
  getPublicSettings() {
    return this.service.getPublicSettings();
  }
}
