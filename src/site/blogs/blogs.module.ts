import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '../../entities';
import { SiteBlogsController } from './blogs.controller';
import { SiteBlogsService } from './blogs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  controllers: [SiteBlogsController],
  providers: [SiteBlogsService],
})
export class SiteBlogsModule {}
