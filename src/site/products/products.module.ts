import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../entities';
import { SiteProductsController } from './products.controller';
import { SiteProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [SiteProductsController],
  providers: [SiteProductsService],
})
export class SiteProductsModule {}
