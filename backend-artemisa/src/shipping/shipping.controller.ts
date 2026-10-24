// src/shipping/shipping.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('calculate')
  async calculate(@Body() body: { postalCode: string; weight?: number }) {
    const { postalCode, weight } = body;
    return await this.shippingService.calculateRate(postalCode, weight);
  }
}