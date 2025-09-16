import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ 
  collection: 'orders',
  timestamps: true,
})
export class Order {
  _id: Types.ObjectId;

  @Prop({ required: true, index: true })
  school_id: string;

  @Prop({ required: true })
  trustee_id: string;

  @Prop({
    type: {
      name: { type: String, required: true },
      id: { type: String, required: true },
      email: { type: String, required: true },
    },
    required: true,
  })
  student_info: {
    name: string;
    id: string;
    email: string;
  };

  @Prop({ required: true })
  gateway_name: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Create indexes
OrderSchema.index({ school_id: 1 });
OrderSchema.index({ _id: 1 });
OrderSchema.index({ createdAt: -1 });