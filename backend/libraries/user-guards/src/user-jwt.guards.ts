import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { JwtServiceProvisers } from 'db-utilities';
import { Request, Response } from 'express';
import * as cryptoJs from 'crypto-js';
import * as ms from 'ms';

@Injectable()
export class JWTGuard extends AuthGuard('jwt') {
  logger = new Logger(JWTGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtServiceProvisers: JwtServiceProvisers,
    private readonly configService: ConfigService
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //passport jwt stratagy validation
    try {
      // this.logger.log("verify",await this.jwtService.verifyAsync(request.cookies['accessToken'],{secret :this.configService.get('JWT_SECRET')}))
      if (!(await super.canActivate(context))) {
        throw new UnauthorizedException();
      }
      return true;
    } catch (error) {
      this.logger.log('catch block...',error);
      const request: Request = context.switchToHttp().getRequest();
      const response: Response = context.switchToHttp().getResponse();
      try {
        const refreshToken = request.cookies['refreshToken'];
        if (!refreshToken) {
          throw new UnauthorizedException();
        }
        if (!(await this.jwtServiceProvisers.isValidSession(refreshToken))) {
          throw new UnauthorizedException();
        }
        const payload = await this.jwtServiceProvisers.getSessionPayload(refreshToken);
        const bytes = cryptoJs.AES.decrypt(payload, this.configService.get('JWT_DATA_SECRET'));
        const user = JSON.parse(bytes.toString(cryptoJs.enc.Utf8));
        const newAccessToken = await this.jwtService.sign(
          { bytes },
          {
            expiresIn: this.configService.get('ACESS_TOKEN_AGE')
          }
        );
        response.cookie('accessToken', newAccessToken, {
          domain: request.hostname,
          httpOnly: true,
          sameSite: true,
          maxAge: 60 * 60 * 1000,
          secure: true
        });

        request.user = user;
        this.logger.log('roles...', user);
        return true;
      } catch (error) {
        response.clearCookie('connet.sid', {
          path: '/',
          domain: request.hostname
        });
        response.clearCookie('accessToken', {
          domain: request.hostname,
          httpOnly: false,
          sameSite: false,
          secure: true
        });
        response.clearCookie('refreshToken', {
          domain: request.hostname,
          httpOnly: false,
          sameSite: false,
          secure: true
        });
        response.clearCookie('user', {
          domain: request.hostname,
          httpOnly: false,
          sameSite: false,
          secure: true
        });
        return false;
      }
    }
  }
}
