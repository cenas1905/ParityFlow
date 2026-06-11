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
    const { data: profile } = (await serverSupabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()) as unknown as { data: { stripe_customer_id: string | null } | null };

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 400 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Portal error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
