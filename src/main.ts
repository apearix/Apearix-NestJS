import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SiteModule, SITE_MODULES } from './site/site.module';
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

  // Ensure storage directory exists at E:\DKProjects\Apearix-NestJS\src\storage
  const storagePath = join(process.cwd(), 'src', 'storage');
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
  }

  // Serve static storage files under /storage route
  app.use('/storage', express.static(storagePath));

  // Enable Global Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // CORS enable for external connections if needed
  app.enableCors();

  // 1. Unified Swagger Documentation (/api/docs)
  const unifiedConfig = new DocumentBuilder()
    .setTitle('Apearix API (Admin & Public Site)')
    .setDescription('Unified API documentation for the Apearix Admin Panel (/api/v1/admin/*) and Public Website (/api/v1/*).')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Site - Blogs', 'Public site blog endpoints')
    .addTag('Site - Categories', 'Public site categories endpoints')
    .addTag('Site - Category Types', 'Public site category types endpoints')
    .addTag('Site - FAQs', 'Public site FAQs endpoints')
    .addTag('Site - Pages', 'Public site static and legal pages endpoints')
    .addTag('Site - Products', 'Public site products endpoints')
    .addTag('Site - Services', 'Public site services endpoints')
    .addTag('Site - Settings', 'Public site settings endpoints')
    .build();

  const unifiedDocument = SwaggerModule.createDocument(app, unifiedConfig);
  SwaggerModule.setup('api/docs', app, unifiedDocument, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
    },
  });

  // 2. Dedicated Public Site Swagger Documentation (/api/docs/site)
  const siteConfig = new DocumentBuilder()
    .setTitle('Apearix Public Site API')
    .setDescription('Public APIs for website frontend without authentication.')
    .setVersion('1.0')
    .addTag('Site - Blogs', 'Public site blog endpoints')
    .addTag('Site - Categories', 'Public site categories endpoints')
    .addTag('Site - Category Types', 'Public site category types endpoints')
    .addTag('Site - FAQs', 'Public site FAQs endpoints')
    .addTag('Site - Pages', 'Public site static and legal pages endpoints')
    .addTag('Site - Products', 'Public site products endpoints')
    .addTag('Site - Services', 'Public site services endpoints')
    .addTag('Site - Settings', 'Public site settings endpoints')
    .build();

  const siteDocument = SwaggerModule.createDocument(app, siteConfig, {
    include: SITE_MODULES,
  });
  SwaggerModule.setup('api/docs/site', app, siteDocument, {
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
    },
  });

  // Auto-export swagger specifications to disk for Postman export/import
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
bootstrap();
