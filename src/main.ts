import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
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

  // Swagger OpenAPI Configuration
  const config = new DocumentBuilder()
    .setTitle('Apearix API (Admin & Public Site)')
    .setDescription('Unified API documentation for the Apearix Admin Panel (/api/v1/admin/*) and Public Website (/api/v1/*).')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();