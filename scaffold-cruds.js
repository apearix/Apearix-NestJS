const fs = require('fs');
const path = require('path');

const cruds = [
  { folder: 'categories', entityName: 'Category', fields: 'name:string,slug:string,description:string,isActive:boolean' },
  { folder: 'category-types', entityName: 'CategoryType', fields: 'name:string,description:string' },
  { folder: 'blogs', entityName: 'Blog', fields: 'title:string,slug:string,content:string,isPublished:boolean' },
  { folder: 'products', entityName: 'Product', fields: 'name:string,description:string,price:number,isActive:boolean' },
  { folder: 'services', entityName: 'ServiceEntity', fields: 'title:string,description:string,icon:string,isActive:boolean' }, // 'Service' is a reserved word sometimes, so ServiceEntity
  { folder: 'faqs', entityName: 'Faq', fields: 'question:string,answer:string,isActive:boolean' },
  { folder: 'legal-pages', entityName: 'LegalPage', fields: 'title:string,slug:string,content:string' }
];

const basePath = path.join(__dirname, 'src');

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function camelCase(s) {
  return s.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

cruds.forEach(crud => {
  const dir = path.join(basePath, crud.folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const entityFile = path.join(dir, `entities`, `${crud.folder}.entity.ts`);
  const dtoDir = path.join(dir, 'dto');
  const createDtoFile = path.join(dtoDir, `create-${crud.folder}.dto.ts`);
  const updateDtoFile = path.join(dtoDir, `update-${crud.folder}.dto.ts`);
  
  if (!fs.existsSync(path.join(dir, 'entities'))) fs.mkdirSync(path.join(dir, 'entities'));
  if (!fs.existsSync(dtoDir)) fs.mkdirSync(dtoDir);

  const fields = crud.fields.split(',').map(f => {
    const [name, type] = f.split(':');
    return { name, type };
  });

  // 1. Generate Entity
  let entityContent = `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';\n\n`;
  entityContent += `@Entity('${crud.folder.replace(/-/g, '_')}')\nexport class ${crud.entityName} {\n`;
  entityContent += `  @PrimaryGeneratedColumn()\n  id: number;\n\n`;
  fields.forEach(f => {
    if (f.type === 'boolean') {
      entityContent += `  @Column({ default: true })\n  ${f.name}: boolean;\n\n`;
    } else if (f.type === 'number') {
      entityContent += `  @Column('decimal', { precision: 10, scale: 2, default: 0 })\n  ${f.name}: number;\n\n`;
    } else if (f.name === 'content' || f.name === 'description') {
      entityContent += `  @Column('text', { nullable: true })\n  ${f.name}: string;\n\n`;
    } else {
      entityContent += `  @Column()\n  ${f.name}: string;\n\n`;
    }
  });
  entityContent += `  @CreateDateColumn()\n  createdAt: Date;\n\n  @UpdateDateColumn()\n  updatedAt: Date;\n}\n`;
  fs.writeFileSync(entityFile, entityContent);

  // 2. Generate DTOs
  let dtoImports = `import { IsString, IsBoolean, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';\n\n`;
  let createDtoContent = dtoImports + `export class Create${crud.entityName}Dto {\n`;
  fields.forEach(f => {
    if (f.type === 'boolean') {
      createDtoContent += `  @IsOptional()\n  @IsBoolean()\n  ${f.name}?: boolean;\n\n`;
    } else if (f.type === 'number') {
      createDtoContent += `  @IsNotEmpty()\n  @IsNumber()\n  ${f.name}: number;\n\n`;
    } else {
      createDtoContent += `  @IsNotEmpty()\n  @IsString()\n  ${f.name}: string;\n\n`;
    }
  });
  createDtoContent += `}\n`;
  fs.writeFileSync(createDtoFile, createDtoContent);

  let updateDtoContent = `import { PartialType } from '@nestjs/mapped-types';\nimport { Create${crud.entityName}Dto } from './create-${crud.folder}.dto';\n\n`;
  updateDtoContent += `export class Update${crud.entityName}Dto extends PartialType(Create${crud.entityName}Dto) {}\n`;
  fs.writeFileSync(updateDtoFile, updateDtoContent);

  // 3. Generate Service
  let serviceContent = `import { Injectable, NotFoundException } from '@nestjs/common';\n`;
  serviceContent += `import { InjectRepository } from '@nestjs/typeorm';\n`;
  serviceContent += `import { Repository } from 'typeorm';\n`;
  serviceContent += `import { ${crud.entityName} } from './entities/${crud.folder}.entity';\n`;
  serviceContent += `import { Create${crud.entityName}Dto } from './dto/create-${crud.folder}.dto';\n`;
  serviceContent += `import { Update${crud.entityName}Dto } from './dto/update-${crud.folder}.dto';\n\n`;
  serviceContent += `@Injectable()\nexport class ${capitalize(camelCase(crud.folder))}Service {\n`;
  serviceContent += `  constructor(@InjectRepository(${crud.entityName}) private readonly repo: Repository<${crud.entityName}>) {}\n\n`;
  serviceContent += `  async create(dto: Create${crud.entityName}Dto) { return await this.repo.save(this.repo.create(dto)); }\n`;
  serviceContent += `  async findAll() { return await this.repo.find({ order: { createdAt: 'DESC' } }); }\n`;
  serviceContent += `  async findOne(id: number) {\n    const item = await this.repo.findOne({ where: { id } });\n`;
  serviceContent += `    if (!item) throw new NotFoundException('Item not found');\n    return item;\n  }\n`;
  serviceContent += `  async update(id: number, dto: Update${crud.entityName}Dto) {\n    await this.findOne(id);\n    await this.repo.update(id, dto);\n    return this.findOne(id);\n  }\n`;
  serviceContent += `  async remove(id: number) {\n    const item = await this.findOne(id);\n    await this.repo.remove(item);\n    return { success: true, message: 'Deleted successfully' };\n  }\n}\n`;
  
  fs.writeFileSync(path.join(dir, `${crud.folder}.service.ts`), serviceContent);

  // 4. Generate Controller
  let controllerContent = `import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';\n`;
  controllerContent += `import { ${capitalize(camelCase(crud.folder))}Service } from './${crud.folder}.service';\n`;
  controllerContent += `import { Create${crud.entityName}Dto } from './dto/create-${crud.folder}.dto';\n`;
  controllerContent += `import { Update${crud.entityName}Dto } from './dto/update-${crud.folder}.dto';\n`;
  controllerContent += `// import { JwtAuthGuard } from '../admin-auth/jwt-auth.guard';\n\n`; // Commented guard until auth is ready
  controllerContent += `// @UseGuards(JwtAuthGuard)\n`;
  controllerContent += `@Controller('api/v1/admin/${crud.folder}')\n`;
  controllerContent += `export class ${capitalize(camelCase(crud.folder))}Controller {\n`;
  controllerContent += `  constructor(private readonly service: ${capitalize(camelCase(crud.folder))}Service) {}\n\n`;
  controllerContent += `  @Post()\n  create(@Body() dto: Create${crud.entityName}Dto) { return this.service.create(dto); }\n\n`;
  controllerContent += `  @Get()\n  findAll() { return this.service.findAll(); }\n\n`;
  controllerContent += `  @Get(':id')\n  findOne(@Param('id') id: string) { return this.service.findOne(+id); }\n\n`;
  controllerContent += `  @Patch(':id')\n  update(@Param('id') id: string, @Body() dto: Update${crud.entityName}Dto) { return this.service.update(+id, dto); }\n\n`;
  controllerContent += `  @Delete(':id')\n  remove(@Param('id') id: string) { return this.service.remove(+id); }\n}\n`;

  fs.writeFileSync(path.join(dir, `${crud.folder}.controller.ts`), controllerContent);

  // 5. Generate Module
  let moduleContent = `import { Module } from '@nestjs/common';\n`;
  moduleContent += `import { TypeOrmModule } from '@nestjs/typeorm';\n`;
  moduleContent += `import { ${capitalize(camelCase(crud.folder))}Service } from './${crud.folder}.service';\n`;
  moduleContent += `import { ${capitalize(camelCase(crud.folder))}Controller } from './${crud.folder}.controller';\n`;
  moduleContent += `import { ${crud.entityName} } from './entities/${crud.folder}.entity';\n\n`;
  moduleContent += `@Module({\n  imports: [TypeOrmModule.forFeature([${crud.entityName}])],\n`;
  moduleContent += `  controllers: [${capitalize(camelCase(crud.folder))}Controller],\n`;
  moduleContent += `  providers: [${capitalize(camelCase(crud.folder))}Service],\n})\n`;
  moduleContent += `export class ${capitalize(camelCase(crud.folder))}Module {}\n`;

  fs.writeFileSync(path.join(dir, `${crud.folder}.module.ts`), moduleContent);

});

console.log('CRUD modules generated successfully!');
