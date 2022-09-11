import { PrismaService } from './../prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, PayloadDto } from './dto';
import bcrypt from 'bcrypt';
import { Role } from 'src/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const admin = await this.prisma.admin.findUnique({ where: { username } });

    if (!admin) {
      throw new NotFoundException({
        errorCode: HttpStatus.NOT_FOUND,
        message: 'Admin not Found',
      });
    }

    if (!(await bcrypt.compare(password, admin['password']))) {
      throw new BadRequestException({
        errorCode: HttpStatus.BAD_REQUEST,
        message: `Invalid Username/Password`,
      });
    }

    const token = this.generateToken({username, role: Role.ADMIN});
    return token;
  }

  private  generateToken(payload: PayloadDto) {
    return this.jwtService.sign(payload)

  }
}
