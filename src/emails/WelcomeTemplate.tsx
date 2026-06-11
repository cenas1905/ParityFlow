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
  Section,
  Img,
} from '@react-email/components';

interface WelcomeTemplateProps {
  firstName: string;
}

export const WelcomeTemplate: React.FC<Readonly<WelcomeTemplateProps>> = ({
  firstName = 'Founder',
}) => (
  <Html>
    <Head />
    <Preview>Welcome to ParityFlow — Unlock global revenue.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <div style={logoWrapper}>
            <div style={logoIcon}>⚡</div>
            <Text style={logoText}>ParityFlow</Text>
          </div>
        </Section>
        
        <Section style={contentBox}>
          <Heading style={heading}>Welcome aboard, {firstName}.</Heading>
          
          <Text style={paragraph}>
            We're thrilled to have you join us. ParityFlow is engineered to seamlessly optimize your pricing across the globe through smart Purchasing Power Parity (PPP).
          </Text>
          
          <Text style={paragraph}>
            By localizing your checkout experience, you're not just expanding your reach—you're building a truly global product. To begin capturing lost revenue, configure your discount tiers in the dashboard.
          </Text>

          <Section style={buttonContainer}>
            <Link href="https://parityflow.dev/dashboard" style={button}>
              Access Dashboard
            </Link>
          </Section>

          <Text style={paragraph}>
            Need assistance integrating the script? Reply directly to this email. We're here to help you scale.
          </Text>

          <Text style={signoff}>
            Best,<br />
            The ParityFlow Team
          </Text>
        </Section>
        
        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} ParityFlow. All rights reserved.<br />
            San Francisco, CA
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  backgroundImage: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f6 100%)',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  padding: '40px 0',
};

const container = {
  margin: '0 auto',
  width: '100%',
  maxWidth: '520px',
};

const logoSection = {
  padding: '24px 0',
  textAlign: 'center' as const,
};

const logoWrapper = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
};

const logoIcon = {
  backgroundColor: '#000',
  color: '#fff',
  width: '24px',
  height: '24px',
  borderRadius: '6px',
  display: 'inline-block',
  textAlign: 'center' as const,
  lineHeight: '24px',
  fontSize: '12px',
};

const logoText = {
  margin: '0',
  fontWeight: '700',
  fontSize: '16px',
  color: '#111827',
  letterSpacing: '-0.5px',
};

const contentBox = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '40px 48px',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
};

const heading = {
  color: '#111827',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '28px',
  margin: '0 0 20px',
  letterSpacing: '-0.5px',
};

const paragraph = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 20px',
};

const buttonContainer = {
  marginTop: '32px',
  marginBottom: '32px',
};

const button = {
  backgroundColor: '#111827',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const signoff = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '24px 0 0',
};

const footer = {
  padding: '32px 0',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '0',
};

export default WelcomeTemplate;
