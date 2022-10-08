import { MqttService } from './mqtt.service';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { SalineSensorData } from './dto';

@Controller()
export class MqttController {
  constructor(private readonly mqttService: MqttService) {}

  @MessagePattern('saline')
  async handleSalineData(
    @Payload() data: SalineSensorData,
    @Ctx() _: MqttContext,
  ) {
    console.log(data);
    await this.mqttService.handleSalineData(data);
  }
}
