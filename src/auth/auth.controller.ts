import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Delete,
  Post,
  Res,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    res.cookie('token', token, { httpOnly: true });
    return res.status(HttpStatus.OK).end();
  }

  @Delete('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token');
    return res.status(HttpStatus.NO_CONTENT).end();
  }
}
