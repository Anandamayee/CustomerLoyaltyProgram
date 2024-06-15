import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DBConnectionProvider } from "./DbInstance.provider";




@Global()
@Module({
    providers:[
        ConfigService,
        {
            inject:[ConfigService],
            provide:DBConnectionProvider,
            useFactory:async(configService:ConfigService) =>{
                const dbConnectionprovider = new DBConnectionProvider(configService)
                return dbConnectionprovider.init();
            }

        }
    ],
    exports:[DBConnectionProvider]
})

export class DatabaseModule{}