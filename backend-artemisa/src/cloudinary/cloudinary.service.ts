import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';
import * as toStream from 'buffer-to-stream'; // Asegúrate de instalarlo
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {

async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      // Creamos un stream a partir del buffer manualmente
      const readableStream = new Readable({
        read() {
          this.push(file.buffer);
          this.push(null);
        }
      });

      const upload = cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Error al subir imagen"));
        resolve(result);
      });

      readableStream.pipe(upload);
    });
  }
}