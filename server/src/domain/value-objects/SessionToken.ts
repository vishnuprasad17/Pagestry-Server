export class SessionToken {
  constructor(
    public readonly token: string,
    public readonly expiresAt: Date
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}