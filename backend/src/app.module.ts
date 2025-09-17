import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGO_URI');
        console.log('Mongo URI:', mongoUri);  // Log to check the URI
        return { uri: mongoUri };
      },
      inject: [ConfigService],
    }),
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        console.log('Loaded JWT Secret:', jwtSecret);  // Verify the JWT secret
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: configService.get<string>('JWT_EXPIRY', '1h') },
        };
      },
      inject: [ConfigService],
    }),
    DatabaseModule,
    AuthModule,
    OrdersModule,
    PaymentsModule,
    WebhooksModule,
  ],
})
export class AppModule {}