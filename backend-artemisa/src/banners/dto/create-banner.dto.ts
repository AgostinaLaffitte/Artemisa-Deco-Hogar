// src/banners/dto/create-banner.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional() // Lo dejamos como string opcional porque lo inyecta el controlador tras el upload
  imageUrl?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsOptional() // Quitamos validaciones numéricas estrictas de class-validator acá
  order?: any; 
}