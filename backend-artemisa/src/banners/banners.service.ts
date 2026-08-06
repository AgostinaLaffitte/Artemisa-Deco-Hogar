// src/banners/banners.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBannerDto) {
    return this.prisma.banner.create({ 
      data: {
        title: dto.title,
        // Al usar '|| \'\'' evitamos que TypeScript chille por el "string | undefined"
        imageUrl: dto.imageUrl || '', 
        link: dto.link,
        // Parseamos el string del FormData a un número entero real para Postgres
        order: dto.order ? parseInt(dto.order, 10) : 0, 
      }
    });
  }

  async findAll() {
    return this.prisma.banner.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }, // Te los ordena de menor a mayor en el carrusel
    });
  }

  async remove(id: number) {
    return this.prisma.banner.delete({ where: { id } });
  }
}