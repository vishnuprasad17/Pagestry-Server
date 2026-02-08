export interface IEmailService {
  sendPasswordResetEmail(email: string, resetLink: string, userName?: string): Promise<void>;
}