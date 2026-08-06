import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service'; // Ajustá la ruta según tu proyecto
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({
      global: true, // Hace que el JwtService esté disponible en todo el backend
      secret: process.env.JWT_SECRET || 'SECRET_KEY_FALLBACK',
      signOptions: { expiresIn: '1d' }, // El token expira en 1 día
    }),
   PrismaModule
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}