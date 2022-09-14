import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class MqttController {
  constructor(private readonly mqtt) {}

  @MessagePattern('saline')
  test(@Payload() data: string, @Ctx() context: MqttContext) {
    console.log(data);
  }
}
