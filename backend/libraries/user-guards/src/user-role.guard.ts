import { Logger, SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JWTGuard } from './user-jwt.guards';
import { JwtService } from '@nestjs/jwt';
import { JwtServiceProvisers } from 'db-utilities';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard extends JWTGuard implements CanActivate {
  logger = new Logger(RolesGuard.name);
  constructor(
    private readonly reflector: Reflector,
    jwtService: JwtService,
    jwtServiceProvisers: JwtServiceProvisers,
    configService: ConfigService
  ) {
    super(jwtService, jwtServiceProvisers, configService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return false;
    }
    await super.canActivate(context); // First run the JWT Auth Guard
    const request = context.switchToHttp().getRequest();

    let  user = request.cookies?.user;
    user = JSON.parse(user)
    return roles.includes(user.role);
  }
}

