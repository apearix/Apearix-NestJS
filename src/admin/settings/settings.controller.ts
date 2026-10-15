import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Patch } from '@nestjs/common';
import { SettingsService } from './settings.service';

@ApiTags('Admin - Settings')
@Controller('api/v1/admin/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: 'get-admin-settings', operationId: 'get-admin-settings' })
  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }

  @ApiOperation({ summary: 'update-admin-settings', operationId: 'update-admin-settings' })
  @Patch()
  updateSettings(@Body() body: Record<string, any>) {
    return this.settingsService.updateSettings(body);
  }
}
