import { CloudinarySignatureDto } from "../dto/AdminDto.js";
import { ICloudinaryService } from "../ports/ICloudinaryService.js";

export class GetCloudinarySignatureUseCase {
  constructor(private readonly cloudinaryService: ICloudinaryService) {}

  async execute(folder: string): Promise<CloudinarySignatureDto> {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = this.cloudinaryService.generateSignature(timestamp, folder);

    return {
      timestamp,
      signature,
      apiKey: this.cloudinaryService.getApiKey(),
      cloudName: this.cloudinaryService.getCloudName()
    };
  }
}