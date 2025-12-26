/**
 * API Response Utility
 * Based on best practices for consistent, traceable API responses
 * Reference: https://dev.to/naandan/best-practice-api-response-ringkas-konsisten-dan-mudah-ditelusuri-21bi
 */

// ============ Error Codes ============

/** Validation error codes */
export const ValidationErrorCode = {
    REQUIRED: 'REQUIRED',
    INVALID_TYPE: 'INVALID_TYPE',
    INVALID_FORMAT: 'INVALID_FORMAT',
    MIN_LENGTH: 'MIN_LENGTH',
    MAX_LENGTH: 'MAX_LENGTH',
    MIN_VALUE: 'MIN_VALUE',
    MAX_VALUE: 'MAX_VALUE',
    UNIQUE: 'UNIQUE',
    ENUM_VALUE: 'ENUM_VALUE',
    MISMATCH: 'MISMATCH',
} as const

/** Auth & Security error codes */
export const AuthErrorCode = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',
    ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
} as const

/** Server error codes */
export const ServerErrorCode = {
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    TIMEOUT: 'TIMEOUT',
    CONFLICT: 'CONFLICT',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    PARSE_ERROR: 'PARSE_ERROR',
} as const

/** All error codes combined */
export const ErrorCode = {
    ...ValidationErrorCode,
    ...AuthErrorCode,
    ...ServerErrorCode,
} as const

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode]
export type ValidationErrorCodeType = typeof ValidationErrorCode[keyof typeof ValidationErrorCode]

// ============ Response Types ============

/** Base response with request_id */
interface BaseResponse {
    request_id: string
}

/** Success response for single resource */
export interface SuccessResponse<T> extends BaseResponse {
    data: T
}

/** Success response for list with pagination */
export interface ListResponse<T> extends BaseResponse {
    items: T[]
    meta: PaginationMeta
}

/** Pagination metadata */
export interface PaginationMeta {
    page: number
    per_page: number
    total: number
    total_pages?: number
}

/** Error response */
export interface ErrorResponse extends BaseResponse {
    error: {
        message: string
        code: ErrorCodeType
        fields?: Record<string, ValidationErrorCodeType[]>
        stack?: string
    }
}

// ============ Response Builders ============

/**
 * Generate unique request ID
 */
export function generateRequestId(): string {
    return crypto.randomUUID()
}

/**
 * Build success response for single resource
 */
export function successResponse<T>(data: T, requestId?: string): SuccessResponse<T> {
    return {
        request_id: requestId ?? generateRequestId(),
        data,
    }
}

/**
 * Build success response for list with pagination
 */
export function listResponse<T>(
    items: T[],
    meta: PaginationMeta,
    requestId?: string
): ListResponse<T> {
    return {
        request_id: requestId ?? generateRequestId(),
        items,
        meta: {
            ...meta,
            total_pages: Math.ceil(meta.total / meta.per_page),
        },
    }
}

/**
 * Build error response
 */
export function errorResponse(
    message: string,
    code: ErrorCodeType,
    options?: {
        requestId?: string
        fields?: Record<string, ValidationErrorCodeType[]>
        stack?: string
    }
): ErrorResponse {
    return {
        request_id: options?.requestId ?? generateRequestId(),
        error: {
            message,
            code,
            ...(options?.fields && { fields: options.fields }),
            ...(options?.stack && { stack: options.stack }),
        },
    }
}

// ============ Pre-built Error Responses ============

export const Errors = {
    notFound: (message = 'Resource Not Found', requestId?: string) =>
        errorResponse(message, ErrorCode.NOT_FOUND, { requestId }),

    unauthorized: (message = 'Unauthorized', requestId?: string) =>
        errorResponse(message, ErrorCode.UNAUTHORIZED, { requestId }),

    invalidToken: (message = 'Invalid or Expired Token', requestId?: string) =>
        errorResponse(message, ErrorCode.INVALID_TOKEN, { requestId }),

    forbidden: (message = 'Forbidden Action', requestId?: string) =>
        errorResponse(message, ErrorCode.FORBIDDEN_ACTION, { requestId }),

    validation: (
        fields: Record<string, ValidationErrorCodeType[]>,
        message = 'Payload Validation Failed',
        requestId?: string
    ) => errorResponse(message, ErrorCode.VALIDATION_ERROR, { requestId, fields }),

    parseError: (message = 'Invalid Request Body', requestId?: string) =>
        errorResponse(message, ErrorCode.PARSE_ERROR, { requestId }),

    internal: (message = 'Internal Server Error', requestId?: string, stack?: string) =>
        errorResponse(message, ErrorCode.INTERNAL_ERROR, { requestId, stack }),

    conflict: (message = 'Resource Conflict', requestId?: string) =>
        errorResponse(message, ErrorCode.CONFLICT, { requestId }),

    tooManyRequests: (message = 'Too Many Requests', requestId?: string) =>
        errorResponse(message, ErrorCode.TOO_MANY_REQUESTS, { requestId }),
}
