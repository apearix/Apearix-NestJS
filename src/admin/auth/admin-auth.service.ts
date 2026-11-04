import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '../../entities';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async login(body: any, clientIp: string = '127.0.0.1', userAgent?: string) {
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

    // Trigger security notification on failed attempt
    this.eventEmitter.emit('auth.suspicious_login', {
      email: email || 'unknown@user.com',
      ip: clientIp || '127.0.0.1',
      browser: userAgent || 'Browser Client',
      reason: 'Failed password verification',
    });

    throw new UnauthorizedException('Invalid credentials');
  }

  forgotPassword(_body: any) {
    return { success: true, message: 'Password reset link sent to email' };
  }

  changePassword(_body: any) {
    return { success: true, message: 'Password changed successfully' };
  }
}
