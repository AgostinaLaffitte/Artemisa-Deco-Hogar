import { 
  Controller, Get, Post, Body, Patch, Param, Delete, Query, 
  UseInterceptors, UploadedFiles 
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor({ storage: memoryStorage() }))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    // 1. Procesar fotos/videos generales del producto
    const productFiles = files ? files.filter(f => f.fieldname === 'files') : [];
    if (productFiles.length > 0) {
      const uploadPromises = productFiles.map(file => this.cloudinaryService.uploadFile(file));
      const results = await Promise.all(uploadPromises);
      createProductDto.images = [
        ...(createProductDto.images || []),
        ...results.map(res => res.secure_url)
      ];
    }

    // 2. Procesar fotos/videos enviados individualmente para cada variante
    if (createProductDto.variants && Array.isArray(createProductDto.variants) && files) {
      for (let i = 0; i < createProductDto.variants.length; i++) {
        const variantFiles = files.filter(f => f.fieldname === `variant_${i}`);
        if (variantFiles.length > 0) {
          const uploads = await Promise.all(variantFiles.map(f => this.cloudinaryService.uploadFile(f)));
          const uploadedUrls = uploads.map(res => res.secure_url);
          
          createProductDto.variants[i].images = [
            ...(createProductDto.variants[i].images || []),
            ...uploadedUrls
          ];
        }
      }
    }

    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('category') categoryId?: string,
  ) {
    return this.productsService.findAll(search, categoryId ? +categoryId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor({ storage: memoryStorage() }))
  async update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    // 1. Procesar nuevas fotos/videos generales
    const productFiles = files ? files.filter(f => f.fieldname === 'files') : [];
    if (productFiles.length > 0) {
      const uploadPromises = productFiles.map(file => this.cloudinaryService.uploadFile(file));
      const results = await Promise.all(uploadPromises);
      
      const newUrls = results.map(res => res.secure_url);
      updateProductDto.images = updateProductDto.images 
        ? [...updateProductDto.images, ...newUrls] 
        : newUrls;
    }

    // 2. Procesar fotos/videos de variantes agregadas o editadas
    if (updateProductDto.variants && Array.isArray(updateProductDto.variants) && files) {
      for (let i = 0; i < updateProductDto.variants.length; i++) {
        const variantFiles = files.filter(f => f.fieldname === `variant_${i}`);
        if (variantFiles.length > 0) {
          const uploads = await Promise.all(variantFiles.map(f => this.cloudinaryService.uploadFile(f)));
          const uploadedUrls = uploads.map(res => res.secure_url);

          updateProductDto.variants[i].images = [
            ...(updateProductDto.variants[i].images || []),
            ...uploadedUrls
          ];
        }
      }
    }

    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}