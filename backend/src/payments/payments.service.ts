import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';

import { OrdersService } from '../orders/orders.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private ordersService: OrdersService,
  ) {}

  async createPaymentRequest(createPaymentDto: CreatePaymentDto) {
    try {
      const {
        amount,
        callback_url,
        student_info,
        trustee_id,
      } = createPaymentDto;

      // Fixed school_id as per requirements
      const school_id = this.configService.get<string>('SCHOOL_ID');
      const pgKey = this.configService.get<string>('PG_KEY');
      const apiKey = this.configService.get<string>('API_KEY');

      // Create Order in database
      const orderData = {
        school_id,
        trustee_id,
        student_info,
        gateway_name: 'Cashfree',
      };

      const order = await this.ordersService.createOrder(orderData);
      this.logger.log(`Order created with ID: ${order._id}`);

      // Generate JWT sign
      const signPayload = {
        school_id,
        amount,
        callback_url,
      };

      const sign = jwt.sign(signPayload, pgKey, { algorithm: 'HS256' });
      this.logger.log(`JWT sign generated for payment request`);

      // Prepare external API payload
      const externalApiPayload = {
        school_id,
        amount,
        callback_url,
        sign,
      };

      // Call external payment API
      const apiUrl = 'https://dev-vanilla.edviron.com/erp/create-collect-request';
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      };

      this.logger.log(`Calling external payment API: ${apiUrl}`);
      
      const response = await firstValueFrom(
        this.httpService.post(apiUrl, externalApiPayload, { headers })
      );

      if (!response.data) {
        throw new InternalServerErrorException('Invalid response from payment gateway');
      }

      // Create OrderStatus with pending status
      const orderStatusData = {
        collect_id: order._id,
        order_amount: parseFloat(amount),
        transaction_amount: 0, // Will be updated via webhook
        status: 'pending',
      };

      await this.ordersService.createOrderStatus(orderStatusData);
      this.logger.log(`OrderStatus created for order: ${order._id}`);

      // Return response with required fields
      const result = {
        collect_request_id: response.data.collect_request_id || order._id.toString(),
        Collect_request_url: response.data.Collect_request_url || response.data.collect_request_url,
        sign,
        order_id: order._id,
        message: 'Payment request created successfully. Redirect to the provided URL to complete payment.',
      };

      this.logger.log(`Payment request completed successfully`);
      return result;

    } catch (error) {
      this.logger.error(`Payment request failed: ${error.message}`);
      
      if (error.response) {
        this.logger.error(`External API error: ${JSON.stringify(error.response.data)}`);
        throw new BadRequestException(`Payment gateway error: ${error.response.data.message || 'Unknown error'}`);
      }
      
      throw error;
    }
  }

  async verifyPaymentStatus(collectRequestId: string, schoolId: string) {
    try {
      const pgKey = this.configService.get<string>('PG_KEY');
      const apiKey = this.configService.get<string>('API_KEY');

      // Generate sign for verification
      const signPayload = {
        school_id: schoolId,
        collect_request_id: collectRequestId,
      };

      const sign = jwt.sign(signPayload, pgKey, { algorithm: 'HS256' });

      // Call external status check API
      const apiUrl = `https://dev-vanilla.edviron.com/erp/collect-request/${collectRequestId}`;
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
      };

      const params = {
        school_id: schoolId,
        sign,
      };

      this.logger.log(`Checking payment status for: ${collectRequestId}`);
      
      const response = await firstValueFrom(
        this.httpService.get(apiUrl, { headers, params })
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Payment status check failed: ${error.message}`);
      throw error;
    }
  }
}