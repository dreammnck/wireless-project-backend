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

    const total = (await this.prisma.room.findMany())?.length;
    const reserved = (
      await this.prisma.patient.findMany({ where: { isCheckout: false } })
    ).length;

    const buildingInfo = {
      total: total,
      reserved: reserved,
      available: total - reserved,
    };

    return { floors, buildingInfo };
  }

  public async findRoomByFloorId(floorId: number) {
    const rooms = await this.prisma.room.findMany({ where: { floorId } });
    if (rooms.length === 0) {
      throw new NotFoundException({
        errorCode: HttpStatus.NOT_FOUND,
        message: 'Room Not Found',
      });
    }

    return rooms;
  }
}
