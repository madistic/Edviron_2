import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WebhookLogDocument = WebhookLog & Document;

@Schema({ 
  collection: 'webhooklogs',
  timestamps: true,
})
export class WebhookLog {
  @Prop({ default: Date.now, index: true })
  timestamp: Date;

  @Prop({ required: true })
  status_code: number;

  @Prop({ type: Object, required: true })
  payload: any;

  @Prop()
  error: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);

// Create indexes
WebhookLogSchema.index({ timestamp: -1 });
WebhookLogSchema.index({ status_code: 1 });