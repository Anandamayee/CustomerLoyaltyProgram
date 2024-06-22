import { ApiProperty } from '@nestjs/swagger';
import { Role } from './Role.enum';

export class User {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role?: Role;

  @ApiProperty()
  contact: string;

  @ApiProperty()
  access: string[];

  @ApiProperty()
  rewardPercentage: number;

  @ApiProperty()
  DOB?: String;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;

  @ApiProperty()
  isOAuth?:boolean;
}
