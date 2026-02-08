export interface IImageStorageService {
  upload(file: Buffer, filename: string, foldername: string): Promise<string>;
  delete(imageUrl: string): Promise<void>;
}