import { Model } from 'mongoose';
import { UserSchema } from '../models/Auth/User/user.schema';
import { User } from '../models/Auth/User/user.model';
import { CreateUserDTO, UserLoginDTO } from 'src/models/Auth/User/user.dto';
import * as bcrypt from 'bcrypt';
import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Access, RewardPercentage, Role } from '../models/Auth/User/Role.enum';
import { access } from 'fs';

@Injectable()
export class UserDBProvider {
  private readonly saltOrRound = 10;
  private readonly logger = new Logger(UserDBProvider.name);
  constructor(@InjectModel('User') private userModel: Model<typeof UserSchema>) {}

  public async addUser(user: CreateUserDTO): Promise<User | any> {
    try {
      const userDetails: any = await this.userModel.findOne({ email: user.email }).exec();
      if (userDetails) {
        throw new NotFoundException(`${user.email} already exist`);
      }
      const salt = await bcrypt.genSalt(this.saltOrRound);
      const newUser = {
        ...user,
        password: await bcrypt.hash(user.password, salt),
        role: Role.Basic,
        access: [Access.airline, Access.resturant, Access.retail],
        rewardPercentage: RewardPercentage.basicReward,
        createdAt: new Date()
      };
      const data = new this.userModel(newUser);
      return data.save();
    } catch (error) {
      throw error;
    }
  }

  public async validateUser(user: UserLoginDTO): Promise<User> {
    try {
      const userDetails: any = await this.userModel.findOne({ email: user.email }).exec();
      if (!userDetails) {
        throw new NotFoundException(`${user.email} not found`);
      }
      const isMatch = await bcrypt.compare(user.password, userDetails.password);
      if (!isMatch) {
        throw new UnauthorizedException(`User name or password doesn't match`);
      }
      const { password, ...result } = userDetails['_doc'];
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async findUser(email: string): Promise<User> {
    try {
      const userDetails: any = await this.userModel.findOne({ email: email }).exec();
      if (!userDetails) {
        throw new NotFoundException(`${email} not found`);
      }
      const { password, ...result } = userDetails['_doc'];
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async updateUser(user: User): Promise<User | any> {
    try {
      const userDetail = await this.userModel.findByIdAndUpdate(user._id, user, { new: false }).exec();
      if (!userDetail) {
        throw new NotFoundException(`${user.email} not found`);
      }
      return userDetail;
    } catch (error) {
      throw error;
    }
  }
}
