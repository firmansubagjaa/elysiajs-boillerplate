import { Elysia, t } from 'elysia'
import { userService } from '@/services/user.service'
import { authMiddleware } from '@/middleware/auth.middleware'
import { successResponse, generateRequestId } from '@/utils/response'

export const userController = new Elysia({ prefix: '/users' })
    .use(authMiddleware)

    .get('/me', async ({ user }) => {
        return successResponse(user, generateRequestId())
    }, {
        detail: {
            summary: 'Get current user',
            tags: ['User']
        }
    })

    .patch('/me', async ({ user, body }) => {
        const updated = await userService.updateProfile(user.id, body)
        return successResponse(updated, generateRequestId())
    }, {
        body: t.Object({
            name: t.Optional(t.String())
        }),
        detail: {
            summary: 'Update user profile',
            tags: ['User']
        }
    })

    .delete('/me', async ({ user }) => {
        await userService.deleteAccount(user.id)
        return successResponse({ deleted: true }, generateRequestId())
    }, {
        detail: {
            summary: 'Delete user account',
            tags: ['User']
        }
    })
