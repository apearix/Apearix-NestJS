import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqsService } from './faqs.service';
import { FaqsController } from './faqs.controller';
import { Faq } from './entities/faqs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Faq])],
  controllers: [FaqsController],
  providers: [FaqsService],
})
export class FaqsModule {}
