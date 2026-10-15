import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from '../../entities';
import { SiteFaqsController } from './faqs.controller';
import { SiteFaqsService } from './faqs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Faq])],
  controllers: [SiteFaqsController],
  providers: [SiteFaqsService],
})
export class SiteFaqsModule {}
