import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
    data: {
      name: createCategoryDto.name,
      image: createCategoryDto.image, // <--- Es vital que esto sea explícito
    },
  });
  }

  async findAll() {
    return this.prisma.category.findMany();
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
  return this.prisma.category.update({
    where: { id },
    data: updateCategoryDto, // Si pasás el objeto entero, Prisma actualiza lo que venga
  });
}

  async remove(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
    }
}