import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminAuthService {
  constructor(private readonly jwtService: JwtService) { }

  login(body: any) {
    const { email, password } = body;
    if (email === 'admin@apearix.com' && password === 'admin123') {

      const payload = {
        email: email,
        role: 'admin',
        first_name: 'Dharmendra',
        last_name: 'Barman',
        full_name: 'Dharmendra Barman',
        avatar: 'https://ui-avatars.com/api/?full_name=DB&background=6D28F5&color=fff'
      };
      const realToken = this.jwtService.sign(payload);

      return {
        success: true,
        token: realToken,
        user: payload
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  forgotPassword(body: any) {
    return { success: true, message: 'Password reset link sent to email' };
  }

  changePassword(body: any) {
    return { success: true, message: 'Password changed successfully' };
  }
}
