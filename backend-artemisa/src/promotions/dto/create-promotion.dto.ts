// src/promotions/dto/create-promotion.dto.ts
import { IsString, IsOptional, IsNumber, IsBoolean, IsInt } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString() // "PORCENTAJE", "CANTIDAD", "TOTAL_CARRITO"
  type!: string;

  @IsInt()
  @IsOptional()
  minQuantity: number = 1; // Le damos un valor por defecto seguro

  @IsNumber()
  discountValue!: number;

  @IsBoolean()
  @IsOptional()
  active: boolean = true; // Por defecto arranca activa

  @IsInt()
  @IsOptional()
  productId?: number;

  @IsInt()
  @IsOptional()
  categoryId?: number;
}