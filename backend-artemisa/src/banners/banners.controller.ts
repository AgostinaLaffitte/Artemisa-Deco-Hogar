// src/banners/banners.controller.ts
import { 
  Controller, Post, Body, Get, Delete, Param, ParseIntPipe, 
  UseInterceptors, UploadedFiles 
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer'; 
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';

@Controller('banners')
export class BannersController {
  constructor(
    private readonly bannersService: BannersService,
    private readonly cloudinaryService: CloudinaryService
  ) {}
@Post()
  @UseInterceptors(FilesInterceptor('files', 1, {
    storage: memoryStorage(), 
  }))
  async create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      if (files && files.length > 0) {
        const result = await this.cloudinaryService.uploadImage(files[0]);
        createBannerDto.imageUrl = result.secure_url;
      }
      return await this.bannersService.create(createBannerDto);
    } catch (error) {
     
      throw new Error('No se pudo subir la imagen a Cloudinary');
    }
  
  }

  @Get()
  findAll() {
    return this.bannersService.findAll();
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bannersService.remove(id);
  }
}