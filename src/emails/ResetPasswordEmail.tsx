import {
    Html,
    Head,
    Body,
    Container,
    Heading,
    Text,
    Button,
    Hr
} from '@react-email/components'

interface ResetPasswordEmailProps {
    resetUrl: string
}

export default function ResetPasswordEmail({ resetUrl }: ResetPasswordEmailProps) {
    return (
        <Html>
            <Head />
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Reset Your Password</Heading>

                    <Text style={text}>
                        We received a request to reset your password for your Tivity account.
                    </Text>

                    <Text style={text}>
                        Click the button below to create a new password:
                    </Text>

                    <Button style={button} href={resetUrl}>
                        Reset Password
                    </Button>

                    <Text style={text}>
                        This link will expire in 1 hour for security reasons.
                    </Text>

                    <Hr style={hr} />

                    <Text style={footer}>
                        If you didn't request a password reset, you can safely ignore this email.
                        Your password will remain unchanged.
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif'
}

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px'
}

const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '40px 0',
    padding: '0'
}

const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px'
}

const button = {
    backgroundColor: '#dc3545',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px 24px'
}

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0'
}

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px'
}
