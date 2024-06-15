
import { ConfigService } from '@nestjs/config';
import { ConnectOptions, Mongoose } from 'mongoose';
import { UserDBProvider } from './dbProviders/userDBProvider';



export class DBConnectionProvider{

    private LoyaltyProgramDBConnection;

    constructor(private readonly configService:ConfigService){}

    public async init(){
        const option :ConnectOptions ={
            autoIndex:true,
            serverSelectionTimeoutMS:3000
        }

        this.LoyaltyProgramDBConnection = new Mongoose();
        await this.LoyaltyProgramDBConnection.connect(
            this.configService.get('LOYALTYPROGRAM_CONNECTION_STRING'),option
        );

    }

    public async getDBConnection(type){
        let dbProvider : any;
        switch(type){
            case('User'):
                dbProvider = new UserDBProvider(this.LoyaltyProgramDBConnection)
        }
        return dbProvider;
    }
}