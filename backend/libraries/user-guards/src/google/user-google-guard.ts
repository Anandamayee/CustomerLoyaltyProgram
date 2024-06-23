import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  logger = new Logger(GoogleGuard.name);
  constructor(configService: ConfigService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      if (!(await super.canActivate(context))) {
        throw new UnauthorizedException();
      }
      const request = context.switchToHttp().getRequest();
      await super.logIn(request);
      return true;
    } catch (error) {
      this.logger.log('error...', error);
    }
  }
}
