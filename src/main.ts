import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const host = configService.get<string>('host');
  const mqttUrl = configService.get<string>('mqtt.url');

  app.use(cookieParser());

  const microserviceMqtt = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: mqttUrl,
    },
  });

  await app.startAllMicroservices();
  await app.listen(port, host);

  app.getUrl().then((url) => {
    console.log(`Application is running on ${url}`);
  });
}
bootstrap();
