import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User, UserDBProvider } from 'db-utilities';
import * as cryptoJs from 'crypto-js';
import { ConfigService } from '@nestjs/config';

export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('USERDB_PROVIDER') readonly userDBProvider: UserDBProvider,
    readonly configService: ConfigService
  ) {
    super();
  }

  serializeUser(user: User, done: Function) {
    const bytes = cryptoJs.AES.encrypt(
      JSON.stringify(user),
      this.configService.get('GOOGLE_AUTH_DATA_SECRET')
    ).toString();
    done(null, bytes);
  }
  async deserializeUser(payload: any, done: Function) {
    const bytes = cryptoJs.AES.decrypt(payload, this.configService.get('GOOGLE_AUTH_DATA_SECRET'));
    const user = JSON.parse(bytes.toString(cryptoJs.enc.Utf8));
    const data = await this.userDBProvider.findUser(user.email);
    data ? done(null, bytes) : done(null, null);
  }
}
