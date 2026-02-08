import cloudinary from '../config/cloudinary.config.js';
import { IImageStorageService } from '../../application/ports/IImageStorageService.js';

export class CloudinaryImageStorage implements IImageStorageService {
  async upload(file: Buffer, filename: string, foldername: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: foldername, public_id: filename },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        }
      );
      uploadStream.end(file);
    });
  }

  async delete(imageUrl: string): Promise<void> {
    const urlParts = imageUrl.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = `book-covers/${publicIdWithExtension.split('.')[0]}`;

    await cloudinary.uploader.destroy(publicId);
  }
}