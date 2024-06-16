import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {  getMongoConfig, models } from "./DbInstance.providers";
import { MongooseModule } from "@nestjs/mongoose";
import { UserDBProvider } from "./dbProviders/userDBProvider";




@Global()
@Module({
    imports:[
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => getMongoConfig(configService),
          }),
          MongooseModule.forFeature(models),
    ],
    providers:[
        UserDBProvider
    ],
    exports:[UserDBProvider,MongooseModule]
})

export class DatabaseModule{}