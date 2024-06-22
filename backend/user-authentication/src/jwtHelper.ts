import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import * as cryptoJs from 'crypto-js';
import { JwtService } from '@nestjs/jwt';
import * as ms from 'ms';
import { JwtServiceProviders, User, } from 'db-utilities';

@Injectable()
export class JWTHelper {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject('JWTSERVICE_PROVIDER')
    private readonly jwtServiceProvisers: JwtServiceProviders,
  ) {}

  public async gnerateJWTToken(
    request: Request,
    response: Response,
    user: User,
  ) {
    const data = cryptoJs.AES.encrypt(
      JSON.stringify(user),
      this.configService.get('JWT_DATA_SECRET'),
    ).toString();
    const accessToken = await this.jwtService.sign(
      { data },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('ACESS_TOKEN_AGE'),
      },
    );
    const session = await this.jwtServiceProvisers.storefreshToken(
      ms(this.configService.get('REFRESH_TOKEN_AGE')),
      data,
    );
    await response.cookie('accessToken', accessToken, {
      domain: request.hostname,
      httpOnly: true,
      sameSite: true,
      maxAge: 60 * 60 * 1000,
      secure: false,
    });

    await response.cookie('refreshToken', session.sessionId, {
      domain: request.hostname,
      httpOnly: true,
      sameSite: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
    });
    await response.cookie('user', JSON.stringify(user), {
      domain: request.hostname,
      httpOnly: true,
      sameSite: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
    });
    response.json({
      accessToken,
      refreshToken: session.sessionId,
      user,
    });
  }
}
