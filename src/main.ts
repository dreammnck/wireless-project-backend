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

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({origin: "*", methods: "GET,PUT,PATCH,POST,DELETE"})

//   const projectId = "local-topic-364613";
//   const region = "asia-east1";
//   const registryId = "wireless-project-test1";
//   const deviceId = "saline1";
//   const serverCertFile = "/Volumes/project/wireless-project/project/backend/roots.pem"
//   const privateKeyFile = "/Volumes/project/wireless-project/project/backend/rsa_private.pem"

//   const mqttClientId = `projects/local-topic-364613/topics/saline`;
//   const createJwt = (projectId: string, privateKeyFile: string) => {
//   const token = {
//     iat: Number(Date.now() / 1000),
//     exp: Number(Date.now() / 1000) + 20 * 60, // 20 minutes
//     aud: projectId,
//   };
//   const privateKey = readFileSync(privateKeyFile);
//   const jwt = new JwtService({signOptions: {algorithm: "RS256"}});
//   return jwt.sign(token, {privateKey, });
// };

//   const microserviceMqtt = app.connectMicroservice<MicroserviceOptions>({
//     transport: Transport.MQTT,
//     options: {
//     host: "mqtt.googleapis.com",
//     port: 8883,
//     clientId: mqttClientId,
//     username: 'unused',
//     password:  createJwt(projectId, privateKeyFile ),
//     protocol: 'mqtts',
//     ca: [readFileSync(serverCertFile)],
    
//     },
//   });


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
