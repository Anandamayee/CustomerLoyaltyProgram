import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  User,
  UserDTO,
  CreateUserDTO,
  UserLoginDTO,
  UserDBProvider,
  JwtServiceProvisers,
} from 'db-utilities';
import { ConfigService } from '@nestjs/config';
import * as cryptoJs from 'crypto-js';
import { JwtService } from '@nestjs/jwt';
import * as ms from 'ms';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userDBProvider: UserDBProvider,
    private configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly jwtServiceProvisers: JwtServiceProvisers,
  ) {}

  public async createUser(
    request: Request,
    userDetails: UserDTO,
  ): Promise<User> {
    try {
      const createUser: CreateUserDTO = {
        ...userDetails,
        createdAt: new Date(),
      };
      return this.userDBProvider?.addUser(createUser);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async signInUser(
    request: Request,
    userDetails: UserLoginDTO,
    response: Response,
  ): Promise<User> {
    try {
      const user = this.userDBProvider?.validateUser(userDetails);

      const data = cryptoJs.AES.encrypt(
        JSON.stringify(userDetails),
        this.configService.get('JWT_DATA_SECRET'),
      ).toString();

      const accessToken = this.jwtService.sign(
        { data },
        {
          expiresIn: this.configService.get('ACESS_TOKEN_AGE'),
        },
      );

      const session = await this.jwtServiceProvisers.storefreshToken(
        ms(this.configService.get('REFRESH_TOKEN_AGE')),
        data,
      );

      response.cookie('accessToken', accessToken, {
        domain: request.hostname,
        httpOnly: true,
        sameSite: true,
        maxAge: 60 * 60 * 1000,
        secure: true,
      });

      response.cookie('refreshToken', session.sessionId, {
        domain: request.hostname,
        httpOnly: true,
        sameSite: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
      });

      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async getUser(request: Request, email: string): Promise<User> {
    // try {
    //   return userDBProvider?.findUser(email);
    // } catch (error) {
    //   console.log('error ', error);
    // }
    return;
  }

  public async updateUser(request: Request, user: UserDTO): Promise<User> {
    // try {
    //   return this.userDBProvider.updateUser(user);
    // } catch (error) {
    //   throw new BadRequestException(error)
    // }
    return;
  }
}
