import { db } from '@/config/database'
import { users, type User, type SafeUser } from '@/models/user.model'
import { eq } from 'drizzle-orm'

export class UserService {
    /**
     * Find user by ID
     */
    async findById(id: number): Promise<SafeUser | null> {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1)

        if (!user) return null

        const { password: _, ...safeUser } = user
        return safeUser
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<SafeUser | null> {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)

        if (!user) return null

        const { password: _, ...safeUser } = user
        return safeUser
    }

    /**
     * Update user profile
     */
    async updateProfile(id: number, data: Partial<Omit<User, 'id' | 'password'>>): Promise<SafeUser> {
        const [updated] = await db
            .update(users)
            .set({
                ...data,
                updatedAt: new Date()
            })
            .where(eq(users.id, id))
            .returning()

        const { password: _, ...safeUser } = updated
        return safeUser
    }

    /**
     * Delete user account
     */
    async deleteAccount(id: number): Promise<void> {
        await db.delete(users).where(eq(users.id, id))
    }

    /**
     * Verify email
     */
    async verifyEmail(id: number): Promise<SafeUser> {
        const [updated] = await db
            .update(users)
            .set({
                emailVerified: true,
                updatedAt: new Date()
            })
            .where(eq(users.id, id))
            .returning()

        const { password: _, ...safeUser } = updated
        return safeUser
    }
}

export const userService = new UserService()
