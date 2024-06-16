import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {User, UserDTO , UserLoginDTO} from 'db-utilities';
import { Request } from 'express';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('/signup')
  @ApiBody({type:UserDTO})
  @ApiOperation({ summary: "User Signup" })
  @ApiResponse({
    status: 200,
    description: "The record found",
    type: [User],
  })
  public async createUser(
    @Req() request:Request,
    @Body() userDetails:UserDTO
  ):Promise<User>{
      return await this.authService.createUser(request,userDetails);
  }

  @Post('/login')
  @ApiResponse({status:200,type:User})
  public async getUser(
    @Req() request :Request,
    @Body() userDetails:UserLoginDTO
  ): Promise<User> {
    return await this.authService.signInUser(request,userDetails)
  }


}
