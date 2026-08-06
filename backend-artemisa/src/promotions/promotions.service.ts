// src/promotions/promotions.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async create(createPromotionDto: CreatePromotionDto) {
    return this.prisma.promotion.create({
      data: {
        ...createPromotionDto,
        productId: createPromotionDto.productId ? +createPromotionDto.productId : null,
        categoryId: createPromotionDto.categoryId ? +createPromotionDto.categoryId : null,
      },
    });
  }

  async findAll() {
    return this.prisma.promotion.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async toggleActive(id: number, active: boolean) {
    return this.prisma.promotion.update({
      where: { id },
      data: { active },
    });
  }

  async remove(id: number) {
    return this.prisma.promotion.delete({
      where: { id },
    });
  }
}