import bcrypt from 'bcrypt';
import { IPasswordService } from '../../../application/ports/IPasswordService.js';

export class BcryptPasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}