import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({
  collection: 'orders',
  timestamps: true,
})
export class Order {
  _id: Types.ObjectId;

  @Prop({ required: true, index: true })  // Index is declared here, no need for manual schema.index
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

// Remove duplicate index definitions
// OrderSchema.index({ _id: 1 }); // REMOVE this line, it's unnecessary
OrderSchema.index({ createdAt: -1 });  // This one is fine for sorting orders by createdAt