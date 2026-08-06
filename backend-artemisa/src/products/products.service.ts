// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { categories = [], variants = [], images = [], ...productData } = createProductDto;
    const actualOfferPrice = productData.isOffer ? productData.offerPrice : null;

    return await this.prisma.product.create({
      data: {
        ...productData,
        offerPrice: actualOfferPrice,
        images: images,
        categories: {
          connect: categories.map(catId => ({ id: catId })),
        },
        variants: {
          create: variants.map(variant => ({
            name: variant.name,
            stock: Number(variant.stock),
            price: variant.price ? Number(variant.price) : null,
          })),
        },
      },
      include: {
        categories: true,
        variants: true,
      },
    });
  }

  async findAll(search?: string, categoryId?: number) {
    return this.prisma.product.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
        categories: categoryId ? {
          some: { id: categoryId }
        } : undefined,
      },
      include: {
        categories: true,
        variants: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        categories: true,
        variants: true,
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // Desestructuramos usando de base los campos estrictos del DTO
    const { categories, variants, images, ...productData } = updateProductDto;
    const actualOfferPrice = productData.isOffer ? updateProductDto.offerPrice : null;

    return await this.prisma.product.update({
      where: { id: Number(id) },
      data: {
        ...productData,
        offerPrice: actualOfferPrice,
        // Si vienen imágenes procesadas por Multer en el controlador, actualizamos el campo en la BD
        ...(images ? { images: { set: images } } : {}),
        ...(categories ? {
          categories: {
            set: categories.map((catId: number) => ({ id: Number(catId) })),
          },
        } : {}),
        ...(variants ? {
          variants: {
            deleteMany: {},
            create: variants.map((variant: any) => ({
              name: variant.name,
              stock: Number(variant.stock),
              price: variant.price ? Number(variant.price) : null,
            })),
          },
        } : {}),
      },
      include: {
        categories: true,
        variants: true,
      },
    });
  }

  async remove(id: number) {
    // Primero eliminamos en cascada las variantes asociadas para evitar violaciones de clave foránea en Postgres
    await this.prisma.productVariant.deleteMany({
      where: { productId: id },
    });

    return await this.prisma.product.delete({
      where: { id },
    });
  }
}