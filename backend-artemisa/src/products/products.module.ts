import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
   imports: [PrismaModule, CloudinaryModule,ConfigModule.forRoot()] // Asegúrate de importar ConfigModule para usar variables de entorno
  
})
export class ProductsModule {}
