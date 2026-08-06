// src/orders/orders.controller.ts
import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }
  // Mercado Pago envía notificaciones POST a este endpoint
 @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Query() query: any, @Body() body: any) {
    return this.ordersService.handleWebhook(query, body);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  // Ruta para cambiar el estado desde tu panel de Administración
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string
  ) {
    return this.ordersService.updateStatus(id, status);
  }
 

  
}