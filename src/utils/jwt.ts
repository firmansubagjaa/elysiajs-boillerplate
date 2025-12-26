const JWT_SECRET = process.env.JWT_SECRET

interface JWTPayload {
    userId: number
    email?: string
    exp?: number
    iat?: number
    [key: string]: unknown
}

/**
 * Generate JWT token
 */
export async function generateToken(payload: JWTPayload, expiresIn: string = '7d'): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(
        JSON.stringify({
            ...payload,
            exp: getExpirationTimestamp(expiresIn),
            iat: Math.floor(Date.now() / 1000)
        })
    )

    const secret = encoder.encode(JWT_SECRET)

    // Simple HMAC-based JWT (for production, use @elysiajs/jwt)
    const signature = await crypto.subtle.sign(
        { name: 'HMAC', hash: 'SHA-256' },
        await crypto.subtle.importKey(
            'raw',
            secret,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        ),
        data
    )

    const base64Header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const base64Payload = btoa(String.fromCharCode(...data))
    const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)))

    return `${base64Header}.${base64Payload}.${base64Signature}`
}

/**
 * Verify and decode JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const [headerB64, payloadB64, signatureB64] = token.split('.')

        const payload = JSON.parse(atob(payloadB64))

        // Check expiration
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            return null
        }

        return payload
    } catch (error) {
        return null
    }
}

/**
 * Convert expiry string to Unix timestamp
 */
function getExpirationTimestamp(expiresIn: string): number {
    const now = Math.floor(Date.now() / 1000)
    const match = expiresIn.match(/^(\d+)([smhd])$/)

    if (!match) return now + 7 * 24 * 60 * 60 // default 7 days

    const value = parseInt(match[1])
    const unit = match[2]

    const multipliers: Record<string, number> = {
        's': 1,
        'm': 60,
        'h': 60 * 60,
        'd': 24 * 60 * 60
    }

    return now + value * multipliers[unit]
}
