import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

// Importing entities to count them for the dashboard
import { Blog } from '../blogs/entities/blogs.entity';
import { Category } from '../categories/entities/categories.entity';
import { Product } from '../products/entities/products.entity';
import { ServiceEntity } from '../services/entities/services.entity';
import { Faq } from '../faqs/entities/faqs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, Category, Product, ServiceEntity, Faq])
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule { }
