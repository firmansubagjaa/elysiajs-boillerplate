import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'

// Import configuration
import { env } from './config/env'

// Import utilities
import { successResponse, generateRequestId } from './utils/response'

// Import middleware
import { errorMiddleware } from './middleware/error.middleware'
import { loggerMiddleware } from './middleware/logger.middleware'

// Import controllers
import { healthController } from './controllers/health.controller'
import { authController } from './controllers/auth.controller'
import { userController } from './controllers/user.controller'

const app = new Elysia()
  // CORS Configuration
  .use(cors({
    origin: env.isDevelopment()
      ? ['http://localhost:5173', 'http://localhost:3000']
      : ['https://yourdomain.com'],
    credentials: true
  }))

  // OpenAPI Documentation with enhanced configuration
  .use(openapi({
    documentation: {
      info: {
        title: 'Tivity API',
        version: '1.0.0',
        description: `
## Overview
Tivity API provides a complete backend solution with authentication, user management, and more.

## Authentication
This API uses **Bearer Token** authentication. Include your JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <your_token>
\`\`\`

## Response Format
All responses follow a consistent format:
- **Success**: \`{ request_id, data }\`
- **Error**: \`{ request_id, error: { message, code } }\`
        `,
        contact: {
          name: 'Tivity Support',
          email: 'support@tivity.app'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      tags: [
        { name: 'Health', description: 'Health check and system status endpoints' },
        { name: 'Auth', description: 'Authentication endpoints (register, login, logout)' },
        { name: 'User', description: 'User profile management endpoints' }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter your JWT token'
          }
        }
      }
    },
    path: '/docs'
  }))

  // Global Middleware
  .use(loggerMiddleware)
  .use(errorMiddleware)

  // Welcome Route (root level)
  .get('/', () => successResponse({
    message: 'Welcome to Tivity API',
    version: '1.0.0',
    docs: '/docs',
    api: '/api/v1'
  }, generateRequestId()))

  // API v1 Routes
  .group('/api/v1', (app) => app
    .use(healthController)
    .use(authController)
    .use(userController)
  )

  .listen(3000)

console.log(`
🚀 Tivity API is running!
📍 URL: http://${app.server?.hostname}:${app.server?.port}
📚 Docs: http://${app.server?.hostname}:${app.server?.port}/docs
🔗 API: http://${app.server?.hostname}:${app.server?.port}/api/v1
🔧 Environment: ${env.isDevelopment() ? 'Development' : 'Production'}
`)

export default app
