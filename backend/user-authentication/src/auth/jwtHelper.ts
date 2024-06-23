import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as ms from 'ms';
import { JwtServiceProviders, User, encryptData, } from 'db-utilities';

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
    console.log("user....",user);
    
    const data = await encryptData(this.configService, 'JWT_DATA_SECRET', user);
    const accessToken = await this.jwtService.sign(
      { data },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('ACESS_TOKEN_AGE'),
      },
    );
    console.log("data....",data);
    const session = await this.jwtServiceProvisers.storefreshToken(
      ms(this.configService.get('REFRESH_TOKEN_AGE')),
      data,
    );
    await response.cookie('accessToken', accessToken, {
      domain: request.hostname,
      httpOnly: true,
      sameSite: true,
      maxAge: 60 * 60 * 1000,
      secure: true,
    });

    await response.cookie('refreshToken', session.sessionId, {
      domain: request.hostname,
      httpOnly: true,
      sameSite: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    });
    await response.cookie('user', JSON.stringify(user), {
      domain: request.hostname,
      httpOnly: true,
      sameSite: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    });
    await response.cookie('googleAccessToken',request.user['googleAccessToken'],{
      domain: request.hostname,
      httpOnly: true,
      sameSite: true,
      maxAge: 60 * 60 * 1000,
      secure: true,
    });
    await response.cookie('googleRefreshToken',request.user['googleRefreshToken'],{
      domain: request.hostname,
      httpOnly: true,
      sameSite: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    });
  }
}
