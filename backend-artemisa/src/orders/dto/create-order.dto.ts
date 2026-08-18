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
  @IsOptional()
  customerDni?: string; // 👈 Campo nuevo agregado para scoring antifraude en MP

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

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  @IsIn(['ALL', 'TRANSFER'])
  paymentType?: 'ALL' | 'TRANSFER';

  @IsNumber()
  @IsOptional()
  shippingCost?: number; // 👈 Agregado al DTO principal

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}