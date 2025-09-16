import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { OrdersModule } from '../orders/orders.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, OrdersModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}