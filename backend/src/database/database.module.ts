import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Order, OrderSchema } from './schemas/order.schema';
import { OrderStatus, OrderStatusSchema } from './schemas/order-status.schema';
import { User, UserSchema } from './schemas/user.schema';
import { WebhookLog, WebhookLogSchema } from './schemas/webhook-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderStatus.name, schema: OrderStatusSchema },
      { name: User.name, schema: UserSchema },
      { name: WebhookLog.name, schema: WebhookLogSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}