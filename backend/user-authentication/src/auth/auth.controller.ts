import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {User,CreateUserDTO} from 'db-utilities';
import { Request } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post()
  public async createUser(
    @Req() request:Request,
    @Body() userDetails:CreateUserDTO
  ):Promise<User>{
    return await this.authService.createUser(request,userDetails);
  }

//   @Get()
//   getHello(): string {
//     return
//   }
}
