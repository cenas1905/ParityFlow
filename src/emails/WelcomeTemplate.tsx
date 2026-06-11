import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';

interface WelcomeTemplateProps {
  firstName: string;
}

export const WelcomeTemplate: React.FC<Readonly<WelcomeTemplateProps>> = ({
  firstName,
}) => (
  <Html>
    <Head />
    <Preview>Welcome to ParityFlow! Maximize your global revenue.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to ParityFlow, {firstName}!</Heading>
        <Text style={text}>
          We're thrilled to have you on board. ParityFlow is designed to help you 
          increase your sales in emerging markets by offering smart Purchasing Power Parity (PPP) discounts.
        </Text>
        <Text style={text}>
          To get started, simply add a new project in your dashboard, configure your discount tiers, 
          and embed the script tag into your website. It takes less than 5 minutes!
        </Text>
        <Link href="https://parityflow.dev/dashboard" style={button}>
          Go to Dashboard
        </Link>
        <Text style={footer}>
          If you have any questions, simply reply to this email. We'd love to help!
          <br />- The ParityFlow Team
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#09090b',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  width: '580px',
  backgroundColor: '#18181b',
  borderRadius: '8px',
  border: '1px solid #27272a',
};

const h1 = {
  color: '#f4f4f5',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
};

const text = {
  color: '#a1a1aa',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 20px',
};

const button = {
  backgroundColor: '#6366f1',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '14px 0',
  marginTop: '32px',
  marginBottom: '32px',
};

const footer = {
  color: '#71717a',
  fontSize: '14px',
  lineHeight: '22px',
  marginTop: '20px',
};

export default WelcomeTemplate;
