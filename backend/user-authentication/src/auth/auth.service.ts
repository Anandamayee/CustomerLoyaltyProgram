import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  User,
  UserDTO,
  CreateUserDTO,
  UserLoginDTO,
  UserDBProvider,
} from 'db-utilities';
import { JWTHelper } from 'src/auth/jwtHelper';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject("USERDB_PROVIDER") private readonly userDBProvider: UserDBProvider,
    private readonly jWTHelper: JWTHelper,
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
      const user = await this.userDBProvider?.validateUser(userDetails);
      this.logger.log("user",user);
      await this.jWTHelper.gnerateJWTToken(request, response, user);
      return user;
    } catch (error) {
      this.logger.error('error', error);
      throw new BadRequestException(error);
    }
  }

  public async getUser(request: Request, email: string): Promise<User> {
    try {
      this.logger.log("request...",request.cookies['refreshToken'])
      return this.userDBProvider?.findUser(email);
    } catch (error) {
      this.logger.log('error ', error);
    }
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
