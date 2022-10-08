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

    const roomWithAdditionalInfo = [];

    for (const room of rooms) {
      const currentPatient = await this.prisma.patient.findFirst({
        where: { roomId: room.id, isCheckout: false },
        select: { infusionHistory: true },
      });

      if (!currentPatient || room.isTrigger === false) {
        roomWithAdditionalInfo.push({ estimateFinishTime: '', ...room });
      } else {
        const currentInfusionHistory = currentPatient.infusionHistory.filter(
          (history) => {
            return history.isCompleted === false;
          },
        );
        roomWithAdditionalInfo.push({
          estimateFinishTime:
            currentInfusionHistory.length !== 0
              ? new Date(
                  new Date().getTime() +
                    (100 / currentInfusionHistory[0].dropRate) * 60 * 60000,
                ).toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })
              : '',
          ...room,
        });
      }
    }

    if (rooms.length === 0) {
      throw new NotFoundException({
        errorCode: HttpStatus.NOT_FOUND,
        message: 'Room Not Found',
      });
    }

    return roomWithAdditionalInfo;
  }
}
