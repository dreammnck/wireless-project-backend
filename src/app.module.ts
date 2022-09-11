import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { RoomsModule } from './rooms/rooms.module';
import { FloorsModule } from './floors/floors.module';
import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development'],
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    FloorsModule,
    RoomsModule,
    PatientsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
