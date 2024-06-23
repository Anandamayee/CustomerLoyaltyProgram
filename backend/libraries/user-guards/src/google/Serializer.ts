import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User, UserDBProvider, decryptData, encryptData } from 'db-utilities';
import { ConfigService } from '@nestjs/config';


//use it when google idp manage your token 
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('USERDB_PROVIDER') readonly userDBProvider: UserDBProvider,
    readonly configService: ConfigService
  ) {
    super();
  }

  async serializeUser(user: any, done: Function) {
    const bytes = await encryptData(this.configService, 'GOOGLE_AUTH_DATA_SECRET', user.payload);
    done(null, bytes);
  }
  async deserializeUser(user: any, done: Function) {
    const { bytes, dataObject } = await decryptData(this.configService, 'GOOGLE_AUTH_DATA_SECRET', user.payload);
    const data = await this.userDBProvider.findUser(dataObject.email);
    data ? done(null, bytes) : done(null, null);
  }
}
