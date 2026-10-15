import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Blog, Category, Product, ServiceEntity, Faq } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Category, Product, ServiceEntity, Faq])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
