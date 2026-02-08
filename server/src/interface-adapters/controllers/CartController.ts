import { Request, Response } from "express";
import { GetCartUseCase } from "../../application/use-cases/GetCartUseCase.js";
import { UpdateCartItemUseCase } from "../../application/use-cases/UpdateCartItemUseCase.js";
import { RemoveCartItemUseCase } from "../../application/use-cases/RemoveCartItemUseCase.js";
import { MergeGuestCartUseCase } from "../../application/use-cases/MergeGuestCartUseCase.js";
import { ValidateCartStockUseCase } from "../../application/use-cases/ValidateCartStockUseCase.js";
import { ClearCartUseCase } from "../../application/use-cases/ClearCartUseCase.js";

export class CartController {
  constructor(
    private readonly getCartUseCase: GetCartUseCase,
    private readonly updateCartItemUseCase: UpdateCartItemUseCase,
    private readonly removeCartItemUseCase: RemoveCartItemUseCase,
    private readonly mergeGuestCartUseCase: MergeGuestCartUseCase,
    private readonly validateCartStockUseCase: ValidateCartStockUseCase,
    private readonly clearCartUseCase: ClearCartUseCase
  ) {}

  async getCart(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const data = await this.getCartUseCase.execute(userId);
    res.status(200).json({
      success: true,
      data,
      message: "Cart fetched successfully"
    });
  }

  async updateCartItem(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const { bookId, quantity } = req.body;
    
    await this.updateCartItemUseCase.execute(userId, bookId, quantity);
    res.status(200).json({
      success: true,
      data: { success: true },
      message: "Cart updated successfully"
    });
  }

  async removeCartItem(req: Request, res: Response): Promise<void> {
    const { userId, bookId } = req.params;
    await this.removeCartItemUseCase.execute(userId, bookId);
    res.status(200).json({
      success: true,
      data: { success: true },
      message: "Cart item removed successfully"
    });
  }

  async mergeCart(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const { items } = req.body;
    await this.mergeGuestCartUseCase.execute(userId, items);
    res.status(200).json({
      success: true,
      message: "Cart merged successfully"
    });
  }

  async validateCartStock(req: Request, res: Response): Promise<void> {
    const { items } = req.body;
    const result = await this.validateCartStockUseCase.execute(items);
    res.status(200).json({
      success: true,
      data: result,
      message: "Cart validated successfully"
    });
  }

  async clearCart(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    await this.clearCartUseCase.execute(userId);
    res.status(200).json({
      success: true,
      message: "Cart cleared successfully"
    });
  }
}