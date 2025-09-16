import { 
  Controller, 
  Get, 
  Param, 
  Query, 
  UseGuards,
  Logger,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from './dto/pagination.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Get('transactions')
  async getTransactions(@Query() paginationDto: PaginationDto) {
    try {
      this.logger.log(`Fetching transactions with pagination: ${JSON.stringify(paginationDto)}`);
      
      const result = await this.ordersService.getTransactions(paginationDto);
      
      this.logger.log(`Retrieved ${result.data.length} transactions`);
      return result;
    } catch (error) {
      this.logger.error(`Error fetching transactions: ${error.message}`);
      throw error;
    }
  }

  @Get('transactions/school/:schoolId')
  async getSchoolTransactions(
    @Param('schoolId') schoolId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      if (!schoolId) {
        throw new BadRequestException('School ID is required');
      }

      this.logger.log(`Fetching transactions for school: ${schoolId}`);
      
      const result = await this.ordersService.getSchoolTransactions(schoolId, paginationDto);
      
      this.logger.log(`Retrieved ${result.data.length} transactions for school ${schoolId}`);
      return result;
    } catch (error) {
      this.logger.error(`Error fetching school transactions: ${error.message}`);
      throw error;
    }
  }

  @Get('transaction-status/:customOrderId')
  async getTransactionStatus(@Param('customOrderId') customOrderId: string) {
    try {
      if (!customOrderId) {
        throw new BadRequestException('Custom Order ID is required');
      }

      this.logger.log(`Checking transaction status for order: ${customOrderId}`);
      
      const result = await this.ordersService.getTransactionStatus(customOrderId);
      
      if (!result) {
        throw new NotFoundException(`Transaction with ID ${customOrderId} not found`);
      }

      this.logger.log(`Transaction status retrieved for order: ${customOrderId}`);
      return result;
    } catch (error) {
      this.logger.error(`Error fetching transaction status: ${error.message}`);
      throw error;
    }
  }
}