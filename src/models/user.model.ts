import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name'),
    password: text('password').notNull(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// Type inference for TypeScript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

// Safe user type (without password)
export type SafeUser = Omit<User, 'password'>
