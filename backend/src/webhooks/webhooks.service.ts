import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { WebhookLog, WebhookLogDocument } from '../database/schemas/webhook-log.schema';
import { OrdersService } from '../orders/orders.service';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    @InjectModel(WebhookLog.name) private webhookLogModel: Model<WebhookLogDocument>,
    private ordersService: OrdersService,
  ) {}

  async processPaymentWebhook(webhookData: PaymentWebhookDto) {
    let errorMessage = '';

    try {
      const { status, order_info } = webhookData;

      // Extract collect_id from order_id (format: collect_id/transaction_id)
      const collectId = order_info.order_id.split('/')[0];
      
      this.logger.log(`Processing webhook for collect_id: ${collectId}`);

      // Find existing order status
      const existingOrderStatus = await this.ordersService.findOrderStatusByCollectId(collectId);
      
      if (!existingOrderStatus) {
        throw new Error(`OrderStatus not found for collect_id: ${collectId}`);
      }

      // Update order status with webhook data
      const updateData = {
        transaction_amount: order_info.transaction_amount,
        payment_mode: order_info.payment_mode,
        payment_details: order_info.payment_details,
        bank_reference: order_info.bank_reference,
        payment_message: order_info.Payment_message,
        status: order_info.status,
        error_message: order_info.error_message || '',
        payment_time: new Date(order_info.payment_time),
      };

      await this.ordersService.updateOrderStatus(collectId, updateData);
      
      this.logger.log(`OrderStatus updated for collect_id: ${collectId} with status: ${order_info.status}`);

    } catch (error) {
      this.logger.error(`Webhook processing error: ${error.message}`);
      errorMessage = error.message;
    }

    // Always log the webhook
    await this.logWebhook({
      status_code: webhookData.status,
      payload: webhookData,
      error: errorMessage,
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }
  }

  private async logWebhook(logData: {
    status_code: number;
    payload: any;
    error?: string;
  }) {
    try {
      const webhookLog = new this.webhookLogModel({
        timestamp: new Date(),
        status_code: logData.status_code,
        payload: logData.payload,
        error: logData.error || null,
      });

      await webhookLog.save();
      this.logger.log(`Webhook logged with status: ${logData.status_code}`);
    } catch (error) {
      this.logger.error(`Failed to log webhook: ${error.message}`);
    }
  }
}