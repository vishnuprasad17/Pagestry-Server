import { Request, Response } from "express";
import { GetUsersUseCase } from "../../application/use-cases/GetUsersUseCase.js";
import { GetUserByIdUseCase } from "../../application/use-cases/GetUserByIdUseCase.js";
import { UpdateUserUseCase } from "../../application/use-cases/UpdateUserUseCase.js";
import { AddToWishlistUseCase } from "../../application/use-cases/AddToWishlistUseCase.js";
import { RemoveFromWishlistUseCase } from "../../application/use-cases/RemoveFromWishlistUseCase.js";
import { GetWishlistUseCase } from "../../application/use-cases/GetWishlistUseCase.js";
import { UpdateUserDto } from "../../application/dto/UserDto.js";
import { GetCloudinarySignatureUseCase } from "../../application/use-cases/GetCloudinarySignatureUseCase.js";

export class UserController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly addToWishlistUseCase: AddToWishlistUseCase,
    private readonly removeFromWishlistUseCase: RemoveFromWishlistUseCase,
    private readonly getWishlistUseCase: GetWishlistUseCase,
    private readonly getCloudinarySignatureUseCase: GetCloudinarySignatureUseCase
  ) {}

  async getUsers(req: Request, res: Response): Promise<void> {
    const {
      page = 1,
      limit = 12,
      filter,
      sort,
      search
    } = req.query;

    const result = await this.getUsersUseCase.execute(
      Number(page),
      Number(limit),
      filter as string,
      sort as string,
      search as string
    );

    res.status(200).json({
      success: true,
      data: result,
      message: "Users fetched successfully"
    });
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const uid = req.user?.uid as string;
  
    const user = await this.getUserByIdUseCase.execute(uid);
    res.status(200).json({
      success: true,
      data: user,
      message: "User fetched successfully"
    });
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const dto: UpdateUserDto = req.body;
  
    const user = await this.updateUserUseCase.execute(userId, dto);
    res.status(200).json({
      success: true,
      data: user,
      message: "User updated successfully"
    });
  }

  async addToWishlist(req: Request, res: Response): Promise<void> {
    const { userId, bookId } = req.params;

    await this.addToWishlistUseCase.execute(userId, bookId);
      res.status(200).json({
        success: true,
        data: { success: true },
        message: "Book added to wishlist successfully"
      });
  }

  async removeFromWishlist(req: Request, res: Response): Promise<void> {
    const { userId, bookId } = req.params;

    await this.removeFromWishlistUseCase.execute(userId, bookId);
    res.status(200).json({
      success: true,
      data: { success: true },
      message: "Book removed from wishlist successfully"
    });
  }

  async getWishlist(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    const wishlist = await this.getWishlistUseCase.execute(userId);
    res.status(200).json({
      success: true,
      data: wishlist,
      message: "Wishlist fetched successfully"
    });
  }

  async getCloudinarySignature(req: Request, res: Response): Promise<void> {
    const { folder } = req.body;
    const signature = await this.getCloudinarySignatureUseCase.execute(folder);
    res.status(200).json(signature);
  }
}