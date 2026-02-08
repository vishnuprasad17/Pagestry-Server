import cloudinary from "../config/cloudinary.config.js";
import { ICloudinaryService } from "../../application/ports/ICloudinaryService.js";

export class CloudinaryService implements ICloudinaryService {
  generateSignature(timestamp: number, folder: string): string {
    return cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET!
    );
  }

  getApiKey(): string {
    return process.env.CLOUDINARY_API_KEY!;
  }

  getCloudName(): string {
    return process.env.CLOUDINARY_CLOUD_NAME!;
  }
}