import { Inject, Logger, SetMetadata } from '@nestjs/common';


import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { GoogleGuard } from './user-google-guard';
import * as cryptoJs from 'crypto-js';

@Injectable()
export class RolesGuardGoogle extends GoogleGuard implements CanActivate {
  logger = new Logger(RolesGuardGoogle.name);
  constructor(
    private readonly reflector: Reflector,
    readonly configService: ConfigService
  ) {
    super(configService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return false;
    }
    await super.canActivate(context); // First run the google Auth Guard
    const request = context.switchToHttp().getRequest();

    const bytes = cryptoJs.AES.decrypt(request.session?.user, this.configService.get('GOOGLE_AUTH_DATA_SECRET'));
    const user = JSON.parse(bytes.toString(cryptoJs.enc.Utf8));
    return roles.includes(user.role);
  }
}

