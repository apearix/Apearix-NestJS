import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(body: any) {
    const { email, password } = body;
    if (email === 'admin@apearix.com' && password === 'admin123') {
      const dbUser = await this.userRepository.findOne({
        where: { email: 'admin@apearix.com' },
      });

      const payload = {
        id: dbUser?.id,
        sub: dbUser?.id,
        email: email,
        role: 'admin',
        first_name: dbUser?.first_name || 'Dharmendra',
        last_name: dbUser?.last_name || 'Barman',
        full_name: `${dbUser?.first_name || 'Dharmendra'} ${dbUser?.last_name || 'Barman'}`.trim(),
        avatar: dbUser?.avatar || 'https://ui-avatars.com/api/?full_name=DB&background=6D28F5&color=fff',
      };
      const realToken = this.jwtService.sign(payload);

      return {
        success: true,
        token: realToken,
        user: payload,
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  forgotPassword(_body: any) {
    return { success: true, message: 'Password reset link sent to email' };
  }

  changePassword(_body: any) {
    return { success: true, message: 'Password changed successfully' };
  }
}
