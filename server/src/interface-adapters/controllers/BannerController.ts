import { Request, Response } from "express";
import { CreateBannerUseCase } from "../../application/use-cases/CreateBannerUseCase.js";
import { GetFilteredBannersUseCase } from "../../application/use-cases/GetFilteredBannersUseCase.js";
import { GetActiveBannersUseCase } from "../../application/use-cases/GetActiveBannersUseCase.js";
import { GetBannerByIdUseCase } from "../../application/use-cases/GetBannerByIdUseCase.js";
import { UpdateBannerUseCase } from "../../application/use-cases/UpdateBannerUseCase.js";
import { UpdateBannerStatusUseCase } from "../../application/use-cases/UpdateBannerStatusUseCase.js";
import { DeleteBannerUseCase } from "../../application/use-cases/DeleteBannerUseCase.js";
import { CreateBannerDto, UpdateBannerDto } from "../../application/dto/BannerDto.js";

export class BannerController {
  constructor(
    private readonly createBannerUseCase: CreateBannerUseCase,
    private readonly getFilteredBannersUseCase: GetFilteredBannersUseCase,
    private readonly getActiveBannersUseCase: GetActiveBannersUseCase,
    private readonly getBannerByIdUseCase: GetBannerByIdUseCase,
    private readonly updateBannerUseCase: UpdateBannerUseCase,
    private readonly updateBannerStatusUseCase: UpdateBannerStatusUseCase,
    private readonly deleteBannerUseCase: DeleteBannerUseCase
  ) {}

  async createBanner(req: Request, res: Response): Promise<void> {
    const dto: CreateBannerDto = req.body;

    const banner = await this.createBannerUseCase.execute(dto);
    res.status(201).json({
      success: true,
      data: banner,
      message: "Banner created successfully"
    });
  }

  async getFilteredBanners(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 12, sort } = req.query;

    const result = await this.getFilteredBannersUseCase.execute(
      Number(page),
      Number(limit),
      sort as string
    );

    res.status(200).json({
      success: true,
      data: result,
      message: "Banners fetched successfully"
    });
  }

  async getActiveBanners(req: Request, res: Response): Promise<void> {
    const banners = await this.getActiveBannersUseCase.execute();
    res.status(200).json({
      success: true,
      data: banners,
      message: "Active banners fetched successfully"
    });
  }

  async getSingleBanner(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const banner = await this.getBannerByIdUseCase.execute(id);
    res.status(200).json({
      success: true,
      data: banner,
      message: "Banner fetched successfully"
    });
  }

  async updateBanner(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dto: UpdateBannerDto = req.body;

    const banner = await this.updateBannerUseCase.execute(id, dto);
    res.status(200).json({
      success: true,
      data: banner,
      message: "Banner updated successfully"
    });
  }

  async updateBannerStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { status } = req.body;

    const banner = await this.updateBannerStatusUseCase.execute(id, status);
    res.status(200).json({
      success: true,
      data: banner,
      message: "Banner status updated successfully"
    });
  }

  async deleteBanner(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    await this.deleteBannerUseCase.execute(id);
    res.status(200).json({
      success: true,
      data: { success: true },
      message: "Banner deleted successfully"
    });
  }
}