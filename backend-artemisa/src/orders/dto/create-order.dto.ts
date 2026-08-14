// src/orders/dto/create-order.dto.ts
import { IsArray, IsNumber, IsNotEmpty, IsString, IsEmail, IsOptional, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  variantId!: number;

  @IsNumber()
  @IsNotEmpty()
  quantity!: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsEmail()
  @IsNotEmpty()
  customerEmail!: string;

  @IsString()
  @IsNotEmpty()
  customerPhone!: string;

  @IsString()
  @IsIn(['RETIRO', 'ENVIO'])
  deliveryMethod!: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  // Cambia esto en tu DTO:
  @IsString()
  @IsOptional() // Lo hacemos opcional porque ahora lo asignamos nosotros
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  @IsIn(['ALL', 'TRANSFER'])
  paymentType?: 'ALL' | 'TRANSFER';
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

}