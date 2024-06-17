import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from 'src/models/Auth/Session/session.model';
import { RefreshTokenSchema } from 'src/models/Auth/Session/session.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JwtServiceProvisers {
  constructor(@InjectModel('Session') private readonly refreshTokenModel: Model<typeof RefreshTokenSchema>) {}

  public async storefreshToken(ageInMS: number, payload: string): Promise<Session | any> {
    const id = uuidv4();
    return await this.refreshTokenModel.create({
      _id: id,
      sessionId: id.toString(),
      payload,
      validUntile: Date.now() + ageInMS
    });
  }

  public async getSessionPayload(sessionId: string): Promise<string> {
    const session: Session = await this.refreshTokenModel.findById(sessionId);
    return session?.payload;
  }

  public async isValidSession(sessionId: string): Promise<boolean> {
    return (
      (await this.refreshTokenModel.findOne({
        sessionId,
        validUntile: {
          $gte: Date.now()
        }
      })) !== null
    );
  }

  public async deleteSession(sessionId: string): Promise<void> {
    await this.refreshTokenModel.findByIdAndDelete(sessionId);
  }

  public async deleteExpiredSession(): Promise<void> {
    await this.refreshTokenModel.deleteMany({
      validUntile: {
        $lt: Date.now()
      }
    });
  }

  public async refreshToken(sessionId: string): Promise<Session | any> {
    const session: Session = await this.refreshTokenModel.findById(sessionId);
    if (!session) {
      throw new UnauthorizedException('User Not Found');
    }
    const age = 60 * 60;
    return this.storefreshToken(age, session.payload);
  }
}
