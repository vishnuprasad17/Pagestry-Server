import mongoose from "mongoose";
import { Cart } from "../../../../domain/entities/Cart.js";
import { CartItem } from "../../../../domain/entities/CartItem.js";

export class CartMapper {
  static toDomain(document: any): Cart {
    const items = document.items.map((item: any) => 
      new CartItem(item.bookId.toString(), item.quantity)
    );
    return new Cart(document.userId.toString(), items);
  }

  static toPersistence(cart: Cart): any {
    return {
      userId: new mongoose.Types.ObjectId(cart.userId),
      items: cart.getItems().map(item => ({
        bookId: new mongoose.Types.ObjectId(item.bookId),
        quantity: item.quantity
      }))
    };
  }
}