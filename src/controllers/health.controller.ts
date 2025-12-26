import { Elysia } from 'elysia'
import { db } from '@/config/database'
import { successResponse, errorResponse, ErrorCode, generateRequestId } from '@/utils/response'

export const healthController = new Elysia({ prefix: '/health' })
    .get('/', () => {
        return successResponse({
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'Tivity API'
        }, generateRequestId())
    })

    .get('/db', async () => {
        const requestId = generateRequestId()

        try {
            await db.execute('SELECT 1')
            return successResponse({
                status: 'ok',
                database: 'connected',
                timestamp: new Date().toISOString()
            }, requestId)
        } catch (error) {
            return errorResponse(
                error instanceof Error ? error.message : 'Database connection failed',
                ErrorCode.SERVICE_UNAVAILABLE,
                { requestId }
            )
        }
    })
