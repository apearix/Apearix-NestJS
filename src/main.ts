import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SITE_MODULES } from './site/site.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Increase payload size limits for bulk import (e.g. 1000+ blogs)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // 1. Admin/Complete API Documentation at /api/docs
  const config = new DocumentBuilder()
    .setTitle('Apearix Multi-Tenant Backend API')
    .setDescription('Full REST APIs for Admin, Content Management & Public Website')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Admin - Auth', 'Authentication and token verification')
    .addTag('Admin - Users', 'User management')
    .addTag('Admin - Roles', 'Role and permission management')
    .addTag('Admin - Blogs', 'Full blog authoring and publishing system')
    .addTag('Admin - Category Types', 'Category domain taxonomy management')
    .addTag('Admin - Categories', 'Hierarchical category engine')
    .addTag('Admin - Pages', 'Legal, Terms, and custom policy pages')
    .addTag('Admin - FAQs', 'Question & answer knowledgebase management')
    .addTag('Admin - Products', 'Product catalog management')
    .addTag('Admin - Services', 'Services management')
    .addTag('Admin - Profile', 'Admin account settings')
    .addTag('Admin - Settings', 'Platform general and mail settings')
    .addTag('Admin - Notifications', 'System activity and notification logs')
    .addTag('Admin - Dashboard', 'Platform overview metrics')
    .addTag('Site - Blogs', 'Public blog listings and articles')
    .addTag('Site - Category Types', 'Public taxonomy domains')
    .addTag('Site - Categories', 'Public hierarchical categories')
    .addTag('Site - FAQs', 'Public FAQ knowledge base')
    .addTag('Site - Pages', 'Public legal, terms, and custom pages')
    .addTag('Site - Products', 'Public product catalog')
    .addTag('Site - Services', 'Public services listings')
    .addTag('Site - Settings', 'Public contact and configuration')
    .build();

  const unifiedDocument = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, unifiedDocument);

  // 2. Public Frontend Client-Only Documentation at /api/docs/site
  const siteConfig = new DocumentBuilder()
    .setTitle('Apearix Public Site API')
    .setDescription('Lightweight REST endpoints consumed by the public web application')
    .setVersion('1.0')
    .addTag('Site - Blogs', 'Public blog listings and articles')
    .addTag('Site - Category Types', 'Public taxonomy domains')
    .addTag('Site - Categories', 'Public hierarchical categories')
    .addTag('Site - FAQs', 'Public FAQ knowledge base')
    .addTag('Site - Pages', 'Public legal, terms, and custom pages')
    .addTag('Site - Products', 'Public product catalog')
    .addTag('Site - Services', 'Public services listings')
    .addTag('Site - Settings', 'Public contact and configuration')
    .build();

  const siteDocument = SwaggerModule.createDocument(app, siteConfig, {
    include: SITE_MODULES,
  });
  SwaggerModule.setup('api/docs/site', app, siteDocument);

  // Write Swagger specs to file system on boot for schema sharing/CI
  try {
    fs.writeFileSync(join(process.cwd(), 'swagger.json'), JSON.stringify(unifiedDocument, null, 2));
    fs.writeFileSync(join(process.cwd(), 'swagger-site.json'), JSON.stringify(siteDocument, null, 2));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('Could not write swagger JSON files to disk:', msg);
  }

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Server is running on port ${port}`);
}
void bootstrap();
