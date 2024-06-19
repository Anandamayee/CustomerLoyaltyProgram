import { Schema } from 'mongoose';
import { Access, RewardPercentage, Role } from './Role.enum';
import { access } from 'fs';

export const UserSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  DOB: {
    type: String,
    require: false
  },
  contact: {
    type: String,
    require: true
  },
  createdAt: {
    type: Date,
    require: false
  },
  updatedAt: {
    type: Date,
    require: false
  },
  role: {
    type: String,
    enum: Role,
    require: true
  },
  access: {
    type: [
      {
        type: String,
        enum: Access
      }
    ],
    require: true
  },
  rewardPercentage: {
    type: Number,
    require: true,
    enum: RewardPercentage
  }
});
