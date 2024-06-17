import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'db-utilities';
import { UserStratagy } from './user.stratagy';
import { JWTGuard } from './user-jwt.guards';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
  providers: [UserStratagy,JWTGuard],
  exports: [PassportModule,JwtModule,UserStratagy,JWTGuard]
})
export class UserGuardsModule {}
