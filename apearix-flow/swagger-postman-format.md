# Swagger & Postman Naming Convention

Apearix NestJS project uses a strict, consistent naming convention for all APIs visible in Swagger and Postman.

## 1. Naming Format (Kebab-Case)
Sabhi API endpoints ka jo naam Postman / Swagger me dikhega, wo **kebab-case** (small letters separated by hyphens) me hona chahiye. 

**Examples:**
- `admin-login`
- `create-user`
- `get-all-users`
- `get-user-by-id`
- `update-user`
- `delete-user`

## 2. Controller Setup (Code Structure)
Consistency maintain karne ke liye hum decorators ka use karte hain:

### `@ApiTags('FolderName')`
Ye Postman/Swagger me ek folder (group) create karta hai. Isey class level par lagaya jata hai.
```typescript
@ApiTags('Admin Auth') // Postman me 'Admin Auth' naam ka folder banega
@Controller('api/v1/admin/auth')
export class AdminAuthController { ... }
```

### `@ApiOperation({ summary: 'kebab-case-name' })`
Ye Postman me request ka display name set karta hai. **`summary` property mein hamesha kebab-case hi use karna hai.**
```typescript
@ApiOperation({ summary: 'admin-login', operationId: 'login-admin' })
@Post('login')
login(@Body() body: LoginAdminDto) { ... }
```

### `@ApiBody({ type: DtoClass })` 
Request payload ko Swagger me show karne ke liye DTO ko attach karte hain taaki Postman import ke time properly JSON body auto-generate kar sake.

---
**Rule of Thumb:** 
Request ka naam kabhi bhi *Title Case* ya spaces ke sath (e.g., "Get all users" / "Create a new role") nahi hona chahiye. Hamesha `get-all-users` ya `create-role` jaisa format follow karna hai.
