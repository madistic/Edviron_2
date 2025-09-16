import { 
  IsNumber, 
  IsObject, 
  ValidateNested, 
  IsString, 
  IsNotEmpty,
  IsOptional,
  IsDateString
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderInfoDto {
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsNumber()
  order_amount: number;

  @IsNumber()
  transaction_amount: number;

  @IsString()
  @IsOptional()
  gateway: string;

  @IsString()
  @IsOptional()
  bank_reference: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  payment_mode: string;

  @IsString()
  @IsOptional()
  payment_details: string;

  @IsString()
  @IsOptional()
  Payment_message: string;

  @IsDateString()
  @IsOptional()
  payment_time: string;

  @IsString()
  @IsOptional()
  error_message: string;
}

export class PaymentWebhookDto {
  @IsNumber()
  status: number;

  @IsObject()
  @ValidateNested()
  @Type(() => OrderInfoDto)
  order_info: OrderInfoDto;
}