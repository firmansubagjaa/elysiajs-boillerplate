// Environment configuration with validation
const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
] as const

const optionalEnvVars = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM',
    'NODE_ENV',
] as const

type RequiredEnv = typeof requiredEnvVars[number]
type OptionalEnv = typeof optionalEnvVars[number]

class EnvConfig {
    private env: Record<string, string | undefined>

    constructor() {
        this.env = process.env
        this.validate()
    }

    private validate() {
        const missing: string[] = []

        for (const key of requiredEnvVars) {
            if (!this.env[key]) {
                missing.push(key)
            }
        }

        if (missing.length > 0) {
            throw new Error(
                `Missing required environment variables: ${missing.join(', ')}\n` +
                `Please check your .env file`
            )
        }
    }

    get<K extends RequiredEnv>(key: K): string
    get<K extends OptionalEnv>(key: K): string | undefined
    get(key: string): string | undefined {
        return this.env[key]
    }

    isDevelopment(): boolean {
        return this.env.NODE_ENV !== 'production'
    }

    isProduction(): boolean {
        return this.env.NODE_ENV === 'production'
    }
}

export const env = new EnvConfig()
