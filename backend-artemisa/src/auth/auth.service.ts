import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. REGISTRO (Crear Cuenta)
  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // Verificar si el email ya existe
    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    // Encriptar la contraseña (10 es el número de salt rounds, estándar de la industria)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar en la base de datos (por defecto el esquema le pone el rol USER)
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Devolvemos los datos del usuario omitiendo la contraseña por seguridad
    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      message: 'Usuario registrado con éxito',
    };
  }

  // 2. LOGIN (Ingresar)
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar al usuario por email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Comparar la contraseña ingresada con la encriptada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Si todo está bien, preparamos el "Payload" (la info que viaja dentro del token)
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };

    // Firmamos el token y lo devolvemos junto con los datos básicos del usuario
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      backend_token: await this.jwtService.signAsync(payload),
    };
  }
}