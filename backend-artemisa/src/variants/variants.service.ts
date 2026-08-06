import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Injectable()
export class VariantsService {
  constructor(private prisma: PrismaService) {}

  create(createVariantDto: CreateVariantDto) {
    const { productId, ...variantData } = createVariantDto;

    return this.prisma.productVariant.create({
      data: {
        ...variantData,
        product: {
          connect: { id: productId }
        }
      },
    });
  }

  findAll() {
    return this.prisma.productVariant.findMany({
      include: {
        product: true
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.productVariant.findUnique({ where: { id } });
  }

  async update(id: number, updateVariantDto: UpdateVariantDto) {
    const { productId, ...variantData } = updateVariantDto;

    return this.prisma.productVariant.update({
      where: { id },
      data: {
        ...variantData,
        ...(productId && {
          product: { connect: { id: productId } }
        })
      }
    });
  }

  async remove(id: number) {
    return this.prisma.productVariant.delete({ where: { id } });
  }
}