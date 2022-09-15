import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get(':id')
  async getOne(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() res: Response,
  ) {
    const room = await this.roomsService.findById(id);
    return res.json({ data: room }).status(HttpStatus.OK);
  }
}
