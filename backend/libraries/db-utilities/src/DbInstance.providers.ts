import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { UserSchema } from './models/Auth/User/user.schema';
import { RefreshTokenSchema } from './models/Auth/Session/session.schema';
import * as cryptoJs from 'crypto-js';

export const getMongoConfig = (configService: ConfigService): MongooseModuleOptions => ({
  uri: configService.get<string>('LOYALTYPROGRAM_CONNECTION_STRING')
});

export const models = [
  { name: 'User', schema: UserSchema },
  { name: 'Session', schema: RefreshTokenSchema }
];

export const encryptData = async (configService: ConfigService, dataSecret: string, data: any) => {
  return cryptoJs.AES.encrypt(JSON.stringify(data), configService.get(dataSecret)).toString();
};

export const decryptData = async (configService: ConfigService, dataSecret: string, data: any) => {
  const bytes = cryptoJs.AES.decrypt(data, configService.get(dataSecret));
  const dataObject = JSON.parse(bytes.toString(cryptoJs.enc.Utf8));
  return { bytes, dataObject };
};
