import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.use(cookieParser());
  if (configService.get('LOCALHOST')) {
    app.enableCors({
      origin: '*',
      methods: 'GET,POST,PUT,DELETE,HEAD',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });
  }

  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        'script-src': ["'self'"],
        'style-src': null,
      },
    }),
  );

  app.use(
    session({
      secret: configService.get('SESSION_SECRET'),
      resave:false,
      cookie:{
        maxAge:360000
      }
    }),
  );

  app.use(passport.initialize());

  app.use(session())

  app.use((re, res, next) => {
    res.header('Cache-Control', 'private , no-cache ,no-store,must-revalidate');
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Customer Loyalty backend API')
    .setDescription('Authentication APIS')
    .setVersion('1.0')
    .addServer('http://localhost:3000/')
    .addCookieAuth('accessToken')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('auth/api', app, document);
  const jsonOutput = JSON.stringify(document, null, 2);
  fs.writeFileSync('auth_swagger.json', jsonOutput);
  await app.listen(3000);
}
bootstrap();
