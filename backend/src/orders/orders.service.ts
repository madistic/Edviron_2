import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Order, OrderDocument } from '../database/schemas/order.schema';
import { OrderStatus, OrderStatusDocument } from '../database/schemas/order-status.schema';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  async getTransactions(paginationDto: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      status,
      school_id,
      gateway,
    } = paginationDto;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    // Build match conditions
    const matchConditions: any = {};
    
    if (status) {
      matchConditions['orderStatus.status'] = status;
    }
    
    if (school_id) {
      matchConditions['school_id'] = school_id;
    }
    
    if (gateway) {
      matchConditions['gateway_name'] = gateway;
    }

    // Aggregation pipeline
    const pipeline = [
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'orderStatus',
        },
      },
      {
        $unwind: {
          path: '$orderStatus',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: Object.keys(matchConditions).length > 0 ? matchConditions : {},
      },
      {
        $sort: { [sort === 'payment_time' ? 'orderStatus.payment_time' : sort]: sortOrder },
      },
      {
        $project: {
          collect_id: '$_id',
          school_id: 1,
          gateway: '$gateway_name',
          order_amount: '$orderStatus.order_amount',
          transaction_amount: '$orderStatus.transaction_amount',
          status: '$orderStatus.status',
          custom_order_id: '$_id',
          payment_time: '$orderStatus.payment_time',
          payment_mode: '$orderStatus.payment_mode',
          student_info: 1,
          trustee_id: 1,
          createdAt: 1,
        },
      },
    ];

    const countPipeline = [...pipeline, { $count: 'total' }];
    const dataPipeline = [...pipeline, { $skip: skip }, { $limit: limit }];

    const [countResult, data] = await Promise.all([
      this.orderModel.aggregate(countPipeline),
      this.orderModel.aggregate(dataPipeline),
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getSchoolTransactions(schoolId: string, paginationDto: PaginationDto) {
    return this.getTransactions({
      ...paginationDto,
      school_id: schoolId,
    });
  }

  async getTransactionStatus(customOrderId: string) {
    try {
      const objectId = new Types.ObjectId(customOrderId);
      
      const result = await this.orderModel.aggregate([
        {
          $match: { _id: objectId },
        },
        {
          $lookup: {
            from: 'orderstatuses',
            localField: '_id',
            foreignField: 'collect_id',
            as: 'orderStatus',
          },
        },
        {
          $unwind: {
            path: '$orderStatus',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            collect_id: '$_id',
            school_id: 1,
            gateway: '$gateway_name',
            order_amount: '$orderStatus.order_amount',
            transaction_amount: '$orderStatus.transaction_amount',
            status: '$orderStatus.status',
            payment_mode: '$orderStatus.payment_mode',
            payment_details: '$orderStatus.payment_details',
            bank_reference: '$orderStatus.bank_reference',
            payment_message: '$orderStatus.payment_message',
            error_message: '$orderStatus.error_message',
            payment_time: '$orderStatus.payment_time',
            student_info: 1,
          },
        },
      ]);

      return result[0] || null;
    } catch (error) {
      this.logger.error(`Error getting transaction status: ${error.message}`);
      return null;
    }
  }

  async createOrder(orderData: any) {
    const order = new this.orderModel(orderData);
    return order.save();
  }

  async createOrderStatus(statusData: any) {
    const orderStatus = new this.orderStatusModel(statusData);
    return orderStatus.save();
  }

  async updateOrderStatus(collectId: string, updateData: any) {
    return this.orderStatusModel.findOneAndUpdate(
      { collect_id: new Types.ObjectId(collectId) },
      updateData,
      { new: true }
    );
  }

  async findOrderStatusByCollectId(collectId: string) {
    return this.orderStatusModel.findOne({ 
      collect_id: new Types.ObjectId(collectId) 
    });
  }
}