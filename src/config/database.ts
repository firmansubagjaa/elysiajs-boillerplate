import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from './env'

// PostgreSQL connection
const client = postgres(env.get('DATABASE_URL'))

// Drizzle instance
export const db = drizzle({ client })

// Export for use in services
export { client }
