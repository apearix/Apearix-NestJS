import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { Controller, Post, Body } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { LoginAdminDto, ForgotPasswordDto, ChangePasswordDto } from './dto/admin-auth.dto';

@ApiTags('Admin Auth')
@Controller('api/v1/admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @ApiOperation({ summary: 'admin-login', operationId: 'login-admin' })
  @ApiBody({ type: LoginAdminDto })
  @Post('login')
  login(@Body() body: LoginAdminDto) {
    return this.authService.login(body);
  }

  @ApiOperation({ summary: 'admin-logout', operationId: 'logout-admin' })
  @Post('logout')
  logout() {
    return { success: true, message: 'Logged out successfully' };
  }

  @ApiOperation({ summary: 'admin-forgot-password', operationId: 'forgot-password' })
  @ApiBody({ type: ForgotPasswordDto })
  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }

  @ApiOperation({ summary: 'admin-change-password', operationId: 'change-password' })
  @ApiBody({ type: ChangePasswordDto })
  @Post('change-password')
  changePassword(@Body() body: ChangePasswordDto) {
    return this.authService.changePassword(body);
  }
}
