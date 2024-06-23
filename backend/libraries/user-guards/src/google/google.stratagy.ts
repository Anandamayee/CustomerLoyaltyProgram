import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthStratagy, UserDBProvider } from 'db-utilities';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

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
      scope: ['email', 'profile'],
      accessType: 'offline'
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    // console.log('request..', request);
    // console.log('profile...', profile);
    // console.log("refreshToken....",refreshToken);
    
    const email = profile.emails[0].value;
    let payload;
    try {
      payload = await this.userDBProvider.findUser(email);
      // this.logger.log('uspayloader...', payload);
    } catch (error) {
      if (error instanceof NotFoundException && error.message.includes(`${email} not found`)) {
        const newUser = {
          name: profile.displayName,
          email: profile.emails[0].value,
          isOAuth: true,
          authStratagy: AuthStratagy.google
        };
        this.logger.log('new...', newUser);
        payload = await this.userDBProvider.addUser(newUser);
        this.logger.log('user...', payload);
      }
    }
    let user = payload ? { payload, googleAccessToken: accessToken, googleRefreshToken: refreshToken } : null;
    return done(null, user);
  }
}
