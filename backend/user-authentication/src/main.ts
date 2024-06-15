import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get<ConfigService>(ConfigService);
  if(configService.get("LOCALHOST")){
    app.enableCors({
      origin
    })
  }
  await app.listen(3000);
}
bootstrap();
