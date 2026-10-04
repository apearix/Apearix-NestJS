import { Body, Controller, Get, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller(['admin/profile', 'api/v1/admin/profile', 'profile'])
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'get-profile', operationId: 'get-profile' })
  @Get()
  getProfile(@Req() req: any, @Query('userId') userId?: string) {
    const id = userId || req.user?.id || req.user?.sub;
    return this.profileService.getProfile(id);
  }

  @ApiOperation({ summary: 'update-profile', operationId: 'update-profile' })
  @Patch()
  updateProfile(@Body() body: any, @Query('userId') userId?: string) {
    const id = userId || body?.userId || body?.id;
    return this.profileService.updateProfile(id, body);
  }

  @ApiOperation({ summary: 'change-password', operationId: 'change-password' })
  @Post('change-password')
  changePassword(@Body() body: any, @Query('userId') userId?: string) {
    const id = userId || body?.userId || body?.id;
    const currentPassword = body?.current_password || body?.currentPassword;
    const newPassword = body?.new_password || body?.newPassword;
    return this.profileService.changePassword(id, currentPassword, newPassword);
  }
}
