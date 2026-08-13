import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const isVideo = file.mimetype.startsWith('video/');

      const readableStream = new Readable({
        read() {
          this.push(file.buffer);
          this.push(null);
        },
      });

      // Opciones mejoradas para Cloudinary
      const uploadOptions: Record<string, any> = {
        resource_type: isVideo ? 'video' : 'image',
      };

      // Si es video, forzamos formato MP4 web estandarizado para evitar pantallas blancas/cortes
      if (isVideo) {
        uploadOptions.format = 'mp4';
        uploadOptions.video_codec = 'auto'; // Transcodifica automáticamente a H.264 si viene en HEVC/MOV
      }

      const upload = cloudinary.uploader.upload_stream(
        uploadOptions,
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