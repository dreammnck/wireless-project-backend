import { PrismaService } from './../prisma/prisma.service';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FloorsService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll() {
    const floors = await this.prisma.floor.findMany();
    if (!floors) {
      throw new NotFoundException({
        errorCode: HttpStatus.NOT_FOUND,
        message: 'Floor Not Found',
      });
    }

    return floors;
  }

  public async findRoomByFloorId(floorId: number) {
    const { rooms } = await this.prisma.floor.findUnique({
      where: { id: floorId },
      include: { rooms: true },
    });
    if (rooms.length === 0) {
      throw new NotFoundException({
        errorCode: HttpStatus.NOT_FOUND,
        message: 'Room Not Found',
      });
    }

    return rooms;
  }
}
