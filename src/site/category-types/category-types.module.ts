import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryType } from '../../entities';
import { SiteCategoryTypesController } from './category-types.controller';
import { SiteCategoryTypesService } from './category-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryType])],
  controllers: [SiteCategoryTypesController],
  providers: [SiteCategoryTypesService],
})
export class SiteCategoryTypesModule {}
