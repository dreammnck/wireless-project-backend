import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const mqttUrl = configService.get<string>('mqtt.url');

    app.enableCors({  origin: "http://localhost:3000",
   credentials: true})
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());


  const microserviceMqtt = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: mqttUrl
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);

  app.getUrl().then((url) => {
    console.log(`Application is running on ${url}`);
  });
}
bootstrap();
