import nodemailer from 'nodemailer';
import { IEmailService } from '../../application/ports/IEmailService.js';


interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const config: EmailConfig = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASSWORD || ''
      }
    };

    this.transporter = nodemailer.createTransport(config);
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service is ready to send emails');
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetLink: string,
    userName?: string
  ): Promise<void> {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Pagestry'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: this.getPasswordResetTemplate(resetLink, userName),
      text: `Hi ${userName || 'there'},\n\nYou requested to reset your password. Click the link below to reset it:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nPagestry Team`
    };

    await this.transporter.sendMail(mailOptions);
  }

  private getPasswordResetTemplate(resetLink: string, userName?: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                  <tr>
                    <td style="background-color: #4F46E5; padding: 40px 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Password Reset</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Hi ${userName || 'there'},
                      </p>
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        We received a request to reset your password. Click the button below to create a new password:
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 30px 0;">
                            <a href="${resetLink}" 
                               style="background-color: #4F46E5; 
                                      color: #ffffff; 
                                      text-decoration: none; 
                                      padding: 14px 40px; 
                                      border-radius: 6px; 
                                      font-size: 16px; 
                                      font-weight: bold;
                                      display: inline-block;">
                              Reset Password
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                        Or copy and paste this link into your browser:
                      </p>
                      <p style="color: #4F46E5; font-size: 14px; word-break: break-all; margin: 0 0 20px 0;">
                        ${resetLink}
                      </p>
                      <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
                        <strong>This link will expire in 1 hour.</strong>
                      </p>
                      <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0;">
                        If you didn't request a password reset, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                      <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 0;">
                        This is an automated email, please do not reply.
                      </p>
                      <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 10px 0 0 0;">
                        © ${new Date().getFullYear()} Pagestry. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }
}