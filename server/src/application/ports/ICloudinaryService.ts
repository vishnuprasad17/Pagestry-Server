export interface ICloudinaryService {
  generateSignature(timestamp: number, folder: string): string;
  getApiKey(): string;
  getCloudName(): string;
}