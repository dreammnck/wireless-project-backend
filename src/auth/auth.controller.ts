import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Delete,
  Post,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    res.cookie('token', token, { httpOnly: true });
    return res.json({ data: token }).status(HttpStatus.OK).end();
  }

  @Delete('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token');
    return res.status(HttpStatus.NO_CONTENT).end();
  }
}
