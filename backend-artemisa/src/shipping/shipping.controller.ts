import { Controller, Post, Body } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('calculate')
  async calculate(@Body() body: { postalCode: string; items?: { variantId: number; quantity: number }[] }) {
    const { postalCode, items } = body;
    return await this.shippingService.calculateRate(postalCode, items);
  }
}