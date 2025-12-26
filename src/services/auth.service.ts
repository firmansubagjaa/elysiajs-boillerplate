import { db } from '@/config/database'
import { users, type NewUser, type SafeUser } from '@/models/user.model'
import { hashPassword, verifyPassword } from '@/utils/password'
import { generateToken } from '@/utils/jwt'
import { isValidEmail } from '@/utils/validation'
import { eq } from 'drizzle-orm'

export class AuthService {
    /**
     * Register a new user
     */
    async register(data: NewUser): Promise<{ user: SafeUser; token: string }> {
        // Validate email
        if (!isValidEmail(data.email)) {
            throw new Error('Invalid email address')
        }

        // Check if user already exists
        const existing = await db
            .select()
            .from(users)
            .where(eq(users.email, data.email))
            .limit(1)

        if (existing.length > 0) {
            throw new Error('Email already registered')
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password)

        // Create user
        const [user] = await db
            .insert(users)
            .values({
                ...data,
                password: hashedPassword
            })
            .returning()

        // Generate JWT token
        const token = await generateToken({
            userId: user.id,
            email: user.email
        })

        // Remove password from response
        const { password: _, ...safeUser } = user

        return { user: safeUser, token }
    }

    /**
     * Login user
     */
    async login(email: string, password: string): Promise<{ user: SafeUser; token: string }> {
        // Find user by email
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)

        if (!user) {
            throw new Error('Invalid email or password')
        }

        // Verify password
        const valid = await verifyPassword(password, user.password)
        if (!valid) {
            throw new Error('Invalid email or password')
        }

        // Generate token
        const token = await generateToken({
            userId: user.id,
            email: user.email
        })

        // Remove password
        const { password: _, ...safeUser } = user

        return { user: safeUser, token }
    }

    /**
     * Verify token and get user
     */
    async verifyAuth(token: string): Promise<SafeUser | null> {
        const { verifyToken } = await import('@/utils/jwt')

        const payload = await verifyToken(token)
        if (!payload || !payload.userId) {
            return null
        }

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, payload.userId))
            .limit(1)

        if (!user) return null

        const { password: _, ...safeUser } = user
        return safeUser
    }
}

export const authService = new AuthService()
