import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../entities';
import { SiteCategoriesController } from './categories.controller';
import { SiteCategoriesService } from './categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [SiteCategoriesController],
  providers: [SiteCategoriesService],
})
export class SiteCategoriesModule {}
