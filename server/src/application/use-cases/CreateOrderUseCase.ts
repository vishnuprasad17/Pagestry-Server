import { Order } from "../../domain/entities/Order.js";
import { OrderNotFoundError } from "../../domain/errors/OrderErrors.js";
import { OrderItem } from "../../domain/value-objects/OrderItem.js";
import { PaymentDetails } from "../../domain/value-objects/PaymentDetails.js";
import { CreateOrderDto, CreateOrderResult } from "../dto/OrderDto.js";
import { IAddressRepository } from "../ports/IAddressRepository.js";
import { IPaymentService } from "../ports/IPaymentService.js";
import { IOrderUnitOfWork } from "../ports/IUnitOfWork.js";

export class CreateOrderUseCase {
  constructor(
    private readonly unitOfWork: IOrderUnitOfWork,
    private readonly addressRepository: IAddressRepository,
    private readonly paymentService: IPaymentService
  ) {}

  async execute(dto: CreateOrderDto): Promise<CreateOrderResult> {
    // Check for duplicate order
    const orderRepo = this.unitOfWork.getOrderRepository();
    const existingOrder = await orderRepo.findByIdempotencyKey(dto.idempotencyKey);
    
    if (existingOrder) {
      // If Razorpay order exists, return it for retry
      const paymentDetails = existingOrder.getPaymentDetails();
      if (paymentDetails.method === "RAZORPAY" && paymentDetails.razorpayOrderId) {
        return {
          success: true,
          order: existingOrder,
          razorpayOrderId: paymentDetails.razorpayOrderId,
          message: "Order already exists"
        };
      }
      return { success: true, order: existingOrder, message: "Order already exists" };
    }

    await this.unitOfWork.begin();

    try {
      const bookRepo = this.unitOfWork.getBookRepository();
      const orderId = this.generateOrderId();

      // 1. Validate stock and get book details
      const outOfStockIds: string[] = [];
      const bookDetails: { id: string; title: string; category: string; coverImage: string }[] = [];

      for (const item of dto.items) {
        const book = await bookRepo.getBookDetails(item.bookId);
        if (!book || book.stock < item.quantity) {
          outOfStockIds.push(item.bookId);
        } else {
          bookDetails.push({ id: item.bookId, title: book.title, category: book.category, coverImage: book.coverImage });
        }
      }

      if (outOfStockIds.length > 0) {
        await this.unitOfWork.rollback();
        return {
          success: false,
          outOfStockIds,
          message: "Some items are out of stock"
        };
      }

      // 2. For Razorpay, create payment order first
      let razorpayOrderId: string | undefined;
      if (dto.paymentMethod === "RAZORPAY") {
        const razorpayOrder = await this.paymentService.createRazorpayOrder({
          amount: dto.totalPrice,
          currency: "INR",
          receipt: orderId,
          notes: { orderId, userId: dto.userId, email: dto.email }
        });

        if (!razorpayOrder.success) {
          await this.unitOfWork.rollback();
          return {
            success: false,
            message: "Failed to initialize payment"
          };
        }

        razorpayOrderId = razorpayOrder.orderId;
      }

      // 3. Get address details
      const shippingAddress = await this.addressRepository.findShippingAddressById(dto.addressId);
      if (!shippingAddress) {
        await this.unitOfWork.rollback();
        return { success: false, message: "Invalid address" };
      }

      // 4. Create order items
      const orderItems = dto.items.map((item, idx) => 
        new OrderItem(
          item.bookId,
          item.quantity,
          item.unitPrice,
          bookDetails[idx].title,
          bookDetails[idx].category,
          bookDetails[idx].coverImage
        )
      );

      // 5. Create payment details
      const paymentDetails = new PaymentDetails(
        dto.paymentMethod,
        "PENDING",
        dto.totalPrice,
        "INR",
        razorpayOrderId
      );

      // 6. Create order
      const newOrder = new Order(
        '',
        orderId,
        dto.userId,
        dto.email,
        shippingAddress,
        orderItems,
        dto.subtotal,
        dto.deliveryCharge,
        dto.totalPrice,
        "PENDING",
        paymentDetails,
        dto.idempotencyKey,
        null,
        undefined,
        undefined
      );

      // 7. For COD, reduce stock immediately and place order
      if (dto.paymentMethod === "COD") {
        for (const item of dto.items) {
          await bookRepo.reduceStock(item.bookId, item.quantity);
        }
        
        newOrder.updateStatus("PLACED");
        const cartRepo = this.unitOfWork.getCartRepository();
        await cartRepo.clearCart(dto.userId);
      }

      await orderRepo.save(newOrder);
      const order = await orderRepo.findByOrderId(orderId);

      if (!order) {
        throw new OrderNotFoundError(orderId);
      }
      
      await this.unitOfWork.commit();

      return {
        success: true,
        order,
        razorpayOrderId,
        message: dto.paymentMethod === "COD" ? "Order placed successfully" : "Payment initiated"
      };
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  }
}