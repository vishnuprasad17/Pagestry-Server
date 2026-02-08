import jwt, { SignOptions } from 'jsonwebtoken';
import { IJwtService, JwtPayload } from '../../application/ports/IJwtService.js';

export class JwtService implements IJwtService {
  constructor(private readonly secret: string) {}

  sign(payload: JwtPayload, expiresIn: SignOptions['expiresIn']): string {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  verify(token: string): JwtPayload {
    return jwt.verify(token, this.secret) as JwtPayload;
  }
}