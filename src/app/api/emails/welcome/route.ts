import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import WelcomeTemplate from '@/emails/WelcomeTemplate';

// Ensure the API key exists
const resend = new Resend(process.env.RESEND_API_KEY || 're_default');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName } = body;

    if (!email || !firstName) {
      return NextResponse.json({ error: 'Email and firstName are required' }, { status: 400 });
    }

    // Send email using Resend and the React template
    const { data, error } = await resend.emails.send({
      from: 'ParityFlow <onboarding@resend.dev>', // Use custom domain in production
      to: email,
      subject: 'Welcome to ParityFlow!',
      react: WelcomeTemplate({ firstName }),
    });

    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in welcome email route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
