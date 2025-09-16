import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { OrderStatus, OrderStatusDocument } from './schemas/order-status.schema';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { Logger } from '@nestjs/common';

class SeederService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatusDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async seedUsers() {
    const existingUser = await this.userModel.findOne({ username: 'admin' });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await this.userModel.create({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
      });
      Logger.log('Default admin user created');
    }
  }

  async seedOrders() {
    const ordersCount = await this.orderModel.countDocuments();
    if (ordersCount === 0) {
      const dummyOrders = [];
      const dummyOrderStatuses = [];

      for (let i = 1; i <= 10; i++) {
        const order = await this.orderModel.create({
          school_id: '65b0e6293e9f76a9694d84b4',
          trustee_id: '65b0e552dd31950a9b41c5ba',
          student_info: {
            name: `Student ${i}`,
            id: `STU${i.toString().padStart(3, '0')}`,
            email: `student${i}@example.com`,
          },
          gateway_name: 'Cashfree',
        });

        const statuses = ['success', 'pending', 'failed'];
        const paymentModes = ['UPI', 'Net Banking', 'Credit Card', 'Debit Card'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomPaymentMode = paymentModes[Math.floor(Math.random() * paymentModes.length)];
        const orderAmount = Math.floor(Math.random() * 5000) + 100;

        await this.orderStatusModel.create({
          collect_id: order._id,
          order_amount: orderAmount,
          transaction_amount: randomStatus === 'success' ? orderAmount : 0,
          payment_mode: randomPaymentMode,
          payment_details: `Payment via ${randomPaymentMode}`,
          bank_reference: `BANK_REF_${Date.now()}_${i}`,
          payment_message: randomStatus === 'success' ? 'Payment successful' : 
                          randomStatus === 'pending' ? 'Payment in progress' : 'Payment failed',
          status: randomStatus,
          error_message: randomStatus === 'failed' ? 'Transaction failed due to insufficient funds' : '',
          payment_time: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        });
      }

      Logger.log('Dummy orders and order statuses created');
    }
  }

  async seed() {
    await this.seedUsers();
    await this.seedOrders();
    Logger.log('Database seeding completed');
  }
}

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const orderModel = app.get('OrderModel');
  const orderStatusModel = app.get('OrderStatusModel');
  const userModel = app.get('UserModel');
  
  const seeder = new SeederService(orderModel, orderStatusModel, userModel);
  
  try {
    await seeder.seed();
  } catch (error) {
    Logger.error('Error during seeding:', error);
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  seed();
}