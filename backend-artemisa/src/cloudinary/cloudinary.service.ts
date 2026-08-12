import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const readableStream = new Readable({
        read() {
          this.push(file.buffer);
          this.push(null);
        },
      });

      // Se especifica resource_type: 'auto' para aceptar tanto fotos como videos
      const upload = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Error al subir el archivo a Cloudinary'));
          resolve(result);
        },
      );

      readableStream.pipe(upload);
    });
  }
}