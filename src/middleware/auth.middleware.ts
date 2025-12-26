import { Elysia } from 'elysia'
import { authService } from '../services/auth.service'

export const authMiddleware = new Elysia({ name: 'auth' })
    .derive(async ({ headers }) => {
        const authorization = headers.authorization

        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new Error('Unauthorized: No token provided')
        }

        const token = authorization.substring(7)
        const user = await authService.verifyAuth(token)

        if (!user) {
            throw new Error('Unauthorized: Invalid token')
        }

        return { user }
    })
