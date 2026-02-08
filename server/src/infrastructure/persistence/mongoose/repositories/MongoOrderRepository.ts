import mongoose, { PipelineStage } from "mongoose";
import { IOrderRepository } from "../../../../application/ports/IOrderRepository.js";
import { TrendingBook } from "../../../../domain/entities/TrendingBook.js";
import { OrderModel } from "../models/OrderModel.js";
import { Order } from "../../../../domain/entities/Order.js";
import { OrderMapper } from "../mappers/OrderMapper.js";
import { OrderFilters, OrderStatus } from "../../../../domain/value-objects/OrderFilters.js";
import { DeliveryDetails } from "../../../../domain/value-objects/DeliveryDetails.js";
import { AnalyticsDto, DailyBreakdownDto, DailyReport, MonthySales, OrderStatsDto, topCustomerDto, YearlySales } from "../../../../application/dto/AdminDto.js";

export class MongoOrderRepository implements IOrderRepository {
  constructor(
    private readonly model: typeof OrderModel,
    private readonly session?: mongoose.ClientSession
  ) {}

  async findById(id: string): Promise<Order | null> {
    const query = this.model.findById(id);
    if (this.session) query.session(this.session);
    
    const document = await query.exec();
    return document ? OrderMapper.toDomain(document) : null;
  }

  async findByOrderId(orderId: string): Promise<Order | null> {
    const query = this.model.findOne({ orderId });
    if (this.session) query.session(this.session);
    
    const document = await query.exec();
    return document ? OrderMapper.toDomain(document) : null;
  }

  async findByIdempotencyKey(key: string): Promise<Order | null> {
    const document = await this.model.findOne({ idempotencyKey: key }).exec();
    return document ? OrderMapper.toDomain(document) : null;
  }

  async findByRazorpayOrderId(razorpayOrderId: string): Promise<Order | null> {
    const document = await this.model.findOne({ 
      "paymentDetails.razorpayOrderId": razorpayOrderId 
    }).exec();
    return document ? OrderMapper.toDomain(document) : null;
  }

  async findByRazorpayPaymentId(razorpayPaymentId: string): Promise<Order | null> {
    const document = await this.model.findOne({ 
      "paymentDetails.razorpayPaymentId": razorpayPaymentId 
    }).exec();
    return document ? OrderMapper.toDomain(document) : null;
  }

  async findByEmail(email: string, skip: number, limit: number): Promise<Order[]> {
    const documents = await this.model
      .find({ email })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    
    return documents.map(doc => OrderMapper.toDomain(doc));
  }

  async findFiltered(filters: OrderFilters): Promise<{ orders: Order[], total: number }> {
    const basePipeline: any[] = [];

    if (filters.status) basePipeline.push({ $match: { status: filters.status } });
    if (filters.paymentStatus) basePipeline.push({ $match: { "paymentDetails.status": filters.paymentStatus } });
    if (filters.paymentMethod) basePipeline.push({ $match: { "paymentDetails.method": filters.paymentMethod } });
    if (filters.startDate) basePipeline.push({ $match: { createdAt: { $gte: filters.startDate } } });
    if (filters.endDate) basePipeline.push({ $match: { createdAt: { $lte: filters.endDate } } });

    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      basePipeline.push({
        $match: {
          $or: [
            { orderId: { $regex: filters.searchQuery, $options: "i" } },
            { email: { $regex: filters.searchQuery, $options: "i" } },
            { "shippingAddress.fullName": { $regex: filters.searchQuery, $options: "i" } },
            { "shippingAddress.phone": { $regex: filters.searchQuery, $options: "i" } }
          ]
        }
      });
    }

    const ordersPipeline = [
      ...basePipeline,
      { $sort: { createdAt: -1 } },
      { $skip: filters.getSkip() },
      { $limit: filters.limit }
    ];

    const countPipeline = [...basePipeline, { $count: "total" }];

