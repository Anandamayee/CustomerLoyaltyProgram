import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role, User, UserDTO, UserLoginDTO } from 'db-utilities';
import { Request, Response, response } from 'express';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles, RolesGuardJWT, GoogleGuard } from 'user-guards';
import { JWTHelper } from 'src/auth/jwtHelper';
import { log } from 'console';
import { STATUS_CODES } from 'http';
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    private readonly jWTHelper: JWTHelper,
  ) {}

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
    response.redirect('/auth/welcome');
    return await this.authService.signInUser(request, userDetails, response);
  }

  @Get('/user/:email')
  @ApiResponse({ status: 200, type: User })
  @Roles(Role.Basic)
  @UseGuards(RolesGuardJWT)
  public async getUser(
    @Req() request: Request,
    @Param('email') email: string,
  ): Promise<User> {
    return await this.authService.getUser(request, email);
  }

  @Get('/google/login')
  @ApiResponse({ status: 200 })
  @UseGuards(GoogleGuard)
  public async googleLogin(@Req() request: Request): Promise<any> {
    return 'Hey Google';
  }

  @Get('/google/redirect')
  @ApiResponse({ status: 200 })
  @UseGuards(GoogleGuard)
  public async redirectPage(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    await this.jWTHelper.gnerateJWTToken(
      request,
      response,
      request.user['payload'] as User,
    );
    return response.json({ statusCode: 200 });
  }

  @Get('logout')
  @ApiResponse({ status: 200 })
  logout(@Req() req: Request, @Res() res: Response) {
    // Clear session or token from cookie on logout
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('user');
    res.redirect('/auth/home');
  }

  @Get('/welcome')
  @Roles(Role.Basic)
  @UseGuards(RolesGuardJWT)
  @ApiResponse({ status: 200 })
  landingPage(@Req() req: Request, @Res() res: Response) {
    return res.json({
      statusCode : 200,
      msg :"'Welcome to LoyaltyProgram!!'"
    });
  }

  @Get('/home')
  @ApiResponse({ status: 200 })
  homePage(@Req() req: Request, @Res() res: Response) {
   return res.json("Please login")
  }
}
