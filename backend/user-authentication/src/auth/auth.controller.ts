import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role, User, UserDTO, UserLoginDTO } from 'db-utilities';
import { Request, Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JWTGuard ,Roles, RolesGuard } from 'user-guards';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiBody({ type: UserDTO })
  @ApiOperation({ summary: 'User Signup' })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: [User],
  })
  public async createUser(
    @Req() request: Request,
    @Body() userDetails: UserDTO,
  ): Promise<User> {
    return await this.authService.createUser(request, userDetails);
  }

  @Post('/login')
  @ApiResponse({ status: 200, type: User })
  public async signInUser(
    @Req() request: Request,
    @Body() userDetails: UserLoginDTO,
    @Res() response: Response,
  ): Promise<User> {
    return await this.authService.signInUser(request, userDetails, response);
  }

  @Get('/user/:email')
  @ApiResponse({ status: 200, type: User })
  @Roles(Role.Basic)
  @UseGuards(RolesGuard)
  public async getUser(
    @Req() request: Request,
    @Param('email') email: string,
  ): Promise<User> {
    return await this.authService.getUser(request, email);
  }
}
