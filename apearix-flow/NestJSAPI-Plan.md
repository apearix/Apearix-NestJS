Apearix NestJS API Project Plan 

◉ Project Overview
• Tech Stack → NestJS, TypeORM, PostgreSQL
• Architecture → RESTful APIs (Clean, Independent, No Z-Starter Copied Code)
• Goal → Complete Admin Panel APIs for Apearix Website (No User Panel currently)

★ Step 1. Initial Setup and Database Configuration
◦ Initialize new NestJS project
◦ Setup TypeORM with PostgreSQL connection
◦ Create base structure (Controllers, Services, DTOs, Entities)
◦ Configure environment variables for security

★ Step 2. Admin Authentication Module
◦ Create Admin Entity
◦ Implement JWT-based Auth (Login, Tokens)
◦ Endpoints:
  → POST /api/v1/admin/auth/login
  → POST /api/v1/admin/auth/logout
  → POST /api/v1/admin/auth/forgot-password
  → POST /api/v1/admin/auth/change-password

★ Step 3. Core CMS Modules
◦ Categories & Category Types
  → GET, POST, PUT, DELETE /api/v1/admin/categories
  → GET, POST, PUT, DELETE /api/v1/admin/category-types
◦ Blogs Management
  ✓ Create, edit, delete, and view blogs
  → GET, POST, PUT, DELETE /api/v1/admin/blogs

★ Step 4. Business Modules
◦ Products Management
  ✓ Add products, manage product details
  → GET, POST, PUT, DELETE /api/v1/admin/products
◦ Services Management
  ✓ Add and manage website services
  → GET, POST, PUT, DELETE /api/v1/admin/services

★ Step 5. Website Dynamic Pages & Settings
◦ Contact Page Management
  → GET, PUT /api/v1/admin/settings/contact
◦ About Page Management
  → GET, PUT /api/v1/admin/settings/about
◦ Social Links Management
  → GET, PUT /api/v1/admin/settings/social-links
◦ FAQs Management
  → GET, POST, PUT, DELETE /api/v1/admin/faqs
◦ Legal Pages Management
  ✓ Privacy Policy, Terms & Conditions
  → GET, POST, PUT, DELETE /api/v1/admin/legal-pages

★ Step 6. Admin Dashboard Module
◦ Overall Management Data
  ✓ Data counts, recent activities, overall website status
  → GET /api/v1/admin/dashboard/stats

◉ Design & Security Guidelines ⚠ 
▪ APIs will follow strict RESTful standards and be easy to consume by Apearix NextJS
▪ All Admin routes protected by JWT Authorization Guards
▪ User panel scope is reserved for future expansion (6-7 months later)
