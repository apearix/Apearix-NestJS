import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LegalPagesService } from './legal-pages.service';
import { LegalPagesController } from './legal-pages.controller';
import { LegalPage } from './entities/legal-pages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LegalPage])],
  controllers: [LegalPagesController],
  providers: [LegalPagesService],
})
export class LegalPagesModule {}
