import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(body: any) {
    const { email, password } = body;
    
    // MVP check (Normally you'd check this against a database Admin table)
    if (email === 'admin@apearix.com' && password === 'admin123') {
      
      // Generating a REAL JWT Token
      const payload = { 
        email: email, 
        role: 'admin', 
        first_name: 'Dharmendra', 
        last_name: 'Barman',
        name: 'Dharmendra Barman',
        full_name: 'Dharmendra Barman',
        avatar: 'https://ui-avatars.com/api/?name=Dharmendra+Barman&background=0D8ABC&color=fff'
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

  async forgotPassword(body: any) {
    return { success: true, message: 'Password reset link sent to email' };
  }

  async changePassword(body: any) {
    return { success: true, message: 'Password changed successfully' };
  }
}
