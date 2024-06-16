import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import {
  User,
  UpdateUserDTO,
  UserDTO,
  CreateUserDTO,
  UserLoginDTO,
  UserDBProvider,
} from 'db-utilities';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly userDBProvider: UserDBProvider) {}

  public async createUser(
    request: Request,
    userDetails: UserDTO,
  ): Promise<User> {
    try {
      const createUser: CreateUserDTO = {
        ...userDetails,
        createdAt: new Date(),
      };
      this.logger.log('userDBProvider',this.userDBProvider)
      return this.userDBProvider?.addUser(createUser);
    } catch (error) {
      this.logger.log('error',error)
      throw new BadRequestException(error)
    }
  }

  public async signInUser(
    request: Request,
    userDetails: UserLoginDTO,
  ): Promise<User> {
    try {
      const user = this.userDBProvider?.findUser(userDetails);
      return user;
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  public async getUser(request: Request, email: string): Promise<User> {
    // try {
    //   return userDBProvider?.findUser(email);
    // } catch (error) {
    //   console.log('error ', error);
    // }
    return 
  }

  public async updateUser(request: Request, user: UserDTO): Promise<User> {
    // try {
    //   return this.userDBProvider.updateUser(user);
    // } catch (error) {
    //   throw new BadRequestException(error)
    // }
    return 
  }
}
