import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderStatusDocument = OrderStatus & Document;

@Schema({ 
  collection: 'orderstatuses',
  timestamps: true,
})
export class OrderStatus {
  @Prop({ 
    type: Types.ObjectId, 
    ref: 'Order', 
    required: true, 
    index: true 
  })
  collect_id: Types.ObjectId;

  @Prop({ required: true })
  order_amount: number;

  @Prop({ required: true })
  transaction_amount: number;

  @Prop()
  payment_mode: string;

  @Prop()
  payment_details: string;

  @Prop()
  bank_reference: string;

  @Prop()
  payment_message: string;

  @Prop({ required: true, index: true })
  status: string;

  @Prop()
  error_message: string;

  @Prop({ index: true })
  payment_time: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);

// Create indexes
OrderStatusSchema.index({ collect_id: 1 });
OrderStatusSchema.index({ status: 1 });
OrderStatusSchema.index({ payment_time: -1 });
OrderStatusSchema.index({ transaction_amount: 1 });