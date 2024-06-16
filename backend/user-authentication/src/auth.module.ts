import { ExceptionFilter, Module ,Catch, ArgumentsHost, HttpException, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';
import {DatabaseModule} from 'db-utilities';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    // Modify the response object with the exception message
    response.status(status).json({
      statusCode: status,
      message: exception.message, // Access the exception message
      error: exception, // Optional: Include the full exception object (for debugging)
    });
  }
}


@Module({
  imports: [
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
    }),
    DatabaseModule
  ],
  controllers: [AuthController],
  providers: [AuthService
    
  ],
})
export class AuthModule {}
