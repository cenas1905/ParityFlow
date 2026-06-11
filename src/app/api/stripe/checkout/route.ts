import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerSupabase } from '@/lib/supabase';
import { createServerComponentSupabase } from '@/lib/supabaseServer';

export async function POST() {
  try {
    const supabase = createServerComponentSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const serverSupabase = createServerSupabase();
    
    // Mevcut Stripe musterisini kontrol et
    const { data: profile } = (await serverSupabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single()) as unknown as { data: { stripe_customer_id: string | null; email: string } | null };

    let customerId = profile?.stripe_customer_id;

    // Stripe musterisi yoksa olustur
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      // Supabase'e kaydet
      await serverSupabase
        .from('profiles')
        .update({ stripe_customer_id: customerId } as unknown as never)
        .eq('id', user.id);
    }

    // Checkout session olustur
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      subscription_data: {
        trial_period_days: 14, // 14 gunluk ucretsiz deneme
        metadata: {
          supabase_user_id: user.id,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
