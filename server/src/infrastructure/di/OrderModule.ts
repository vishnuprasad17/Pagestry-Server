import { IAddressRepository } from "../../application/ports/IAddressRepository.js";
import { IOrderRepository } from "../../application/ports/IOrderRepository.js";
import { IPaymentService } from "../../application/ports/IPaymentService.js";
import { IOrderUnitOfWork } from "../../application/ports/IUnitOfWork.js";
import { CancelOrderUseCase } from "../../application/use-cases/CancelOrderUseCase.js";
import { CreateOrderUseCase } from "../../application/use-cases/CreateOrderUseCase.js";
import { GetFilteredOrdersUseCase } from "../../application/use-cases/GetFilteredOrdersUseCase.js";
import { GetOrderByIdUseCase } from "../../application/use-cases/GetOrderByIdUseCase.js";
import { GetOrdersUseCase } from "../../application/use-cases/GetOrdersUseCase.js";
import { HandleWebhookUseCase } from "../../application/use-cases/HandleWebhookUseCase.js";
import { VerifyPaymentUseCase } from "../../application/use-cases/VerifyPaymentUseCase.js";
import { OrderController } from "../../interface-adapters/controllers/OrderController.js";
import { RazorpayPaymentService } from "../services/RazorpayPaymentService.js";
import { AddressModel } from "../persistence/mongoose/models/AddressModel.js";
import { OrderModel } from "../persistence/mongoose/models/OrderModel.js";
import { MongoOrderUnitOfWork } from "../persistence/mongoose/MongoOrderUnitOfWork.js";
import { MongoAddressRepository } from "../persistence/mongoose/repositories/MongoAddressRepository.js";
import { MongoOrderRepository } from "../persistence/mongoose/repositories/MongoOrderRepository.js";

export class OrderModule {
  private static orderRepository: IOrderRepository;
  private static addressRepository: IAddressRepository;
  private static paymentService: IPaymentService;
  private static unitOfWork: IOrderUnitOfWork;

  static getOrderRepository(): IOrderRepository {
    if (!this.orderRepository) {
      this.orderRepository = new MongoOrderRepository(OrderModel);
    }
    return this.orderRepository;
  }

  static getAddressRepository(): IAddressRepository {
    if (!this.addressRepository) {
      this.addressRepository = new MongoAddressRepository(AddressModel);
    }
    return this.addressRepository;
  }

  static getPaymentService(): IPaymentService {
    if (!this.paymentService) {
      this.paymentService = new RazorpayPaymentService();
    }
    return this.paymentService;
  }

  static getUnitOfWork(): IOrderUnitOfWork {
    return new MongoOrderUnitOfWork();
  }

  static getCreateOrderUseCase(): CreateOrderUseCase {
    return new CreateOrderUseCase(
      this.getUnitOfWork(),
      this.getAddressRepository(),
      this.getPaymentService()
    );
  }

  static getVerifyPaymentUseCase(): VerifyPaymentUseCase {
    return new VerifyPaymentUseCase(
      this.getUnitOfWork(),
      this.getPaymentService()
    );
  }

  static getGetOrdersUseCase(): GetOrdersUseCase {
    return new GetOrdersUseCase(this.getOrderRepository());
  }

  static getGetFilteredOrdersUseCase(): GetFilteredOrdersUseCase {
    return new GetFilteredOrdersUseCase(this.getOrderRepository());
  }

  static getGetOrderByIdUseCase(): GetOrderByIdUseCase {
    return new GetOrderByIdUseCase(this.getOrderRepository());
  }

  static getCancelOrderUseCase(): CancelOrderUseCase {
    return new CancelOrderUseCase(
      this.getUnitOfWork(),
      this.getPaymentService()
    );
  }

  static getHandleWebhookUseCase(): HandleWebhookUseCase {
    return new HandleWebhookUseCase(
      this.getOrderRepository(),
      this.getPaymentService()
    );
  }

  static getOrderController(): OrderController {
    return new OrderController(
      this.getCreateOrderUseCase(),
      this.getVerifyPaymentUseCase(),
      this.getGetOrdersUseCase(),
      this.getGetFilteredOrdersUseCase(),
      this.getGetOrderByIdUseCase(),
      this.getCancelOrderUseCase(),
      this.getHandleWebhookUseCase()
    );
  }
}