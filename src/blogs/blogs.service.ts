import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Blog } from './entities/blogs.entity';
import { CreateBlogDto } from './dto/create-blogs.dto';
import { UpdateBlogDto } from './dto/update-blogs.dto';

@Injectable()
export class BlogsService {
  constructor(@InjectRepository(Blog) private readonly repo: Repository<Blog>) {}

  async create(dto: CreateBlogDto) {
    const blogData = this.repo.create({
      ...dto,
      is_manual_slug: dto.is_manual_slug ?? false,
      excerpt: dto.excerpt ?? '',
      featured_image: dto.featured_image ?? '',
      publishing: {
        status: dto.publishing?.status || 'draft',
        author_id: dto.publishing?.author_id || '1',
        published_at: dto.publishing?.published_at || null,
      },
      seo: {
        meta_title: dto.seo?.meta_title || '',
        meta_description: dto.seo?.meta_description || '',
        canonical_url: dto.seo?.canonical_url || '',
      },
    });
    return await this.repo.save(blogData);
  }

  async findAll() {
    return await this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Blog not found');
    return item;
  }

  async update(id: number, dto: UpdateBlogDto) {
    const existing = await this.findOne(id);

    const newPublishing = dto.publishing
      ? {
          status: dto.publishing.status ?? existing.publishing?.status ?? 'draft',
          author_id: dto.publishing.author_id ?? existing.publishing?.author_id ?? '1',
          published_at:
            dto.publishing.status === 'published'
              ? (dto.publishing.published_at || existing.publishing?.published_at || new Date().toISOString())
              : (dto.publishing.published_at !== undefined ? dto.publishing.published_at : existing.publishing?.published_at || null),
        }
      : existing.publishing;

    const newSeo = dto.seo
      ? {
          meta_title: dto.seo.meta_title ?? existing.seo?.meta_title ?? '',
          meta_description: dto.seo.meta_description ?? existing.seo?.meta_description ?? '',
          canonical_url: dto.seo.canonical_url ?? existing.seo?.canonical_url ?? '',
        }
      : existing.seo;

    const updatedData = this.repo.merge(existing, {
      ...dto,
      publishing: newPublishing,
      seo: newSeo,
    });

    return await this.repo.save(updatedData);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repo.remove(item);
    return { success: true, message: 'Deleted successfully' };
  }

  async bulkStatus(ids: (number | string)[], status: string) {
    const numericIds = ids.map((id) => Number(id)).filter((id) => !isNaN(id));
    if (numericIds.length === 0) return { success: true, count: 0 };
    const items = await this.repo.findBy({ id: In(numericIds) });
    for (const item of items) {
      item.publishing = {
        author_id: item.publishing?.author_id || '1',
        status,
        published_at:
          status === 'published'
            ? (item.publishing?.published_at || new Date().toISOString())
            : (item.publishing?.published_at || null),
      };
      await this.repo.save(item);
    }
    return { success: true, count: items.length };
  }

  async bulkDelete(ids: (number | string)[]) {
    const numericIds = ids.map((id) => Number(id)).filter((id) => !isNaN(id));
    if (numericIds.length === 0) return { success: true, count: 0 };
    await this.repo.delete(numericIds);
    return { success: true, count: numericIds.length };
  }

  async bulkImport(rawItems: any[]) {
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return { success: true, count: 0, items: [] };
    }

    const existingBlogs = await this.repo.find({ select: { slug: true } });
    const existingSlugs = new Set(existingBlogs.map((b) => b.slug));

    const entities: Blog[] = [];

    for (let index = 0; index < rawItems.length; index++) {
      const item = rawItems[index] || {};
      const title = (item.title || item.name || `Imported Article ${index + 1}`).toString().trim();

      let baseSlug = (item.slug || '').toString().toLowerCase().trim();
      if (!baseSlug) {
        baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      } else {
        baseSlug = baseSlug.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      if (!baseSlug) {
        baseSlug = `article-${Date.now()}-${index + 1}`;
      }

      let uniqueSlug = baseSlug;
      let counter = 1;
      while (existingSlugs.has(uniqueSlug)) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      existingSlugs.add(uniqueSlug);

      const status = item.publishing?.status || item.status || 'draft';
      const validStatus = ['draft', 'published', 'archived'].includes(status) ? status : 'draft';

      const authorId = (item.publishing?.author_id || item.author_id || item.author || '1').toString();

      const publishedAt =
        item.publishing?.published_at ||
        item.published_at ||
        (validStatus === 'published' ? new Date().toISOString() : null);

      const entity = this.repo.create({
        title,
        slug: uniqueSlug,
        is_manual_slug: item.is_manual_slug !== undefined ? Boolean(item.is_manual_slug) : false,
        excerpt: (item.excerpt || '').toString(),
        content: (item.content || item.description || title).toString(),
        featured_image: (item.featured_image || item.image || '').toString(),
        publishing: {
          status: validStatus,
          author_id: authorId,
          published_at: publishedAt,
        },
        seo: {
          meta_title: (item.seo?.meta_title || item.meta_title || title).toString().slice(0, 60),
          meta_description: (item.seo?.meta_description || item.meta_description || item.excerpt || '').toString().slice(0, 160),
          canonical_url: (item.seo?.canonical_url || item.canonical_url || '').toString().slice(0, 500),
        },
      });

      entities.push(entity);
    }

    const chunkSize = 100;
    const savedItems: Blog[] = [];
    for (let i = 0; i < entities.length; i += chunkSize) {
      const chunk = entities.slice(i, i + chunkSize);
      const savedChunk = await this.repo.save(chunk);
      savedItems.push(...savedChunk);
    }

    return { success: true, count: savedItems.length, items: savedItems };
  }
}
