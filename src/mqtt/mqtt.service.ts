import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { SalineSensorData } from './dto';

@Injectable()
export class MqttService {
  constructor(private readonly prisma: PrismaService) {}

  async handleSalineData(data: SalineSensorData) {
    const { sensorValue, roomId } = data;
    const oldState = await this.prisma.room.findFirst({where: {name: roomId}});

    if (oldState.isTrigger ===  false && sensorValue > 0.27) {
      await this.prisma.room.update({
        where: { name: roomId },
        data: { isTrigger: true },
      });
    }
  }
}
