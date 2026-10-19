import { Module } from '@nestjs/common';
import { SiteBlogsModule } from './blogs/blogs.module';
import { SitePagesModule } from './pages/pages.module';
import { SiteFaqsModule } from './faqs/faqs.module';
import { SiteCategoriesModule } from './categories/categories.module';
import { SiteCategoryTypesModule } from './category-types/category-types.module';
import { SiteProductsModule } from './products/products.module';
import { SiteServicesModule } from './services/services.module';
import { SiteSettingsModule } from './settings/settings.module';

export const SITE_MODULES = [
  SiteBlogsModule,
  SitePagesModule,
  SiteFaqsModule,
  SiteCategoriesModule,
  SiteCategoryTypesModule,
  SiteProductsModule,
  SiteServicesModule,
  SiteSettingsModule,
];

@Module({
  imports: SITE_MODULES,
  exports: SITE_MODULES,
})
export class SiteModule {}

