# 🚀 User Management API Documentation

## Overview

This is a comprehensive REST API for user management with authentication, social login, and user operations. The API is built with Node.js, Express, and MongoDB, featuring JWT authentication and role-based access control.

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB
- npm or pnpm

### Installation
```bash
cd backend
npm install
```

### Environment Setup
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
```

### Running the Server
```bash
# Development mode
npm run local

# Production mode
npm run prod
```

## 📚 API Documentation

### Swagger UI
Once the server is running, you can access the interactive API documentation at:

**http://localhost:5000/api-docs**

The Swagger UI provides:
- Interactive API testing
- Request/response schemas
- Authentication examples
- Try-it-out functionality
- Detailed endpoint descriptions

## 🔐 Authentication

### JWT Tokens
The API uses JWT (JSON Web Tokens) for authentication:

1. **Login** to get access and refresh tokens
2. **Include the access token** in the Authorization header: `Bearer <token>`
3. **Use refresh token** to get new access tokens when they expire

### Token Format
```
Authorization: Bearer <your_jwt_token>
```

## 📋 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/register` | User registration | No |
| POST | `/api/users/login` | User login | No |
| POST | `/api/users/logout` | User logout | Yes |
| POST | `/api/users/refresh-token` | Refresh access token | No |

### User Management Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/api/users` | Get all users | Yes | ADMIN |
| GET | `/api/users/me` | Get current user info | Yes | USER |
| GET | `/api/users/:id` | Get user by ID | Yes | USER |
| PUT | `/api/users/:id` | Update user | Yes | USER |
| DELETE | `/api/users/:id` | Delete user | Yes | USER |

### Password Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/forgot-password` | Request password reset | No |
| POST | `/api/users/reset-password` | Reset password | No |
| POST | `/api/users/change-password` | Change password | Yes |

### Social Login

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/social/google` | Google OAuth login | No |
| POST | `/api/users/social/facebook` | Facebook OAuth login | No |
| POST | `/api/users/social/linkedin` | LinkedIn OAuth login | No |
| POST | `/api/users/social/apple` | Apple Sign In | No |

## 🧪 Testing the API

### Using Swagger UI (Recommended)

1. **Start the server**: `npm run local`
2. **Open Swagger UI**: http://localhost:5000/api-docs
3. **Test endpoints** using the "Try it out" button
4. **View responses** and schemas in real-time

### Using cURL Examples

#### User Registration
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

#### User Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Get User Info (Authenticated)
```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Change Password
```bash
curl -X POST http://localhost:5000/api/users/change-password \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }'
```

### Using Postman

1. **Import the Swagger spec** from: http://localhost:5000/api-docs/swagger.json
2. **Set up environment variables** for tokens
3. **Test all endpoints** with proper authentication

## 🔒 Security Features

- **JWT Authentication** with access and refresh tokens
- **Role-based access control** (USER, ADMIN)
- **Password hashing** with bcrypt
- **Input validation** with express-validator
- **CORS protection**
- **Rate limiting** (can be added)
- **Helmet security headers** (can be added)

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "msg": "Email is invalid"
    }
  ]
}
```

## 🚨 Common HTTP Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (invalid/missing token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **409** - Conflict (duplicate resource)
- **500** - Internal Server Error

## 🛠️ Development

### Project Structure
```
backend/
├── app/
│   ├── common/
│   │   ├── config/
│   │   │   └── swagger.config.ts    # Swagger configuration
│   │   ├── middleware/
│   │   ├── services/
│   │   └── helper/
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.route.ts            # API routes with Swagger docs
│   │   ├── user.service.ts
│   │   └── user.validation.ts
│   └── routes.ts
├── index.ts                         # Main server file
└── package.json
```

### Adding New Endpoints

1. **Add JSDoc comments** to your route files
2. **Define schemas** in `swagger.config.ts` if needed
3. **Test with Swagger UI**
4. **Update this documentation**

### Customizing Swagger

Edit `app/common/config/swagger.config.ts` to:
- Change API title and description
- Add new schemas
- Modify server URLs
- Customize UI options

## 📝 Notes

- **All timestamps** are in ISO 8601 format
- **Passwords** must be 5-16 characters long
- **JWT tokens** expire after 1 hour (configurable)
- **Refresh tokens** expire after 7 days (configurable)
- **Social login** requires valid OAuth tokens from respective platforms

## 🆘 Support

For API support or questions:
- Check the Swagger documentation first
- Review the error messages in responses
- Check server logs for detailed error information
- Ensure all required environment variables are set

## 📄 License

This project is licensed under the MIT License.
