import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Blog } from '../blogs/entities/blogs.entity';
import { Category } from '../categories/entities/categories.entity';
import { Product } from '../products/entities/products.entity';
import { ServiceEntity } from '../services/entities/services.entity';
import { Faq } from '../faqs/entities/faqs.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Blog) private blogRepo: Repository<Blog>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ServiceEntity) private serviceRepo: Repository<ServiceEntity>,
    @InjectRepository(Faq) private faqRepo: Repository<Faq>,
  ) {}

  async getDashboardOverview() {
    const [totalBlogs, totalCategories, totalProducts, totalServices, totalFaqs] = await Promise.all([
      this.blogRepo.count(),
      this.categoryRepo.count(),
      this.productRepo.count(),
      this.serviceRepo.count(),
      this.faqRepo.count(),
    ]);

    return {
      success: true,
      data: {
        totalBlogs,
        totalCategories,
        totalProducts,
        totalServices,
        totalFaqs,
      }
    };
  }
}
