import { NextResponse, NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerSupabase } from '@/lib/supabase';
import Stripe from 'stripe';

// Stripe webhook imzasini dogrula
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new NextResponse('Missing stripe signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature error:', err);
    return new NextResponse('Webhook error', { status: 400 });
  }

  const supabase = createServerSupabase();

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        await supabase
          .from('profiles')
          .update({
            subscription_status: status,
            stripe_subscription_id: subscription.id,
          } as unknown as never)
          .eq('stripe_customer_id', customerId);

        console.log(`Subscription ${status} for customer ${customerId}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        
        await supabase
          .from('profiles')
          .update({ subscription_status: 'past_due' } as unknown as never)
          .eq('stripe_customer_id', customerId);
        
        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }
  } catch (err) {
    console.error('Webhook processing error:', err);
    return new NextResponse('Processing error', { status: 500 });
  }

  return NextResponse.json({ received: true });
}
