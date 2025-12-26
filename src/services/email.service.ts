import nodemailer from 'nodemailer'
import { render } from '@react-email/components'
import { createElement } from 'react'
import { env } from '@/config/env'

export class EmailService {
    private transporter: nodemailer.Transporter | null = null

    constructor() {
        this.initializeTransporter()
    }

    private initializeTransporter() {
        const smtpHost = process.env.SMTP_HOST
        const smtpUser = process.env.SMTP_USER
        const smtpPass = process.env.SMTP_PASS

        if (!smtpHost || !smtpUser || !smtpPass) {
            console.warn('Email service not configured. Emails will not be sent.')
            return
        }

        this.transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(env.get('SMTP_PORT') || '587'),
            secure: false,
            auth: {
                user: smtpUser,
                pass: smtpPass
            }
        })
    }

    /**
     * Send welcome email
     */
    async sendWelcomeEmail(to: string, name: string): Promise<void> {
        if (!this.transporter) {
            console.log(`[Email Simulation] Welcome email to: ${to}`)
            return
        }

        const { default: WelcomeEmail } = await import('@/emails/WelcomeEmail')
        const html = await render(createElement(WelcomeEmail, { username: name }))

        await this.transporter.sendMail({
            from: env.get('SMTP_FROM') || 'noreply@tivity.app',
            to,
            subject: 'Welcome to Tivity!',
            html
        })
    }

    /**
     * Send password reset email
     */
    async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
        if (!this.transporter) {
            console.log(`[Email Simulation] Reset password email to: ${to}`)
            console.log(`[Email Simulation] Reset token: ${resetToken}`)
            return
        }

        const { default: ResetPasswordEmail } = await import('@/emails/ResetPasswordEmail')
        const resetUrl = `${process.env.APP_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
        const html = await render(createElement(ResetPasswordEmail, { resetUrl }))

        await this.transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@tivity.app',
            to,
            subject: 'Reset Your Password',
            html
        })
    }
}

export const emailService = new EmailService()
