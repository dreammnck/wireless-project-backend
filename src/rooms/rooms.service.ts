import { UpdatedRoomDto } from './dto/update-room.dto';
import { HttpStatus } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  public async findById(id: number) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { patients: true },
    });

    if (!room) {
      throw new NotFoundException({
        errorCode: HttpStatus.NOT_FOUND,
        message: 'Room Not Found',
      });
    }

    const currentPatient = room.patients.filter((patient) => {
      return patient.isCheckout === false;
    });

    return {
      ...room,
      patients: currentPatient.length === 0 ? [] : currentPatient[0],
    };
  }

  public async update(updateRoomDto: UpdatedRoomDto, id: number) {
    const updatedRoom = await this.prisma.room.update({
      where: { id },
      data: { ...updateRoomDto },
    });
    return updatedRoom;
  }
}
