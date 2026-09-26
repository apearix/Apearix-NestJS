import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable Global Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // CORS enable for external connections if needed
  app.enableCors();

  // Swagger OpenAPI Configuration
  const config = new DocumentBuilder()
    .setTitle('Apearix Admin API')
    .setDescription('The core API documentation for the Apearix Admin Panel.')
    .setVersion('1.0')
    .addBearerAuth() // for JWT authentication testing later
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Setup Swagger UI at http://localhost:3000/api/docs
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();