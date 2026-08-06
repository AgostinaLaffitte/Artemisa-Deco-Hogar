import { 
  Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer'; 
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; 

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly cloudinaryService: CloudinaryService 
  ) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() })) 
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      // 5. Subimos a Cloudinary y guardamos la URL directa
      const result = await this.cloudinaryService.uploadImage(file);
      createCategoryDto.image = result.secure_url;
    }

    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() })) 
  async update(
    @Param('id') id: string, 
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      // 5. Subimos a Cloudinary y guardamos la URL directa
      const result = await this.cloudinaryService.uploadImage(file);
      updateCategoryDto.image = result.secure_url;
    }

    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }


}