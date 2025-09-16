import { 
  Controller, 
  Post, 
  Body, 
  Logger,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';

@Controller('webhook')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handlePaymentWebhook(@Body() webhookData: PaymentWebhookDto) {
    try {
      this.logger.log(`Webhook received: ${JSON.stringify(webhookData)}`);
      
      await this.webhooksService.processPaymentWebhook(webhookData);
      
      this.logger.log(`Webhook processed successfully`);
      return { status: 'success', message: 'Webhook processed successfully' };
    } catch (error) {
      this.logger.error(`Webhook processing failed: ${error.message}`);
      
      // Still return 200 to avoid webhook retries
      return { status: 'error', message: error.message };
    }
  }
}