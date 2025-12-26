import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './user.model'

export const sessions = pgTable('sessions', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
})

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
