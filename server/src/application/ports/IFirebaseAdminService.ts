export interface IFirebaseAdminService {
  updateUser(uid: string, updates: { disabled: boolean }): Promise<void>;
  generatePasswordResetLink(email: string): Promise<string>;
  getUserByEmail(email: string): Promise<{ displayName?: string }>;
}