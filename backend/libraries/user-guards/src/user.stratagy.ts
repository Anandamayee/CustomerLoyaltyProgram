import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as cryptoJs from 'crypto-js';

export class UserStratagy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies['accessToken'];
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')
    });
  }

  async validate(payload: any) {
    const bytes = cryptoJs.AES.decrypt(payload.data, this.configService.get('JWT_DATA_SECRET'));
    const user = JSON.parse(bytes.toString(cryptoJs.enc.Utf8));
    return user;
  }
}
