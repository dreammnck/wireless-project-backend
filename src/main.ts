import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const host = configService.get<string>('host');

  await app.listen(port, host);
  app.getUrl().then((url) => {
    console.log(`Application is running on ${url}`);
  });
}
bootstrap();
