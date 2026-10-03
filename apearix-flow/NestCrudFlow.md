COMMAND:

nest g resource blogs --no-spec

• nest → NestJS CLI command
• g → generate ka short form
• resource → Resource structure generate karta hai
• blogs → Resource/module ka name
• --no-spec → Test files (.spec.ts) generate nahi karega

Result commonly includes:

• blogs.module.ts
• blogs.controller.ts
• blogs.service.ts
• dto/create-blog.dto.ts
• dto/update-blog.dto.ts
• blogs.entity.ts → ORM configuration/selection ke according

Short mein:

nest g resource blogs --no-spec

→ Blogs ka CRUD resource skeleton automatically create karo, bina test files ke.

➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤

Step 1. Module Create
• Create a NestJS module for the feature.
• Example: blogs.module.ts

Step 2. Entity Create
• Define database table structure and fields.
• Example: blogs.entity.ts

Step 3. DTO Create
• Create DTOs for request data validation.
• create-blogs.dto.ts → Create
• update-blogs.dto.ts → Update

Step 4. Service Create
• Write business logic and database operations.
• Example: blogs.service.ts

Step 5. Controller Create
• Define API endpoints and connect them with service methods.
• Example: blogs.controller.ts

Step 6. CRUD Flow
• POST → Create → Controller → DTO → Service → Entity → Database
• GET → Read → Controller → Service → Database
• PATCH → Update → Controller → DTO → Service → Entity → Database
• DELETE → Delete → Controller → Service → Database

Step 7. Module Connect
• Register Controller + Service + Entity/Repository inside blogs.module.ts.

Step 8. Final Flow
• API Request → Controller → DTO Validation → Service → Database → Response


## IMPLEMENTED CRUDs & APIs (Current Status)

### 1. Users CRUD (Complete)
- **Path**: /users 
- **Entity**: User (first_name, last_name, email, password (hashed), avatar, phone, role_id, status)
- **Endpoints**: 
  - POST /users (Create user + relation with Role)
  - GET /users (Get all users)
  - GET /users/:id (Get user by ID)
  - PATCH /users/:id (Update profile - Admin email change locked)
  - DELETE /users/:id (Soft delete user)
- **Swagger / Postman Configured**: Yes (Tags, Operation IDs, DTO Schema)

### 2. Roles CRUD (Complete)
- **Path**: /roles 
- **Entity**: Role (name, slug, description)
- **Endpoints**: 
  - POST /roles (Create role)
  - GET /roles (Get all roles)
  - GET /roles/:id (Get role by ID)
  - PATCH /roles/:id (Update role)
  - DELETE /roles/:id (Soft delete role)
- **Swagger / Postman Configured**: Yes

### 3. Admin Auth (MVP / Partial DB)
- **Path**: /api/v1/admin/auth 
- **Endpoints**: 
  - POST .../login (Returns generated JWT token + full authUser object with avatar, name, role)
  - POST .../logout (Logout success message)
  - POST .../forgot-password (Forgot password link logic)
  - POST .../change-password (Change password logic)
- **Swagger / Postman Configured**: Yes (LoginAdminDto, ForgotPasswordDto, etc.)
