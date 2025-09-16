import { 
  IsString, 
  IsNotEmpty, 
  IsObject, 
  ValidateNested,
  IsEmail,
  IsUrl
} from 'class-validator';
import { Type } from 'class-transformer';

class StudentInfoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  email: string;
}

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsUrl()
  callback_url: string;

  @IsObject()
  @ValidateNested()
  @Type(() => StudentInfoDto)
  student_info: StudentInfoDto;

  @IsString()
  @IsNotEmpty()
  trustee_id: string;
}