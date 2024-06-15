import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';
import {DatabaseModule} from 'db-utilities';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath:"config.env",
      isGlobal:true
    }),
    HttpModule.registerAsync({
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>{
        return configService.get<Boolean>('LOCALHOST')?{}
        :{ httpsAgent : new https.Agent({
          rejectUnauthorized:false
        })}
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
