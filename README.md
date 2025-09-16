# EDVIRON Software Developer Assessment - Full Stack Application

## Project Overview
A comprehensive full-stack application built with NestJS (backend) and React (frontend) featuring payment gateway integration, transaction management, webhook handling, and JWT authentication.

## Features
- **Authentication**: JWT-based secure authentication
- **Payment Integration**: Cashfree payment gateway integration
- **Transaction Management**: Complete CRUD operations for transactions
- **Webhook Handling**: Real-time payment status updates
- **Responsive UI**: Modern React interface with Tailwind CSS
- **Database**: MongoDB Atlas integration with optimized schemas

## Tech Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: JWT with Passport
- **Logging**: Winston for comprehensive logging
- **Validation**: Class-validator for request validation

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React Context API

## Project Structure

```
edviron-app/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── orders/            # Orders module
│   │   ├── payments/          # Payment integration
│   │   ├── webhooks/          # Webhook handlers
│   │   ├── common/            # Shared utilities
│   │   └── database/          # Database schemas
│   ├── package.json
│   └── .env.example
└── frontend/                   # React Frontend
    ├── src/
    │   ├── components/        # Reusable components
    │   ├── pages/             # Application pages
    │   ├── contexts/          # React contexts
    │   ├── services/          # API services
    │   └── utils/             # Utility functions
    ├── package.json
    └── .env.example
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (connection string provided)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run start:dev
```

5. Seed dummy data (optional):
```bash
npm run seed
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

## Environment Configuration

### Backend (.env)
```
MONGO_URI=mongodb+srv://forchegg72_db_user:Madi1234@edvironb.on9lqpj.mongodb.net/?retryWrites=true&w=majority&appName=EdvironB
PG_KEY=edvtest01
API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2fQ.IJWTYCOurGCFdRM2xyKtw6TEcuwXxGnmINrXFfsAdt0
SCHOOL_ID=65b0e6293e9f76a9694d84b4
JWT_SECRET=supersecretkey123
JWT_EXPIRY=1h
PORT=3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Transactions
- `GET /transactions` - Get all transactions (paginated, sortable)
- `GET /transactions/school/:schoolId` - Get school-specific transactions
- `GET /transaction-status/:customOrderId` - Check transaction status

### Payments
- `POST /create-payment` - Initiate payment request

### Webhooks
- `POST /webhook` - Handle payment status webhooks (unprotected)

## API Examples

### Register User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

### Create Payment
```bash
curl -X POST http://localhost:3000/create-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": "1000",
    "callback_url": "https://google.com",
    "student_info": {
      "name": "John Doe",
      "id": "STU001",
      "email": "john@example.com"
    },
    "trustee_id": "65b0e552dd31950a9b41c5ba"
  }'
```

### Get Transactions
```bash
curl -X GET "http://localhost:3000/transactions?page=1&limit=10&sort=payment_time&order=desc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Postman Collection

```json
{
  "info": {
    "name": "EDVIRON API Collection",
    "description": "Complete API collection for EDVIRON payment system",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"admin\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"admin\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Payments",
      "item": [
        {
          "name": "Create Payment",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"amount\": \"1000\",\n  \"callback_url\": \"https://google.com\",\n  \"student_info\": {\n    \"name\": \"John Doe\",\n    \"id\": \"STU001\",\n    \"email\": \"john@example.com\"\n  },\n  \"trustee_id\": \"65b0e552dd31950a9b41c5ba\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/create-payment",
              "host": ["{{baseUrl}}"],
              "path": ["create-payment"]
            }
          }
        }
      ]
    },
    {
      "name": "Transactions",
      "item": [
        {
          "name": "Get All Transactions",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/transactions?page=1&limit=10",
              "host": ["{{baseUrl}}"],
              "path": ["transactions"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            }
          }
        },
        {
          "name": "Get School Transactions",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/transactions/school/65b0e6293e9f76a9694d84b4",
              "host": ["{{baseUrl}}"],
              "path": ["transactions", "school", "65b0e6293e9f76a9694d84b4"]
            }
          }
        },
        {
          "name": "Check Transaction Status",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/transaction-status/{{orderId}}",
              "host": ["{{baseUrl}}"],
              "path": ["transaction-status", "{{orderId}}"]
            }
          }
        }
      ]
    },
    {
      "name": "Webhook",
      "item": [
        {
          "name": "Payment Webhook",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": 200,\n  \"order_info\": {\n    \"order_id\": \"ORDER_ID/TRANSACTION_ID\",\n    \"order_amount\": 1000,\n    \"transaction_amount\": 1000,\n    \"gateway\": \"Cashfree\",\n    \"bank_reference\": \"BANK_REF_123\",\n    \"status\": \"success\",\n    \"payment_mode\": \"UPI\",\n    \"payment_details\": \"Payment successful\",\n    \"Payment_message\": \"Transaction completed\",\n    \"payment_time\": \"2024-01-01T10:00:00.000Z\",\n    \"error_message\": \"\"\n  }\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/webhook",
              "host": ["{{baseUrl}}"],
              "path": ["webhook"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000",
      "type": "string"
    },
    {
      "key": "token",
      "value": "YOUR_JWT_TOKEN_HERE",
      "type": "string"
    }
  ]
}
```

## Testing

### Dummy Data
The application includes seeded dummy data with 10 sample orders and their corresponding statuses. Run the seed command to populate your database:

```bash
npm run seed
```

### Webhook Testing
Use tools like ngrok to expose your local server for webhook testing:

```bash
ngrok http 3000
```

## Default Login Credentials
- **Username**: admin
- **Password**: password123

## Features Overview

### Authentication System
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes with authentication guards

### Payment Integration
- Cashfree payment gateway integration
- Secure payment request creation
- Real-time status updates via webhooks

### Transaction Management
- Comprehensive transaction listing
- Advanced filtering and sorting
- School-specific transaction views
- Real-time status checking

### User Interface
- Responsive design with Tailwind CSS
- Intuitive navigation and user experience
- Real-time data updates
- Advanced table functionalities with sorting and pagination

## Support
For technical support or questions about the application, refer to the `dev_readme.md` file for developer-specific instructions and troubleshooting guides.