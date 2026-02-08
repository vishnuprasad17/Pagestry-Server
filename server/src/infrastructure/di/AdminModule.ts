import { IAuditLogRepository } from "../../application/ports/IAuditLogRepository.js";
import { IBookRepository } from "../../application/ports/IBookRepository.js";
import { ICloudinaryService } from "../../application/ports/ICloudinaryService.js";
import { IEmailService } from "../../application/ports/IEmailService.js";
import { IFirebaseAdminService } from "../../application/ports/IFirebaseAdminService.js";
import { IOrderRepository } from "../../application/ports/IOrderRepository.js";
import { IPaymentService } from "../../application/ports/IPaymentService.js";
import { IAdminUnitOfWork } from "../../application/ports/IUnitOfWork.js";
import { IUserRepository } from "../../application/ports/IUserRepository.js";
import { BlockUserUseCase } from "../../application/use-cases/BlockUserUseCase.js";
import { ExportOrdersToCSVUseCase } from "../../application/use-cases/ExportOrdersToCSVUseCase.js";
import { GetAdminStatsUseCase } from "../../application/use-cases/GetAdminStatsUseCase.js";
import { GetAuditLogsUseCase } from "../../application/use-cases/GetAuditLogsUseCase.js";
import { GetCloudinarySignatureUseCase } from "../../application/use-cases/GetCloudinarySignatureUseCase.js";
import { GetDailyReportUseCase } from "../../application/use-cases/GetDailyReportUseCase.js";
import { GetMonthlyRevenueUseCase } from "../../application/use-cases/GetMonthlyRevenueUseCase.js";
import { GetRevenueAnalyticsUseCase } from "../../application/use-cases/GetRevenueAnalyticsUseCase.js";
import { GetYearlyRevenueUseCase } from "../../application/use-cases/GetYearlyRevenueUseCase.js";
import { ProcessRefundUseCase } from "../../application/use-cases/ProcessRefundUseCase.js";
import { SendPasswordResetLinkUseCase } from "../../application/use-cases/SendPasswordResetLinkUseCase.js";
import { UnblockUserUseCase } from "../../application/use-cases/UnblockUserUseCase.js";
import { UpdateDeliveryDetailsUseCase } from "../../application/use-cases/UpdateDeliveryDetailsUseCase.js";
import { UpdateOrderStatusUseCase } from "../../application/use-cases/UpdateOrderStatusUseCase.js";
import { AdminController } from "../../interface-adapters/controllers/AdminController.js";
import { RazorpayPaymentService } from "../services/RazorpayPaymentService.js";
import { AuditLogModel } from "../persistence/mongoose/models/AuditLogModel.js";
import { BookModel } from "../persistence/mongoose/models/BookModel.js";
import { OrderModel } from "../persistence/mongoose/models/OrderModel.js";
import { UserModel } from "../persistence/mongoose/models/UserModel.js";
import { MongoAdminUnitOfWork } from "../persistence/mongoose/MongoAdminUnitOfWork.js";
import { MongoAuditLogRepository } from "../persistence/mongoose/repositories/MongoAuditLogRepository.js";
import { MongoBookRepository } from "../persistence/mongoose/repositories/MongoBookRepository.js";
import { MongoOrderRepository } from "../persistence/mongoose/repositories/MongoOrderRepository.js";
import { MongoUserRepository } from "../persistence/mongoose/repositories/MongoUserRepository.js";
import { FirebaseAdminService } from "../services/FirebaseAdminService.js";
import { CloudinaryService } from "../services/CloudinaryService.js";
import { EmailService } from "../services/EmailService.js";

// infrastructure/di/AdminModule.ts
export class AdminModule {
  private static orderRepository: IOrderRepository;
  private static userRepository: IUserRepository;
  private static bookRepository: IBookRepository;
  private static auditLogRepository: IAuditLogRepository;
  private static firebaseAdminService: IFirebaseAdminService;
  private static paymentService: IPaymentService;
  private static emailService: IEmailService;
  private static cloudinaryService: ICloudinaryService;
  private static unitOfWork: IAdminUnitOfWork;

  static getOrderRepository(): IOrderRepository {
    if (!this.orderRepository) {
      this.orderRepository = new MongoOrderRepository(OrderModel);
    }
    return this.orderRepository;
  }

  static getUserRepository(): IUserRepository {
    if (!this.userRepository) {
      this.userRepository = new MongoUserRepository(UserModel);
    }
    return this.userRepository;
  }

  static getBookRepository(): IBookRepository {
    if (!this.bookRepository) {
      this.bookRepository = new MongoBookRepository(BookModel);
    }
    return this.bookRepository;
  }

