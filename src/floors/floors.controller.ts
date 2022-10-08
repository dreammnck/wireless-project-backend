import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { HttpStatus, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { FloorsService } from './floors.service';

@UseGuards(JwtAuthGuard)
@Controller('floors')
export class FloorsController {
  constructor(private readonly floorsService: FloorsService) {}

  @Get()
  async getAll(@Res() res: Response) {
    const floors = await this.floorsService.findAll();
    return res.json({ data: floors }).status(HttpStatus.OK);
  }

  @Get(':id')
  async getRooms(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() res: Response,
  ) {
    const rooms = await this.floorsService.findRoomByFloorId(id);
    return res.json({ data: rooms }).status(HttpStatus.OK);
  }
}
