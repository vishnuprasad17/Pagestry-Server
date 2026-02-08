import admin from '../config/firebase.config.js';
import { IFirebaseAdminService } from '../../application/ports/IFirebaseAdminService.js';

export class FirebaseAdminService implements IFirebaseAdminService {
  async updateUser(uid: string, updates: { disabled: boolean }): Promise<void> {
    await admin.auth().updateUser(uid, updates);
  }

  async generatePasswordResetLink(email: string): Promise<string> {
    return await admin.auth().generatePasswordResetLink(email);
  }

  async getUserByEmail(email: string): Promise<{ displayName?: string }> {
    const userRecord = await admin.auth().getUserByEmail(email);
    return {
      displayName: userRecord.displayName
    };
  }
}