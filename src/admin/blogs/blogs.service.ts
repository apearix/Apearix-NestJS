import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Blog, BlogStatus, User } from '../../entities';
import { CreateBlogDto } from './dto/create-blogs.dto';
import { UpdateBlogDto } from './dto/update-blogs.dto';

@Injectable()
export class BlogsService {
  constructor(@InjectRepository(Blog) private readonly repo: Repository<Blog>) {}

  private sanitizeAuthor(blog: Blog): any {
    if (blog && blog.author) {
      const { password, ...safeAuthor } = blog.author as any;
      return { ...blog, author: safeAuthor };
    }
    return blog;
  }

  private async resolveAuthorId(authorId?: string | null): Promise<string | null> {
    if (!authorId || typeof authorId !== 'string') {
      return null;
    }
    const trimmed = authorId.trim();
    if (!trimmed) {
      return null;
    }

    // If frontend sends '1' or '2' (hardcoded dummy IDs from UI select option)
    if (trimmed === '1' || trimmed === '2') {
      const [adminUser] = await this.repo.manager.getRepository(User).find({
        take: 1,
        order: { created_at: 'ASC' },
      });
      return adminUser ? adminUser.id : null;
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed);
    if (!isUuid) {
      const [adminUser] = await this.repo.manager.getRepository(User).find({
        take: 1,
        order: { created_at: 'ASC' },
      });
      return adminUser ? adminUser.id : null;
    }

    const userExists = await this.repo.manager.getRepository(User).findOne({
      where: { id: trimmed },
      select: { id: true },
    });
    return userExists ? userExists.id : null;
  }

  async create(dto: CreateBlogDto) {
    const status = (dto.status || dto.publishing?.status || BlogStatus.DRAFT) as BlogStatus;
    const rawAuthorId = dto.author_id !== undefined ? dto.author_id : dto.publishing?.author_id;
    const author_id = await this.resolveAuthorId(rawAuthorId);

    let published_at: Date | null = null;
    const rawPublishedAt = dto.published_at !== undefined ? dto.published_at : dto.publishing?.published_at;
    if (rawPublishedAt && typeof rawPublishedAt === 'string' && rawPublishedAt.trim() !== '') {
      const parsedDate = new Date(rawPublishedAt);
      published_at = isNaN(parsedDate.getTime()) ? null : parsedDate;
    } else if (rawPublishedAt instanceof Date && !isNaN(rawPublishedAt.getTime())) {
      published_at = rawPublishedAt;
    } else if (status === BlogStatus.PUBLISHED) {
      published_at = new Date();
    }

    const blogData = this.repo.create({
      title: dto.title,
      slug: dto.slug,
      is_manual_slug: dto.is_manual_slug ?? false,
      excerpt: dto.excerpt ?? '',
      content: dto.content,
      featured_image: dto.featured_image ?? '',
      status,
      author_id: author_id || undefined,
      published_at,
      meta_title: dto.meta_title ?? dto.seo?.meta_title ?? '',
      meta_description: dto.meta_description ?? dto.seo?.meta_description ?? '',
      canonical_url: dto.canonical_url ?? dto.seo?.canonical_url ?? '',
    });

    const saved = await this.repo.save(blogData);
    const reloaded = await this.repo.findOne({
      where: { id: saved.id },
      relations: { author: true },
    });
    return this.sanitizeAuthor(reloaded || saved);
  }

  async findAll() {
    const items = await this.repo.find({
      relations: { author: true },
      order: { created_at: 'DESC' },
    });
    return items.map((item) => {
      const safe = this.sanitizeAuthor(item);
      return {
        ...safe,
        publishing: {
          status: item.status,
          author_id: item.author_id || (item.author ? item.author.id : null),
          published_at: item.published_at,
        },
        seo: {
          meta_title: item.meta_title || '',
          meta_description: item.meta_description || '',
          canonical_url: item.canonical_url || '',
        },
      };
    });
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({
      where: { id },
      relations: { author: true },
    });
    if (!item) throw new NotFoundException('Blog not found');
    const safe = this.sanitizeAuthor(item);
    return {
      ...safe,
      publishing: {
        status: item.status,
        author_id: item.author_id || (item.author ? item.author.id : null),
        published_at: item.published_at,
      },
      seo: {
        meta_title: item.meta_title || '',
        meta_description: item.meta_description || '',
        canonical_url: item.canonical_url || '',
      },
    };
  }

