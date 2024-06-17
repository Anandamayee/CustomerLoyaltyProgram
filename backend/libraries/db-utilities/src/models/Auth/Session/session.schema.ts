import { IsString } from 'class-validator';
import mongoose from 'mongoose';
import { Role } from '../User/Role.enum';

export const RefreshTokenSchema = new mongoose.Schema({
  payload: { type: String, require: true },
  validUntile: { type: Number, require: true },
  sessionId: { type: String, require: true }
});
