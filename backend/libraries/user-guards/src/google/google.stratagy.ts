import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserDBProvider } from 'db-utilities';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStratagy extends PassportStrategy(Strategy) {
  logger = new Logger(GoogleStratagy.name);
  constructor(
    configService: ConfigService,
    @Inject('USERDB_PROVIDER') readonly userDBProvider: UserDBProvider
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile']
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(refreshToken);
    // console.log('profile...', profile);
    const email = profile.emails[0].value;
    let user;
    try {
      user = await this.userDBProvider.findUser(email);
      this.logger.log('user...', user);
    } catch (error) {
      if (error instanceof NotFoundException && error.message.includes(`${email} not found`)) {
        const newUser = {
          name: profile.displayName,
          email: profile.emails[0].value,
          isOAuth: true
        };
        this.logger.log('new...', newUser);
        user = await this.userDBProvider.addUser(newUser);
        this.logger.log('user...', user);
      }
    }
    return user;
  }
}
