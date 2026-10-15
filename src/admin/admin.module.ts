import { Module } from '@nestjs/common';
import { AdminAuthModule } from './auth/admin-auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { BlogsModule } from './blogs/blogs.module';
import { CategoriesModule } from './categories/categories.module';
import { CategoryTypesModule } from './category-types/category-types.module';
import { FaqsModule } from './faqs/faqs.module';
import { LegalPagesModule } from './pages/pages.module';
import { ProductsModule } from './products/products.module';
import { ServicesModule } from './services/services.module';
import { SettingsModule } from './settings/settings.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    AdminAuthModule,
    DashboardModule,
    RolesModule,
    UsersModule,
    ProfileModule,
    BlogsModule,
    CategoriesModule,
    CategoryTypesModule,
    FaqsModule,
    LegalPagesModule,
    ProductsModule,
    ServicesModule,
    SettingsModule,
    NotificationsModule,
  ],
  exports: [SettingsModule, NotificationsModule],
})
export class AdminModule {}
