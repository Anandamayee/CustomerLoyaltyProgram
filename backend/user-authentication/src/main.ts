import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import * as cookieparser from 'cookie-parser';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';


async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get<ConfigService>(ConfigService);
  if(configService.get("LOCALHOST")){
    app.enableCors({
      origin:"*",
      methods:"GET,POST,PUT,DELETE,HEAD",
      preflightContinue:false,
      optionsSuccessStatus:204
    })
  }
  app.use(cookieparser());
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults:true,
      directives:{
        "script-src":["'self'"],
        "style-src":null
      }
    })
  )
  app.use((re,res,next)=>{
    res.header(
      "Cache-Control","private , no-cache ,no-store,must-revalidate"
    );
    next();
  })

  const config = new DocumentBuilder()
                .setTitle("Customer Loyalty backend API")
                .setDescription("Authentication APIS")
                .setVersion('1.0')
                .addServer('http://localhost:3000/')
                // .addCookieAuth('accessToken')
                .build();
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('auth/api',app,document);
  const jsonOutput = JSON.stringify(document,null,2);
  fs.writeFileSync('auth_swagger.json',jsonOutput);
  await app.listen(3000);
}
bootstrap();