  async update(id: string, dto: UpdateBlogDto) {
    const existing = await this.repo.findOne({ where: { id }, relations: { author: true } });
    if (!existing) throw new NotFoundException('Blog not found');

    const status = (dto.status || dto.publishing?.status || existing.status) as BlogStatus;

    const rawAuthorId = dto.author_id !== undefined ? dto.author_id : dto.publishing?.author_id;
    let author_id = existing.author_id;
    if (rawAuthorId !== undefined) {
      const resolved = await this.resolveAuthorId(rawAuthorId);
      author_id = resolved || existing.author_id;
    }

    let published_at = existing.published_at;
    const rawPublishedAt = dto.published_at !== undefined ? dto.published_at : dto.publishing?.published_at;
    if (rawPublishedAt !== undefined) {
      if (rawPublishedAt && typeof rawPublishedAt === 'string' && rawPublishedAt.trim() !== '') {
        const parsedDate = new Date(rawPublishedAt);
        published_at = isNaN(parsedDate.getTime()) ? null : parsedDate;
      } else if (rawPublishedAt instanceof Date && !isNaN(rawPublishedAt.getTime())) {
        published_at = rawPublishedAt;
      } else {
        published_at = null;
      }
    } else if (status === BlogStatus.PUBLISHED && !existing.published_at) {
      published_at = new Date();
    }

    existing.author = undefined as any;

    const updatedData = this.repo.merge(existing, {
      title: dto.title ?? existing.title,
      slug: dto.slug ?? existing.slug,
      is_manual_slug: dto.is_manual_slug ?? existing.is_manual_slug,
      excerpt: dto.excerpt ?? existing.excerpt,
      content: dto.content ?? existing.content,
      featured_image: dto.featured_image ?? existing.featured_image,
      status,
      author_id: author_id || null,
      published_at,
      meta_title: dto.meta_title ?? dto.seo?.meta_title ?? existing.meta_title,
      meta_description: dto.meta_description ?? dto.seo?.meta_description ?? existing.meta_description,
      canonical_url: dto.canonical_url ?? dto.seo?.canonical_url ?? existing.canonical_url,
    });

    const saved = await this.repo.save(updatedData);
    const reloaded = await this.repo.findOne({
      where: { id: saved.id },
      relations: { author: true },
    });
    return this.sanitizeAuthor(reloaded || saved);
  }

  async remove(id: string) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Blog not found');
    await this.repo.softRemove(item);
    return { success: true, message: 'Deleted successfully' };
  }

  async bulkStatus(ids: string[], status: string) {
    if (!ids || ids.length === 0) return { success: true, count: 0 };
    const validStatus = Object.values(BlogStatus).includes(status as BlogStatus)
      ? (status as BlogStatus)
      : BlogStatus.DRAFT;

    const items = await this.repo.findBy({ id: In(ids) });
    for (const item of items) {
      item.status = validStatus;
      if (validStatus === BlogStatus.PUBLISHED && !item.published_at) {
        item.published_at = new Date();
      }
      await this.repo.save(item);
    }
    return { success: true, count: items.length };
  }

  async bulkDelete(ids: string[]) {
    if (!ids || ids.length === 0) return { success: true, count: 0 };
    await this.repo.softDelete(ids);
    return { success: true, count: ids.length };
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

      const statusStr = item.status || item.publishing?.status || 'draft';
      const validStatus = Object.values(BlogStatus).includes(statusStr as BlogStatus)
        ? (statusStr as BlogStatus)
        : BlogStatus.DRAFT;

      const authorId = (item.author_id || item.publishing?.author_id || item.author || '').toString();

      const rawPubAt = item.published_at || item.publishing?.published_at;
      const publishedAt = rawPubAt
        ? new Date(rawPubAt)
        : validStatus === BlogStatus.PUBLISHED
        ? new Date()
        : null;

      const entity = this.repo.create({
        title,
        slug: uniqueSlug,
        is_manual_slug: item.is_manual_slug !== undefined ? Boolean(item.is_manual_slug) : false,
        excerpt: (item.excerpt || '').toString(),
        content: (item.content || item.description || title).toString(),
        featured_image: (item.featured_image || item.image || '').toString(),
        status: validStatus,
        author_id: authorId || undefined,
        published_at: publishedAt,
        meta_title: (item.meta_title || item.seo?.meta_title || title).toString().slice(0, 60),
        meta_description: (item.meta_description || item.seo?.meta_description || item.excerpt || '').toString().slice(0, 160),
        canonical_url: (item.canonical_url || item.seo?.canonical_url || '').toString().slice(0, 500),
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
