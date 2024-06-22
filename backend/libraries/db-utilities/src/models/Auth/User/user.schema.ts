import { Schema } from 'mongoose';
import { Access, RewardPercentage, Role } from './Role.enum';
import { access } from 'fs';
import { validate } from 'class-validator';

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
    validate:{
      validator :function(v){
        if(this.isOAuth) return true;
        return v!=null
      }
    },
    message: props => `Password is required if OAuth is false`
  },
  DOB: {
    type: String,
    require: false
  },
  contact: {
    type: String,
    validate:{
      validator :function(v){
        if(this.isOAuth) return true;
        return v!=null
      }
    },
    message: props => `Password is required if OAuth is false`
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
    validate:{
      validator :function(v){
        if(this.isOAuth) return true;
        return v!=null
      }
    },
    message: props => `Role is required if OAuth is false`
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
  },
  isOAuth: { type: Boolean, default: true }
});
