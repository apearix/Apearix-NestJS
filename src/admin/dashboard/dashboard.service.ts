import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog, Category, Product, ServiceEntity, Faq } from '../../entities';

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
      },
    };
  }
}
