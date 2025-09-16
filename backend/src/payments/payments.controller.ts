import { 
  Controller, 
  Post, 
  Body, 
  UseGuards,
  Logger,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    try {
      this.logger.log(`Creating payment request: ${JSON.stringify(createPaymentDto)}`);
      
      const result = await this.paymentsService.createPaymentRequest(createPaymentDto);
      
      this.logger.log(`Payment request created successfully with ID: ${result.collect_request_id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error creating payment request: ${error.message}`);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to create payment request');
    }
  }
}