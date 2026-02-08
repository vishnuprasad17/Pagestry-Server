import mongoose from "mongoose";
import { Order } from "../../../../domain/entities/Order.js";
import { DeliveryDetails } from "../../../../domain/value-objects/DeliveryDetails.js";
import { OrderItem } from "../../../../domain/value-objects/OrderItem.js";
import { PaymentDetails } from "../../../../domain/value-objects/PaymentDetails.js";
import { ShippingAddress } from "../../../../domain/value-objects/ShippingAddress.js";

export class OrderMapper {
  static toDomain(document: any): Order {
    const shippingAddress = new ShippingAddress(
      document.shippingAddress.fullName,
      document.shippingAddress.phone,
      document.shippingAddress.addressLine1,
      document.shippingAddress.city,
      document.shippingAddress.state,
      document.shippingAddress.country,
      document.shippingAddress.zipCode,
      document.shippingAddress.addressLine2,
      document.shippingAddress.landmark
    );

    const items = document.items.map((item: any) =>
      new OrderItem(
        item.bookId.toString(),
        item.quantity,
        item.unitPrice,
        item.title,
        item.category,
        item.coverImage
      )
    );

    const paymentDetails = new PaymentDetails(
      document.paymentDetails.method,
      document.paymentDetails.status,
      document.paymentDetails.amount,
      document.paymentDetails.currency,
      document.paymentDetails.razorpayOrderId,
      document.paymentDetails.razorpayPaymentId,
      document.paymentDetails.razorpaySignature,
      document.paymentDetails.paidAt,
      document.paymentDetails.failureReason
    );

    let deliveryDetails: DeliveryDetails | null = null;
    if (document.deliveryDetails) {
      deliveryDetails = new DeliveryDetails(
        document.deliveryDetails.partner,
        document.deliveryDetails.trackingId,
        document.deliveryDetails.estimatedDeliveryDate,
        document.deliveryDetails.deliveredAt
      );
    }

    return new Order(
      document._id.toString(),
      document.orderId,
      document.userId.toString(),
      document.email,
      shippingAddress,
      items,
      document.subtotal,
      document.deliveryCharge,
      document.totalPrice,
      document.status,
      paymentDetails,
      document.idempotencyKey,
      deliveryDetails,
      document.cancellationReason,
      document.cancelledAt,
      document.createdAt,
      document.updatedAt
    );
  }

  static toPersistence(order: Order): any {
    const paymentDetails = order.getPaymentDetails();
    const deliveryDetails = order.getDeliveryDetails();
    const cancellationInfo = order.getCancellationInfo();
    const shippingAddress = order.getShippingAddress();
    const idempotencyKey = order.getIdempotencyKey();

    const persistenceData: any = {
      orderId: order.orderId,
      userId: new mongoose.Types.ObjectId(order.userId),
      email: order.email,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2,
        landmark: shippingAddress.landmark,
        city: shippingAddress.city,
        state: shippingAddress.state,
        country: shippingAddress.country,
        zipCode: shippingAddress.zipCode
      },
      items: order.getItems().map(item => ({
        bookId: new mongoose.Types.ObjectId(item.bookId),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        title: item.title,
        category: item.category,
        coverImage: item.coverImage
      })),
      subtotal: order.getSubtotal(),
      deliveryCharge: order.getDeliveryCharge(),
      totalPrice: order.getTotalPrice(),
      status: order.getStatus(),
      paymentDetails: {
        method: paymentDetails.method,
        status: paymentDetails.status,
        razorpayOrderId: paymentDetails.razorpayOrderId,
        razorpayPaymentId: paymentDetails.razorpayPaymentId,
        razorpaySignature: paymentDetails.razorpaySignature,
        paidAt: paymentDetails.paidAt,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        failureReason: paymentDetails.failureReason
      },
      idempotencyKey: idempotencyKey,
      cancellationReason: cancellationInfo.reason,
      cancelledAt: cancellationInfo.cancelledAt
    };

    if (deliveryDetails && deliveryDetails.partner && deliveryDetails.trackingId) {
      persistenceData.deliveryDetails = {
        partner: deliveryDetails.partner,
        trackingId: deliveryDetails.trackingId,
        estimatedDeliveryDate: deliveryDetails.estimatedDeliveryDate,
        deliveredAt: deliveryDetails.deliveredAt
      };
    } else {
      persistenceData.deliveryDetails = null;
    }

    return persistenceData;
  }
}