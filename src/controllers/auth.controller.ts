import { Elysia, t } from 'elysia'
import { authService } from '@/services/auth.service'
import { emailService } from '@/services/email.service'
import { successResponse, generateRequestId } from '@/utils/response'

export const authController = new Elysia({ prefix: '/auth' })
    .post('/register', async ({ body }) => {
        const requestId = generateRequestId()

        try {
            const result = await authService.register(body)

            // Send welcome email (async, don't wait)
            if (result.user.name) {
                emailService.sendWelcomeEmail(result.user.email, result.user.name).catch(console.error)
            }

            return successResponse(result, requestId)
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Registration failed')
        }
    }, {
        body: t.Object({
            email: t.String({ format: 'email' }),
            name: t.Optional(t.String()),
            password: t.String({ minLength: 8 })
        }),
        detail: {
            summary: 'Register new user',
            tags: ['Auth']
        }
    })

    .post('/login', async ({ body }) => {
        const requestId = generateRequestId()

        try {
            const result = await authService.login(body.email, body.password)

            return successResponse(result, requestId)
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Login failed')
        }
    }, {
        body: t.Object({
            email: t.String({ format: 'email' }),
            password: t.String()
        }),
        detail: {
            summary: 'Login user',
            tags: ['Auth']
        }
    })
