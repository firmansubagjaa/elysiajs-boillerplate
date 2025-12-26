import { Elysia } from 'elysia'
import { env } from '@/config/env'
import { Errors, generateRequestId, ErrorCode } from '@/utils/response'

export const errorMiddleware = new Elysia({ name: 'error' })
    .onError((context) => {
        const { code, error, set } = context
        const isDev = env.isDevelopment()
        const requestId = generateRequestId()

        // Log error in development
        if (isDev) {
            console.error(`[Error] [${requestId}]`, error)
        }

        // Helper to safely get error message
        const getErrorMessage = (err: unknown): string => {
            if (err instanceof Error) return err.message
            if (typeof err === 'string') return err
            return 'Unknown error'
        }

        // Helper to safely get error stack
        const getErrorStack = (err: unknown): string | undefined => {
            if (err instanceof Error) return err.stack
            return undefined
        }

        const errorMessage = getErrorMessage(error)

        // Handle different error types
        switch (code) {
            case 'NOT_FOUND':
                set.status = 404
                return Errors.notFound(errorMessage, requestId)

            case 'VALIDATION':
                set.status = 400
                return Errors.validation({}, errorMessage, requestId)

            case 'PARSE':
                set.status = 400
                return Errors.parseError(errorMessage, requestId)

            default:
                set.status = 500
                return Errors.internal(
                    isDev ? errorMessage : 'Internal Server Error',
                    requestId,
                    isDev ? getErrorStack(error) : undefined
                )
        }
    })
