import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { extname, join } from 'path';
import * as fs from 'fs';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private isCloudinaryReady = false;

  constructor(private readonly config: ConfigService) {
    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.config.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET');
    const cloudinaryUrl = this.config.get<string>('CLOUDINARY_URL');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      this.isCloudinaryReady = true;
      this.logger.log(`Cloudinary initialized with cloud_name: ${cloudName}`);
    } else if (cloudinaryUrl) {
      process.env.CLOUDINARY_URL = cloudinaryUrl;
      cloudinary.config(true);
      this.isCloudinaryReady = true;
      this.logger.log('Cloudinary initialized via CLOUDINARY_URL');
    } else {
      this.logger.warn('Cloudinary credentials not provided or incomplete. Using local disk fallback.');
    }
  }

  async uploadFile(file: Express.Multer.File, folder = 'apearix'): Promise<{ url: string; filename: string }> {
    if (this.isCloudinaryReady && file.buffer) {
      try {
        const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `apearix/${folder}`,
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) return reject(error);
              if (!result) return reject(new Error('Cloudinary returned empty result'));
              resolve(result);
            },
          );
          uploadStream.end(file.buffer);
        });

        return {
          url: uploadResult.secure_url,
          filename: uploadResult.public_id,
        };
      } catch (err: any) {
        this.logger.error(`Cloudinary upload failed: ${err.message}. Falling back to disk storage...`);
      }
    }

    // Fallback: Local disk storage
    const storagePath = join(process.cwd(), 'src', 'storage');
    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname || '') || '.png';
    const filename = `${folder}-${uniqueSuffix}${ext}`;
    const filePath = join(storagePath, filename);

    if (file.buffer) {
      fs.writeFileSync(filePath, file.buffer);
    }

    return {
      url: `/apearix/storage/${filename}`,
      filename,
    };
  }
}
