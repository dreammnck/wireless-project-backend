import { PrismaModule } from './../prisma/prisma.module';
import { MqttService } from './mqtt.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MqttController } from './mqtt.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'SENSOR_SERVICE',
        useFactory: (configService: ConfigService) => {
          const mqttUrl = configService.get<string>('mqtt.url');
          return {
            transport: Transport.MQTT,
                options: {
                  url:  mqttUrl
    },
          };
        },
        inject: [ConfigService],
        imports: [ConfigModule],
      },
    ]),
    PrismaModule,
  ],
  providers: [MqttService],
  controllers: [MqttController],
})
export class MqttModule {}
