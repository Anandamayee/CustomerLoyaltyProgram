import { Model } from 'mongoose';
import { UserSchema } from '../models/Auth/User/user.schema';
import { User } from '../models/Auth/User/user.model';
import { CreateUserDTO, UserLoginDTO } from 'src/models/Auth/User/user.dto';
import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserDBProvider {
  private readonly logger = new Logger(UserDBProvider.name);
  private readonly saltOrRound = 10;

  constructor(@InjectModel('User') private userModel: Model<typeof UserSchema>) {}

  public async addUser(user: CreateUserDTO): Promise<User | any> {
    try {
      const userDetails : any = await this.userModel.findOne({ email: user.email }).exec();
      this.logger.log('userDetails', userDetails);
      if (!userDetails) {
        const salt = await bcrypt.genSalt(this.saltOrRound);
        user.password = await bcrypt.hash(user.password, salt);
        const data = new this.userModel(user);
        this.logger.log('data', data);
        return data.save();
      } else {
        throw new BadRequestException(`${user.email} already exist`);
      }
    } catch (error) {
      throw error;
    }
  }

  public async findUser(user: UserLoginDTO): Promise<User> {
    try {
      const userDetails :any = await this.userModel.findOne({ email: user.email }).exec();
      if (user) {
        const isMatch = await bcrypt.compare(userDetails.password, user.password);
        if (isMatch) {
          return userDetails as User;
        } else {
          throw new UnauthorizedException(`User name or password doesn't match`);
        }
      } else {
        throw new BadRequestException(`${user.email} not found`);
      }
    } catch (error) {
      throw error;
    }
  }

  public async updateUser(user: User): Promise<User | any > {
    try {
      const userDetail = await this.userModel.findByIdAndUpdate(user._id, user, { new: false }).exec();
      if (userDetail) {
        return userDetail;
      } else {
        throw new BadRequestException(`${user.email} not found`);
      }
    } catch (error) {
      throw error;
    }
  }
}
