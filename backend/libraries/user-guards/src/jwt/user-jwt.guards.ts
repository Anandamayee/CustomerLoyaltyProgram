import {
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import * as cryptoJs from 'crypto-js';
import { JwtServiceProviders } from 'db-utilities';

@Injectable()
export class JWTGuard extends AuthGuard('jwt') {
  logger = new Logger(JWTGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    @Inject('JWTSERVICE_PROVIDER') private readonly jwtServiceProvisers: JwtServiceProviders,
    private readonly configService: ConfigService
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //passport jwt stratagy validation
    try {

      if (!(await super.canActivate(context))) {
        throw new UnauthorizedException();
      }
      return true;
    } catch (error) {
      this.logger.log('catch block...', error);
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
        const newAccessToken = await this.jwtService.sign(
          { payload },
          {
            secret: this.configService.get('JWT_SECRET'),
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