  static getAuditLogRepository(): IAuditLogRepository {
    if (!this.auditLogRepository) {
      this.auditLogRepository = new MongoAuditLogRepository(AuditLogModel);
    }
    return this.auditLogRepository;
  }

  static getFirebaseAdminService(): IFirebaseAdminService {
    if (!this.firebaseAdminService) {
      this.firebaseAdminService = new FirebaseAdminService();
    }
    return this.firebaseAdminService;
  }

  static getPaymentService(): IPaymentService {
    if (!this.paymentService) {
      this.paymentService = new RazorpayPaymentService();
    }
    return this.paymentService;
  }

  static getEmailService(): IEmailService {
    if (!this.emailService) {
      this.emailService = new EmailService();
    }
    return this.emailService;
  }

  static getCloudinaryService(): ICloudinaryService {
    if (!this.cloudinaryService) {
      this.cloudinaryService = new CloudinaryService();
    }
    return this.cloudinaryService;
  }

  static getUnitOfWork(): IAdminUnitOfWork {
    return new MongoAdminUnitOfWork();
  }

  static getGetAdminStatsUseCase(): GetAdminStatsUseCase {
    return new GetAdminStatsUseCase(
      this.getOrderRepository(),
      this.getBookRepository()
    );
  }

  static getGetRevenueAnalyticsUseCase(): GetRevenueAnalyticsUseCase {
    return new GetRevenueAnalyticsUseCase(this.getOrderRepository());
  }

  static getGetDailyReportUseCase(): GetDailyReportUseCase {
    return new GetDailyReportUseCase(this.getOrderRepository());
  }

  static getGetMonthlyRevenueUseCase(): GetMonthlyRevenueUseCase {
    return new GetMonthlyRevenueUseCase(this.getOrderRepository());
  }

  static getGetYearlyRevenueUseCase(): GetYearlyRevenueUseCase {
    return new GetYearlyRevenueUseCase(this.getOrderRepository());
  }

  static getBlockUserUseCase(): BlockUserUseCase {
    return new BlockUserUseCase(
      this.getUserRepository(),
      this.getAuditLogRepository(),
      this.getFirebaseAdminService()
    );
  }

  static getUnblockUserUseCase(): UnblockUserUseCase {
    return new UnblockUserUseCase(
      this.getUserRepository(),
      this.getAuditLogRepository(),
      this.getFirebaseAdminService()
    );
  }

  static getGetAuditLogsUseCase(): GetAuditLogsUseCase {
    return new GetAuditLogsUseCase(this.getAuditLogRepository());
  }

  static getSendPasswordResetLinkUseCase(): SendPasswordResetLinkUseCase {
    return new SendPasswordResetLinkUseCase(
      this.getFirebaseAdminService(),
      this.getEmailService()
    );
  }

  static getUpdateOrderStatusUseCase(): UpdateOrderStatusUseCase {
    return new UpdateOrderStatusUseCase(this.getUnitOfWork());
  }

  static getUpdateDeliveryDetailsUseCase(): UpdateDeliveryDetailsUseCase {
    return new UpdateDeliveryDetailsUseCase(this.getOrderRepository());
  }

  static getProcessRefundUseCase(): ProcessRefundUseCase {
    return new ProcessRefundUseCase(
      this.getUnitOfWork(),
      this.getPaymentService()
    );
  }

  static getExportOrdersToCSVUseCase(): ExportOrdersToCSVUseCase {
    return new ExportOrdersToCSVUseCase(this.getOrderRepository());
  }

  static getGetCloudinarySignatureUseCase(): GetCloudinarySignatureUseCase {
    return new GetCloudinarySignatureUseCase(this.getCloudinaryService());
  }

  static getAdminController(): AdminController {
    return new AdminController(
      this.getGetAdminStatsUseCase(),
      this.getGetRevenueAnalyticsUseCase(),
      this.getGetDailyReportUseCase(),
      this.getGetMonthlyRevenueUseCase(),
      this.getGetYearlyRevenueUseCase(),
      this.getBlockUserUseCase(),
      this.getUnblockUserUseCase(),
      this.getGetAuditLogsUseCase(),
      this.getSendPasswordResetLinkUseCase(),
      this.getUpdateOrderStatusUseCase(),
      this.getUpdateDeliveryDetailsUseCase(),
      this.getProcessRefundUseCase(),
      this.getExportOrdersToCSVUseCase(),
      this.getGetCloudinarySignatureUseCase()
    );
  }
}