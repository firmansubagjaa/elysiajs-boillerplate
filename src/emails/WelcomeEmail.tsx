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

interface WelcomeEmailProps {
    username: string
}

export default function WelcomeEmail({ username }: WelcomeEmailProps) {
    return (
        <Html>
            <Head />
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Welcome to Tivity! 🎉</Heading>

                    <Text style={text}>
                        Hi {username},
                    </Text>

                    <Text style={text}>
                        Thank you for joining Tivity! We're excited to have you on board.
                    </Text>

                    <Text style={text}>
                        Get started by exploring our platform and discovering all the features we have to offer.
                    </Text>

                    <Button style={button} href="https://tivity.app/dashboard">
                        Go to Dashboard
                    </Button>

                    <Hr style={hr} />

                    <Text style={footer}>
                        If you have any questions, feel free to reach out to our support team.
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
    backgroundColor: '#5469d4',
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
