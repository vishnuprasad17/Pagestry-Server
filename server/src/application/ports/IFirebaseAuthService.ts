export interface IFirebaseAuthService {
  verifyIdToken(token: string): Promise<FirebaseDecodedToken>;
  getUser(uid: string): Promise<FirebaseUserRecord>;
  createSessionCookie(idToken: string, expiresIn: number): Promise<string>;
  verifySessionCookie(sessionCookie: string): Promise<FirebaseDecodedToken>;
  revokeRefreshTokens(uid: string): Promise<void>;
}

export interface FirebaseDecodedToken {
  uid: string;
  email?: string;
  name?: string;
}

export interface FirebaseUserRecord {
  uid: string;
  email?: string;
  displayName?: string;
  disabled: boolean;
  providerData: Array<{
    providerId: string;
  }>;
}