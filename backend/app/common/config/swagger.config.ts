import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'A comprehensive API for user management including authentication, social login, and user operations',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
      {
        url: 'https://your-production-domain.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the user',
            },
            name: {
              type: 'string',
              description: 'Full name of the user',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the user',
            },
            role: {
              type: 'string',
              enum: ['USER', 'ADMIN'],
              description: 'Role of the user',
            },
            isEmailVerified: {
              type: 'boolean',
              description: 'Whether the user email is verified',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
            },
          },
          required: ['name', 'email'],
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              minLength: 5,
              maxLength: 16,
              description: 'User password',
            },
          },
          required: ['email', 'password'],
        },
        RegisterRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Full name of the user',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the user',
            },
            password: {
              type: 'string',
              minLength: 5,
              maxLength: 16,
              description: 'User password',
            },
            confirmPassword: {
              type: 'string',
              description: 'Password confirmation',
            },
          },
          required: ['name', 'email', 'password', 'confirmPassword'],
        },
        ChangePasswordRequest: {
          type: 'object',
          properties: {
            currentPassword: {
              type: 'string',
              description: 'Current password',
            },
            newPassword: {
              type: 'string',
              minLength: 5,
              maxLength: 16,
              description: 'New password',
            },
            confirmPassword: {
              type: 'string',
              description: 'New password confirmation',
            },
          },
          required: ['currentPassword', 'newPassword', 'confirmPassword'],
        },
        ForgotPasswordRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address for password reset',
            },
          },
          required: ['email'],
        },
        ResetPasswordRequest: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Password reset token',
            },
            newPassword: {
              type: 'string',
              minLength: 5,
              maxLength: 16,
              description: 'New password',
            },
            confirmPassword: {
              type: 'string',
              description: 'New password confirmation',
            },
          },
          required: ['token', 'newPassword', 'confirmPassword'],
        },
        SocialLoginRequest: {
          type: 'object',
          properties: {
            access_token: {
              type: 'string',
              description: 'Social platform access token',
            },
            id_token: {
              type: 'string',
              description: 'Apple ID token',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Operation success status',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                token: {
                  type: 'string',
                  description: 'JWT access token',
                },
                refreshToken: {
                  type: 'string',
                  description: 'JWT refresh token',
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Operation success status',
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Field name with error',
                  },
                  msg: {
                    type: 'string',
                    description: 'Error message for the field',
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints',
      },
      {
        name: 'User Management',
        description: 'User CRUD operations',
      },
      {
        name: 'Social Login',
        description: 'Social media authentication',
      },
      {
        name: 'Password Management',
        description: 'Password reset and change operations',
      },
    ],
  },
  apis: ['./app/**/*.ts'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
