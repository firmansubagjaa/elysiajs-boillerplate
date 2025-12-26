import { Elysia } from 'elysia'

export const loggerMiddleware = new Elysia({ name: 'logger' })
    .onRequest((context) => {
        const url = new URL(context.request.url)
        console.log(`[${new Date().toISOString()}] ${context.request.method} ${url.pathname}`)
    })
    .onAfterResponse((context) => {
        const url = new URL(context.request.url)
        console.log(`[${new Date().toISOString()}] ${context.request.method} ${url.pathname} - ${context.set.status}`)
    })
