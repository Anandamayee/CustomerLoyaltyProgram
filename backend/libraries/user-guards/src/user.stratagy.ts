import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as cryptoJs from 'crypto-js';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserStratagy extends PassportStrategy(Strategy) {
  logger = new Logger(UserStratagy.name);
  constructor(readonly configService: ConfigService) {
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
