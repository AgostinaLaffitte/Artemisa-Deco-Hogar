// src/products/dto/create-product.dto.ts
import { IsArray, IsString, IsNumber, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {

  @IsString()
  @IsNotEmpty()
  name!: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  price!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isOffer?: boolean;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'NaN' || value === '' || value === null || value === undefined) return null;
    return Number(value);
  })
  @IsNumber()
  offerPrice?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];
    const array = Array.isArray(value) ? value : [value];
    return array.map(v => Number(v));
  })
  @IsArray()
  @IsNumber({}, { each: true })
  categories?: number[];

  @IsOptional()
  @Transform(({ value }) => {
    // Si viene del FormData como strings de objetos o estructura indexada, lo normalizamos a Array
    if (!value) return [];
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch { return []; }
    }
    return value;
  })
  @IsArray()
  variants?: any[];
}