import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { UserSchema } from './models/Auth/User/user.schema';

export const getMongoConfig = (configService: ConfigService): MongooseModuleOptions => ({
  uri: configService.get<string>('LOYALTYPROGRAM_CONNECTION_STRING'),
});


export const models = [
  { name: 'User' , schema: UserSchema },
];