    const [orders, totalResult] = await Promise.all([
      this.model.aggregate(ordersPipeline),
      this.model.aggregate(countPipeline)
    ]);

    const total = totalResult[0]?.total || 0;

    return {
      orders: orders.map(doc => OrderMapper.toDomain(doc)),
      total
    };
  }

  async save(order: Order): Promise<Order> {
    const persistenceData = OrderMapper.toPersistence(order);
    const options = this.session ? { session: this.session } : {};

    if (order.id) {
      await this.model.findByIdAndUpdate(
        order.id,
        { $set: persistenceData },
        { new: true, ...options }
      );
      return order;
    } else {
      const [newDoc] = await this.model.create([persistenceData], options);

      return OrderMapper.toDomain(newDoc);
    }
  }

  async countByEmail(email: string): Promise<number> {
    return await this.model.countDocuments({ email });
  }

  async getTrendingBooks(daysBack: number, limit: number): Promise<TrendingBook[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    const now = new Date();

    const pipeline: PipelineStage[] = [
      {
        $match: {
          createdAt: { $gte: cutoffDate },
          "paymentDetails.status": "SUCCESS",
          status: { $in: ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"] }
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.bookId",
          totalQuantity: { $sum: "$items.quantity" },
          totalOrders: { $sum: 1 },
          recentOrders: {
            $sum: {
              $cond: [
                { $gte: ["$createdAt", new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails"
        }
      },
      { $unwind: "$bookDetails" },
      {
        $addFields: {
          trendingScore: {
            $add: [
              { $multiply: ["$totalQuantity", 2] },
              { $multiply: ["$recentOrders", 5] },
              { $multiply: ["$bookDetails.averageRating", 0.5] }
            ]
          }
        }
      },
      { $sort: { trendingScore: -1 } },
      { $limit: limit }
    ];

    const results = await this.model.aggregate(pipeline);

    return results.map((result, index) => new TrendingBook(
      result._id.toString(),
      result.bookDetails.title,
      result.bookDetails.coverImage,
      index + 1,
      result.totalQuantity,
      result.totalOrders,
      result.recentOrders,
      result.trendingScore
    ));
  }

   async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    const options = this.session ? { session: this.session } : {};
    await this.model.findOneAndUpdate(
      { orderId },
      { $set: { status } },
      { new: true, ...options }
    );
  }

  async updatePaymentStatus(orderId: string, status: string, additionalData?: any): Promise<void> {
    const updateData: any = { "paymentDetails.status": status };
    
    if (additionalData) {
      if (additionalData.razorpayPaymentId) {
        updateData["paymentDetails.razorpayPaymentId"] = additionalData.razorpayPaymentId;
      }
      if (additionalData.razorpaySignature) {
        updateData["paymentDetails.razorpaySignature"] = additionalData.razorpaySignature;
      }
      if (additionalData.paidAt) {
        updateData["paymentDetails.paidAt"] = additionalData.paidAt;
      }
      if (additionalData.failureReason) {
        updateData["paymentDetails.failureReason"] = additionalData.failureReason;
      }
    }

    const options = this.session ? { session: this.session } : {};
    await this.model.findOneAndUpdate({ orderId }, updateData, { new: true, ...options });
  }

  async updateDeliveryDetails(orderId: string, details: DeliveryDetails): Promise<void> {
    await this.model.findOneAndUpdate(
      { orderId },
      {
        $set: {
          deliveryDetails: {
            partner: details.partner,
            trackingId: details.trackingId,
            estimatedDeliveryDate: details.estimatedDeliveryDate,
            deliveredAt: details.deliveredAt
          }
        }
      }
    );
  }

  async updateCancellation(orderId: string, reason: string, cancelledAt: Date): Promise<void> {
    const options = this.session ? { session: this.session } : {};
    await this.model.findByIdAndUpdate(
      orderId,
      {
        $set: {
          cancellationReason: reason,
          cancelledAt
        }
      },
      { new: true, ...options }
    );
  }

  async getOrderStats(): Promise<OrderStatsDto> {
    const stats = await this.model.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [
                { $eq: ["$paymentDetails.status", "SUCCESS"] },
                "$totalPrice",
                0
              ]
            }
          },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] }
          },
          placedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "PLACED"] }, 1, 0] }
          },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "CONFIRMED"] }, 1, 0] }
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "SHIPPED"] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$status", "DELIVERED"] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0] }
          },
          failedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "FAILED"] }, 1, 0] }
          }
        }
      }
    ]);

    return stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      placedOrders: 0,
      confirmedOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      failedOrders: 0
    };
  }

  async getTopCustomers(): Promise<topCustomerDto[]> {
    return await this.model.aggregate([
      {
        $match: { "paymentDetails.status": "SUCCESS" }
      },
      {
        $group: {
          _id: '$userId',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
          avgOrderValue: { $avg: '$totalPrice' },
          lastOrderDate: { $max: "$createdAt" }
        }
      },
      { $sort: { avgOrderValue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$userDetails.name',
          email: '$userDetails.username',
          profileImage: '$userDetails.profileImage',
          totalOrders: 1,
          totalSpent: { $round: ['$totalSpent', 2] },
          avgOrderValue: { $round: ['$avgOrderValue', 1] },
          lastOrderDate: 1
        }
      }
    ]);
  }

  async getRevenueAnalytics(basePipeline: any[]): Promise<AnalyticsDto[]> {
    return await this.model.aggregate([
      ...basePipeline,
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$totalPrice" },
          razorpayRevenue: {
            $sum: {
              $cond: [
                { $eq: ["$paymentDetails.method", "RAZORPAY"] },
                "$totalPrice",
                0
              ]
            }
          },
          codRevenue: {
            $sum: {
              $cond: [
                { $eq: ["$paymentDetails.method", "COD"] },
                "$totalPrice",
                0
              ]
            }
          }
        }
      }
    ]);
  }

  async getDailyBreakdown(basePipeline: any[]): Promise<DailyBreakdownDto[]> {
    return await this.model.aggregate([
      ...basePipeline,
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);
  }

  async getDailyReport(startDate: Date, endDate: Date): Promise<DailyReport[]> {
    return await this.model.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [
                { $eq: ["$paymentDetails.status", "SUCCESS"] },
                "$totalPrice",
                0
              ]
            }
          },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] }
          },
          placedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "PLACED"] }, 1, 0] }
          },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "CONFIRMED"] }, 1, 0] }
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "SHIPPED"] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$status", "DELIVERED"] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0] }
          },
          razorpayOrders: {
            $sum: {
              $cond: [
                { $eq: ["$paymentDetails.method", "RAZORPAY"] },
                1,
                0
              ]
            }
          },
          codOrders: {
            $sum: {
              $cond: [{ $eq: ["$paymentDetails.method", "COD"] }, 1, 0]
            }
          }
        }
      }
    ]);
  }

  async getMonthlySales(startDate: Date, endDate: Date): Promise<MonthySales[]> {
    return await this.model.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
          "paymentDetails.status": "SUCCESS"
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalRevenue: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          totalRevenue: 1,
          orderCount: 1
        }
      },
      { $sort: { month: 1 } }
    ]);
  }

  async getYearlySales(startDate: Date, endDate: Date): Promise<YearlySales> {
    const result = await this.model.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
          "paymentDetails.status": "SUCCESS"
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          orderCount: 1
        }
      }
    ]);

    return result[0] ?? {
      totalRevenue: 0,
      orderCount: 0
    };
  }

  async findOrdersWithPopulate(query: any, skip: number, limit: number): Promise<any[]> {
    return await this.model
      .find(query)
      .populate("userId", "name email")
      .populate("items.bookId", "title coverImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }
}