import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { SalineSensorData } from './dto';

@Injectable()
export class MqttService {
  constructor(private readonly prisma: PrismaService) {}

  async handleSalineData(data: SalineSensorData) {
    const { sensorValue, roomId } = data;
    const oldState = await this.prisma.room.findFirst({
      where: { name: roomId },
    });

    if (oldState.isTrigger === false && sensorValue > 0.27) {

      const room = await this.prisma.room.findFirst({where: {name: roomId}});
      const patient = await this.prisma.patient.findFirst({where: {roomId: room.id, isCheckout: false}, select: {infusionHistory: true}});
      const infustionHistory = patient.infusionHistory?.filter((history) => {return history.isCompleted === false});
      const estimateFinishTime = new Date(
                  new Date().getTime() +
                    (100 / infustionHistory[0].dropRate) * 60 * 60000,
                ).toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })
      await this.prisma.room.update({
        where: { name: roomId },
        data: { isTrigger: true, estimateFinishTime: estimateFinishTime },
      });
    }
  }
}
