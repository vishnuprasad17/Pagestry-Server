export interface SyncUserDto {
  firebaseUid: string;
  email: string;
  name?: string;
}

export interface SyncUserResultDto {
  mongoUserId: string;
  username: string;
  name: string;
  profileImage?: string;
}

export interface AdminLoginDto {
  username: string;
  password: string;
}

export interface AdminLoginResultDto {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export interface SessionCookieDto {
  sessionCookie: string;
  expiresIn: number;
}