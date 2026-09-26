const fs = require('fs');
const path = require('path');

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(name => {
        const filePath = path.join(currentDirPath, name);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

function camelToDash(str) {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
}

walkSync(path.join(__dirname, 'src'), (filePath) => {
    if (filePath.endsWith('.controller.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add ApiOperation import if not exists
        if (!content.includes('ApiOperation')) {
            if (content.includes('@nestjs/swagger')) {
                content = content.replace(/import {([^}]+)} from '@nestjs\/swagger';/, (match, p1) => {
                    return `import {${p1}, ApiOperation } from '@nestjs/swagger';`;
                });
            } else {
                content = `import { ApiOperation } from '@nestjs/swagger';\n` + content;
            }
        }

        // Extract Controller Resource Name from Class Name
        const classMatch = content.match(/export class ([a-zA-Z]+)Controller/);
        if (!classMatch) return;
        const resourceName = camelToDash(classMatch[1]); // Products -> products, AdminAuth -> admin-auth

        // Regex to match decorators and method signatures
        // Looking for @Post(), @Get(...), @Patch(...), @Delete(...) followed by method name
        const methodRegex = /@(Post|Get|Patch|Delete)\([^)]*\)\n\s*(?:@UseGuards[^]*?\n\s*)?(?:@Header[^]*?\n\s*)?(?:async\s+)?([a-zA-Z0-9_]+)\(/g;
        
        let match;
        const replacements = [];
        while ((match = methodRegex.exec(content)) !== null) {
            const fullDecoratorBlock = match[0];
            const httpMethod = match[1]; // Post, Get, Patch, Delete
            const methodName = match[2]; // create, findAll, etc.
            
            // Skip if ApiOperation is already directly above this method (rough check)
            const beforeMatch = content.slice(Math.max(0, match.index - 50), match.index);
            if (beforeMatch.includes('ApiOperation')) continue;

            let action = '';
            if (methodName === 'create') action = `create-${resourceName}`;
            else if (methodName === 'findAll') action = `get-all-${resourceName}`;
            else if (methodName === 'findOne') action = `get-${resourceName}-by-id`;
            else if (methodName === 'update') action = `update-${resourceName}`;
            else if (methodName === 'remove') action = `delete-${resourceName}`;
            else if (methodName === 'login') action = `login-admin`;
            else if (methodName === 'logout') action = `logout-admin`;
            else if (methodName === 'forgotPassword') action = `forgot-password`;
            else if (methodName === 'changePassword') action = `change-password`;
            else if (methodName === 'getStats') action = `get-dashboard-stats`;
            else action = `${camelToDash(methodName)}-${resourceName}`;

            const newDecoratorBlock = `@ApiOperation({ operationId: '${action}' })\n  ` + fullDecoratorBlock;
            replacements.push({ old: fullDecoratorBlock, new: newDecoratorBlock });
        }

        // Apply replacements from bottom to top to avoid messing up indices if we were using indices (but here using string replace)
        for (const rep of replacements) {
            content = content.replace(rep.old, rep.new);
        }

        fs.writeFileSync(filePath, content, 'utf8');
    }
});

console.log('Swagger Operation IDs injected successfully!');
