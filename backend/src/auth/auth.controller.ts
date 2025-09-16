import { 
  Controller, 
  Post, 
  Body, 
  UnauthorizedException,
  ConflictException,
  Logger 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      this.logger.log(`Login attempt for user: ${loginDto.username}`);
      
      const result = await this.authService.login(loginDto);
      
      if (!result) {
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.log(`User ${loginDto.username} logged in successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Login failed for user ${loginDto.username}: ${error.message}`);
      throw error;
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      this.logger.log(`Registration attempt for user: ${registerDto.username}`);
      
      const existingUser = await this.authService.findUserByUsername(registerDto.username);
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }

      const result = await this.authService.register(registerDto);
      
      this.logger.log(`User ${registerDto.username} registered successfully`);
      return {
        message: 'User registered successfully',
        user: {
          username: result.username,
          role: result.role,
        },
      };
    } catch (error) {
      this.logger.error(`Registration failed for user ${registerDto.username}: ${error.message}`);
      throw error;
    }
  }
}