import { HttpStatus, Patch } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { Response } from 'express';

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
