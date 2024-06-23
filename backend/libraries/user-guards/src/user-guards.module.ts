import { Module, SetMetadata } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'db-utilities';
import { UserStratagy } from './jwt/user.stratagy';
import { JWTGuard } from './jwt/user-jwt.guards';
import { GoogleStratagy } from './google/google.stratagy';
import { GoogleGuard } from './google/user-google-guard';
import { RolesGuardJWT } from './jwt/user-role.guard';
import { SessionSerializer } from './google/Serializer';


export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Module({
  imports: [
    PassportModule.register({ session: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: 3600
          }
        };
      }
    }),
    DatabaseModule
  ],
  providers: [UserStratagy,JWTGuard,ConfigService,GoogleStratagy,RolesGuardJWT,GoogleGuard,
    SessionSerializer
    ],
  exports: [PassportModule,JwtModule,UserStratagy,JWTGuard,RolesGuardJWT,GoogleStratagy,GoogleGuard,SessionSerializer]
})
export class UserGuardsModule {}
