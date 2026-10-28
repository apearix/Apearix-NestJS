import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog, BlogStatus } from '../../entities';

@Injectable()
export class SiteBlogsService {
  constructor(@InjectRepository(Blog) private readonly repo: Repository<Blog>) {}

  private isValidUuid(str: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  }

  private sanitizePublicBlog(blog: Blog) {
    const author = blog.author
      ? {
          id: blog.author.id,
          first_name: blog.author.first_name,
          last_name: blog.author.last_name || '',
          avatar: blog.author.avatar || '',
        }
      : null;

    return {
      ...blog,
      author,
    };
  }

  async findAllPublished(query: { search?: string; category?: string; page?: number; limit?: number }) {
    const qb = this.repo
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.author', 'author')
      .leftJoinAndSelect('blog.category', 'category')
      .where('blog.status = :status', { status: BlogStatus.PUBLISHED })
      .orderBy('COALESCE(blog.published_at, blog.created_at)', 'DESC');

    if (query.search && query.search.trim()) {
      const s = `%${query.search.trim()}%`;
      qb.andWhere('(blog.title ILIKE :s OR blog.excerpt ILIKE :s)', { s });
    }

    if (query.category && query.category.trim()) {
      const cat = query.category.trim();
      if (this.isValidUuid(cat)) {
        qb.andWhere('blog.category_id = :catId', { catId: cat });
      } else {
        qb.andWhere('(LOWER(category.slug) = LOWER(:cat) OR LOWER(category.name) = LOWER(:cat))', {
          cat,
        });
      }
    }

    if (query.page !== undefined && query.page > 0) {
      const page = Math.max(1, query.page);
      const limit = query.limit && query.limit > 0 ? Math.min(100, query.limit) : 10;
      qb.skip((page - 1) * limit).take(limit);

      const [items, total] = await qb.getManyAndCount();
      return {
        success: true,
        data: items.map((b) => this.sanitizePublicBlog(b)),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    if (query.limit && query.limit > 0) {
      qb.take(Math.min(100, query.limit));
    }

    const items = await qb.getMany();
    return items.map((b) => this.sanitizePublicBlog(b));
  }

  async findOnePublished(slugOrId: string) {
    const whereCondition = this.isValidUuid(slugOrId)
      ? [
          { id: slugOrId, status: BlogStatus.PUBLISHED },
          { slug: slugOrId, status: BlogStatus.PUBLISHED },
        ]
      : { slug: slugOrId, status: BlogStatus.PUBLISHED };

    const item = await this.repo.findOne({
      where: whereCondition,
      relations: { author: true, category: true },
    });

    if (!item) {
      throw new NotFoundException('Blog not found');
    }

    return this.sanitizePublicBlog(item);
  }
}
