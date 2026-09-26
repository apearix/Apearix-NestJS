import { Controller, Post, Body } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';

@Controller('api/v1/admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Post('logout')
  logout() {
    return { success: true, message: 'Logged out successfully' };
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: any) {
    return this.authService.forgotPassword(body);
  }

  @Post('change-password')
  changePassword(@Body() body: any) {
    return this.authService.changePassword(body);
  }
}
