import { SignOptions } from "jsonwebtoken";
import { UserRole } from "../../domain/value-objects/UserRole.js";

export interface IJwtService {
  sign(payload: JwtPayload, expiresIn: SignOptions['expiresIn']): string;
  verify(token: string): JwtPayload;
}

export interface JwtPayload {
  id: string;
  username: string;
  role: UserRole;
}