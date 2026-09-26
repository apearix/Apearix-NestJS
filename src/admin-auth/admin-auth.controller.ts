import { ApiOperation } from '@nestjs/swagger';
import { Controller, Post, Body } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';

@Controller('api/v1/admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @ApiOperation({ operationId: 'login-admin' })
  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }

  @ApiOperation({ operationId: 'logout-admin' })
  @Post('logout')
  logout() {
    return { success: true, message: 'Logged out successfully' };
  }

  @ApiOperation({ operationId: 'forgot-password' })
  @Post('forgot-password')
  forgotPassword(@Body() body: any) {
    return this.authService.forgotPassword(body);
  }

  @ApiOperation({ operationId: 'change-password' })
  @Post('change-password')
  changePassword(@Body() body: any) {
    return this.authService.changePassword(body);
  }
}
