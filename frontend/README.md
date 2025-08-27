# User Management System

A comprehensive full-stack application for user authentication, authorization, and management with social login integration and admin panel.

## 🚀 Features

### Authentication & Authorization
- **JWT-based authentication** with access and refresh tokens
- **Role-based access control** (USER/ADMIN)
- **Social login integration** (Google, Facebook, Apple, LinkedIn)
- **Password management** (reset, change, forgot password)
- **User invitation system**

### User Management
- **User registration and login**
- **Profile management**
- **Admin user creation**
- **User role and status management**
- **Bulk user operations**
- **User search and filtering**

### Admin Panel
- **Dashboard with user statistics**
- **User management interface**
- **Admin user creation**
- **User role and status updates**
- **User deletion and blocking**

### Security Features
- **Password strength validation**
- **Input sanitization and validation**
- **CORS protection**
- **Rate limiting**
- **Secure password hashing**

## 🏗️ Architecture

```
Final project/
├── backend/                 # Node.js + Express + TypeScript API
│   ├── app/
│   │   ├── common/         # Shared utilities, middleware, services
│   │   ├── user/           # User-related routes, controllers, services
│   │   └── routes.ts       # Main route configuration
│   ├── index.ts            # Server entry point
│   └── package.json
├── frontend/               # React + TypeScript + Material-UI
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── store/          # Redux store and reducers
│   │   └── themes/         # Material-UI theme configuration
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens
- **Swagger** - API documentation

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Material-UI** - Component library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Vite** - Build tool

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or pnpm
- MongoDB (local or cloud instance)
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Final project"
```

### 2. Backend Setup
```bash
cd backend
npm install
```

#### Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user-management
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
FE_BASE_URL=http://localhost:3000
```

#### Start Backend Server
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

#### Start Frontend Development Server
```bash
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **API Documentation:** http://localhost:5000/api-docs

## 🔧 Troubleshooting

### Common Issues

#### Admin User Creation Fails (404 Error)
If you encounter a 404 error when trying to create admin users:

1. **Restart the backend server** after making route changes:
   ```bash
   cd backend
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Verify route order** - Admin routes must be defined before generic `:id` routes
3. **Check server logs** for any startup errors
4. **Ensure MongoDB is running** and accessible

#### Authentication Issues
- **JWT tokens expired:** Use the refresh token endpoint
- **Role access denied:** Ensure user has ADMIN role for admin functions
- **Social login fails:** Check OAuth configuration and API keys

#### Database Connection Issues
- **MongoDB not running:** Start MongoDB service
- **Connection string wrong:** Verify MONGODB_URI in .env file
- **Network issues:** Check firewall and network configuration

#### Frontend Build Issues
- **TypeScript errors:** Run `npm run build` to see detailed errors
- **Missing dependencies:** Run `npm install` to install missing packages
- **Port conflicts:** Change port in vite.config.ts if 3000 is occupied

### Debug Mode
Enable debug logging in the backend:
```env
DEBUG=app:*
NODE_ENV=development
```

### Health Check
Test if the backend is running:
```bash
curl http://localhost:5000/
# Should return: {"status":"ok","message":"User Management API is running"}
```

## 🔐 Default Admin Access

To access the admin panel, use these credentials:
- **Email:** himachal123@gmail.com
- **Password:** 12345

## 📚 API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `POST /api/users/logout` - User logout
- `POST /api/users/refresh-token` - Refresh access token

### Admin Management
- `POST /api/users/admin/create` - Create new admin user
- `PUT /api/users/admin/update/:id` - Update user information
- `GET /api/users` - Get all users (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### User Management
- `GET /api/users/me` - Get current user info
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/change-password` - Change password
- `POST /api/users/forgot-password` - Request password reset

### Social Login
- `POST /api/users/social/google` - Google OAuth login
- `POST /api/users/social/facebook` - Facebook OAuth login
- `POST /api/users/social/apple` - Apple Sign In
- `POST /api/users/social/linkedin` - LinkedIn OAuth login

## 🎯 Usage Examples

### Creating an Admin User
1. Login to the admin panel
2. Navigate to User Management
3. Click "Add Admin" button
4. Fill in the form:
   - **Name:** Admin's full name
   - **Email:** Admin's email address
   - **Password:** Strong password (min 8 chars, uppercase, lowercase, number)
   - **Confirm Password:** Password confirmation
5. Click "Create Admin"

### Managing Users
1. **View Users:** See all users with filtering and search
2. **Edit Users:** Click edit icon to modify role, status, or name
3. **Delete Users:** Click delete icon (admin users cannot be deleted)
4. **Bulk Operations:** Select multiple users for bulk actions

### User Roles and Status
- **Role:** USER or ADMIN
- **Status:** Active/Inactive
- **Blocked:** Blocked/Unblocked
- **Provider:** Manual, Google, Facebook, Apple, LinkedIn

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Swagger** for API documentation

## 🐳 Docker Support

### Backend Docker
```bash
cd backend
docker build -t user-management-backend .
docker run -p 5000:5000 user-management-backend
```

### Full Stack with Docker Compose
```bash
docker-compose up -d
```

## 📝 API Documentation

Interactive API documentation is available at `/api-docs` when the backend server is running. The documentation includes:

- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Try-it-out functionality

## 🚨 Security Considerations

- **JWT tokens** are stored securely
- **Passwords** are hashed using bcrypt
- **Input validation** on all endpoints
- **Role-based access control** for admin functions
- **CORS** properly configured
- **Environment variables** for sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/api-docs`
- Review the code comments and JSDoc
- Open an issue on the repository

## 🔄 Recent Updates

### Admin User Management (Latest)
- ✅ Add Admin button in User Management
- ✅ Create Admin form with validation
- ✅ Admin user creation API endpoint
- ✅ User role and status update functionality
- ✅ Enhanced user management interface

### Previous Features
- ✅ User authentication system
- ✅ Social login integration
- ✅ Admin panel and dashboard
- ✅ User management interface
- ✅ Password management system
