# Developer Guide - EDVIRON Application

## Development Environment Setup

### Prerequisites
- Node.js 18+ with npm
- MongoDB Atlas access
- Git for version control
- Code editor (VS Code recommended)

## Environment Variables Management

### Adding New Environment Variables

1. **Backend Environment Variables**
   ```bash
   # Edit backend/.env
   NEW_VARIABLE=your_value_here
   
   # Update backend/.env.example
   NEW_VARIABLE=example_value
   
   # Update config service in src/config/config.service.ts
   ```

2. **Frontend Environment Variables**
   ```bash
   # Edit frontend/.env
   VITE_NEW_VARIABLE=your_value_here
   
   # Update frontend/.env.example
   VITE_NEW_VARIABLE=example_value
   ```

### Updating Database Connection

To change MongoDB connection:

1. Update `MONGO_URI` in `backend/.env`
2. Restart the backend server
3. Run seed script if needed: `npm run seed`

```bash
# Example for local MongoDB
MONGO_URI=mongodb://localhost:27017/edviron_db

# Example for different Atlas cluster
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

## Database Schema Extensions

### Adding New Fields to Existing Schemas

1. **Update Mongoose Schema** (`src/database/schemas/`)
   ```typescript
   // Example: Adding new field to Order schema
   @Prop({ required: false })
   new_field: string;
   ```

2. **Update DTOs** (`src/*/dto/`)
   ```typescript
   // Add validation rules
   @IsOptional()
   @IsString()
   new_field?: string;
   ```

3. **Update Interfaces** if using TypeScript interfaces

4. **Create Migration Script** (optional)
   ```typescript
   // scripts/migrate-add-field.ts
   await Order.updateMany({}, { $set: { new_field: 'default_value' } });
   ```

### Creating New Schemas

1. Create schema file: `src/database/schemas/new-entity.schema.ts`
2. Create module: `src/new-entity/new-entity.module.ts`
3. Create service: `src/new-entity/new-entity.service.ts`
4. Create controller: `src/new-entity/new-entity.controller.ts`
5. Update app.module.ts imports

## API Development

### Adding New Endpoints

1. **Create DTO for request/response**
   ```typescript
   // src/module/dto/create-entity.dto.ts
   export class CreateEntityDto {
     @IsString()
     @IsNotEmpty()
     name: string;
   }
   ```

2. **Add Service Method**
   ```typescript
   // src/module/entity.service.ts
   async createEntity(createEntityDto: CreateEntityDto) {
     // Implementation
   }
   ```

3. **Add Controller Endpoint**
   ```typescript
   // src/module/entity.controller.ts
   @Post()
   @UseGuards(JwtAuthGuard)
   async create(@Body() createEntityDto: CreateEntityDto) {
     return this.entityService.createEntity(createEntityDto);
   }
   ```

### Authentication Guards

To protect new endpoints:

```typescript
@UseGuards(JwtAuthGuard)
@Get('protected-route')
async protectedRoute() {
  // Protected logic
}
```

## Frontend Development

### Adding New Pages

1. Create component: `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`
3. Update navigation in `src/components/Navbar.jsx`

### API Integration

Create service functions in `src/services/api.js`:

```javascript
export const newApiCall = async (data) => {
  const response = await axiosInstance.post('/new-endpoint', data);
  return response.data;
};
```

### State Management

For complex state, consider adding context providers:

```javascript
// src/contexts/NewContext.jsx
export const NewContext = createContext();
export const NewProvider = ({ children }) => {
  const [state, setState] = useState({});
  return (
    <NewContext.Provider value={{ state, setState }}>
      {children}
    </NewContext.Provider>
  );
};
```

## Payment Gateway Integration

### Adding New Payment Gateways

1. **Create Gateway Service**
   ```typescript
   // src/payments/gateways/new-gateway.service.ts
   @Injectable()
   export class NewGatewayService {
     async createPayment(paymentData: PaymentDto) {
       // Gateway-specific implementation
     }
   }
   ```

2. **Update Payment Service**
   ```typescript
   // Add gateway selection logic
   const gateway = this.getGateway(gatewayName);
   return gateway.createPayment(paymentData);
   ```

3. **Update Environment Variables**
   ```bash
   NEW_GATEWAY_KEY=your_key
   NEW_GATEWAY_SECRET=your_secret
   ```

## Webhook Development

### Adding New Webhook Handlers

1. **Create Webhook DTO**
   ```typescript
   export class NewWebhookDto {
     @IsString()
     event_type: string;
     
     @IsObject()
     data: any;
   }
   ```

2. **Add Handler Method**
   ```typescript
   @Post('new-webhook')
   async handleNewWebhook(@Body() webhookData: NewWebhookDto) {
     // Process webhook
   }
   ```

## Database Indexing

### Adding New Indexes

```typescript
// In schema file
@Schema()
export class EntitySchema {
  @Prop({ index: true }) // Simple index
  indexed_field: string;
  
  @Prop()
  other_field: string;
}

// Compound index
EntitySchema.index({ field1: 1, field2: -1 });
```

### Performance Optimization

1. **Monitor slow queries**
   ```javascript
   // Enable in development
   mongoose.set('debug', true);
   ```

2. **Add explain() to queries**
   ```typescript
   const result = await this.model.find(query).explain('executionStats');
   ```

## Logging and Debugging

### Adding Custom Logs

```typescript
import { Logger } from '@nestjs/common';

export class YourService {
  private readonly logger = new Logger(YourService.name);
  
  someMethod() {
    this.logger.log('Information message');
    this.logger.error('Error message', error.stack);
    this.logger.warn('Warning message');
  }
}
```

### Debugging Webhooks

1. **Use ngrok for local testing**
   ```bash
   ngrok http 3000
   # Use the HTTPS URL for webhook endpoints
   ```

2. **Log webhook payloads**
   ```typescript
   @Post('webhook')
   async webhook(@Body() body: any) {
     this.logger.log('Webhook received:', JSON.stringify(body, null, 2));
     // Process webhook
   }
   ```

## Testing

### Unit Tests

```typescript
// src/module/entity.service.spec.ts
describe('EntityService', () => {
  let service: EntityService;
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EntityService],
    }).compile();
    
    service = module.get<EntityService>(EntityService);
  });
  
  it('should create entity', async () => {
    // Test implementation
  });
});
```

### Integration Tests

```typescript
// test/app.e2e-spec.ts
describe('AppController (e2e)', () => {
  let app: INestApplication;
  
  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
```

## Deployment Considerations

### Environment-Specific Configurations

1. **Development**
   - Enable detailed logging
   - Use local/development databases
   - Disable caching

2. **Staging**
   - Mirror production environment
   - Enable performance monitoring
   - Test with production-like data

3. **Production**
   - Enable caching (Redis)
   - Optimize database connections
   - Enable security headers

### Scaling Recommendations

1. **Horizontal Scaling**
   - Use PM2 for process management
   - Implement load balancing
   - Use Redis for session storage

2. **Database Optimization**
   - Implement connection pooling
   - Add read replicas for read-heavy operations
   - Use aggregation pipelines for complex queries

3. **Caching Strategy**
   ```typescript
   // Add Redis caching
   @Injectable()
   export class CacheService {
     async set(key: string, value: any, ttl: number) {
       // Redis implementation
     }
   }
   ```

## Security Considerations

### Additional Security Measures

1. **Rate Limiting**
   ```typescript
   // Add to main.ts
   app.use(
     rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 100, // limit each IP to 100 requests per windowMs
     }),
   );
   ```

2. **Request Validation**
   ```typescript
   // Custom validation pipe
   @Injectable()
   export class CustomValidationPipe extends ValidationPipe {
     // Custom validation logic
   }
   ```

3. **Security Headers**
   ```typescript
   // Add helmet
   app.use(helmet());
   ```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check MONGO_URI format
   - Verify network access to Atlas
   - Check IP whitelist in MongoDB Atlas

2. **JWT Token Issues**
   - Verify JWT_SECRET matches between requests
   - Check token expiration
   - Ensure proper Authorization header format

3. **CORS Issues**
   - Update CORS configuration in main.ts
   - Check frontend origin URL
   - Verify preflight request handling

4. **Webhook Not Working**
   - Use ngrok for local development
   - Check webhook URL in payment gateway dashboard
   - Verify request body parsing

### Debug Commands

```bash
# Check MongoDB connection
npm run debug:db

# Test webhook locally
npm run test:webhook

# Validate environment variables
npm run check:env

# Generate API documentation
npm run docs:generate
```

### Performance Monitoring

1. **Add timing logs**
   ```typescript
   const start = Date.now();
   // Your code
   this.logger.log(`Operation took ${Date.now() - start}ms`);
   ```

2. **Monitor memory usage**
   ```typescript
   setInterval(() => {
     const used = process.memoryUsage();
     this.logger.log(`Memory: ${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`);
   }, 30000);
   ```

## Contributing Guidelines

1. **Code Standards**
   - Follow TypeScript/JavaScript style guide
   - Use meaningful variable names
   - Add comments for complex logic
   - Write unit tests for new features

2. **Commit Messages**
   ```
   feat: add new payment gateway integration
   fix: resolve webhook processing issue
   docs: update API documentation
   refactor: optimize database queries
   ```

3. **Pull Request Process**
   - Create feature branch from develop
   - Ensure all tests pass
   - Update documentation
   - Request code review