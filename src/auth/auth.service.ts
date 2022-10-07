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

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    console.log(loginDto)
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user) {
      throw new NotFoundException({
        errorCode: HttpStatus.NOT_FOUND,
        message: 'User not Found',
      });
    }

    if (!(await bcrypt.compare(password, user['password']))) {
      throw new BadRequestException({
        errorCode: HttpStatus.BAD_REQUEST,
        message: `Invalid Username/Password`,
      });
    }

    const token = this.generateToken({ username, role: user.role });
    return token;
  }

  private generateToken(payload: PayloadDto) {
    return this.jwtService.sign(payload);
  }
}
