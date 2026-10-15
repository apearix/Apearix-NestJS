import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryTypesService } from './category-types.service';
import { CategoryTypesController } from './category-types.controller';
import { CategoryType } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryType])],
  controllers: [CategoryTypesController],
  providers: [CategoryTypesService],
})
export class CategoryTypesModule {}
