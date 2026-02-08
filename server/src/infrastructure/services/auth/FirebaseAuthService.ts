import admin from '../../config/firebase.config.js';
import { FirebaseDecodedToken, FirebaseUserRecord, IFirebaseAuthService } from '../../../application/ports/IFirebaseAuthService.js';

export class FirebaseAuthService implements IFirebaseAuthService {
  async verifyIdToken(token: string): Promise<FirebaseDecodedToken> {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name
    };
  }

  async getUser(uid: string): Promise<FirebaseUserRecord> {
    const userRecord = await admin.auth().getUser(uid);
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      disabled: userRecord.disabled,
      providerData: userRecord.providerData
    };
  }

  async createSessionCookie(idToken: string, expiresIn: number): Promise<string> {
    return await admin.auth().createSessionCookie(idToken, { expiresIn });
  }

  async verifySessionCookie(sessionCookie: string): Promise<FirebaseDecodedToken> {
    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name
    };
  }

  async revokeRefreshTokens(uid: string): Promise<void> {
    await admin.auth().revokeRefreshTokens(uid);
  }
}