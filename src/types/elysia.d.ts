import type { SafeUser } from '../models/user.model'

declare module 'elysia' {
    interface Context {
        user: SafeUser
    }
}
