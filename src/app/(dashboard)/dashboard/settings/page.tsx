import { createServerSupabase, Database } from '@/lib/supabase';
import { createServerComponentSupabase } from '@/lib/supabaseServer';
import { User, CreditCard } from 'lucide-react';
import SpotlightCard from '@/components/ui/SpotlightCard';
import CheckoutButton from '@/components/CheckoutButton';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default async function SettingsPage() {
  const supabase = createServerComponentSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const serverSupabase = createServerSupabase();
  const { data: profile } = (await serverSupabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()) as unknown as { data: Profile | null };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your account and billing options.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <SpotlightCard className="p-6 hover:border-white/10 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4 text-indigo-400">
            <User size={20} />
            <h2 className="font-semibold text-white">Profile Information</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-zinc-500 uppercase font-semibold">Email Address</p>
              <p className="text-sm text-zinc-300 mt-0.5">{profile?.email}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase font-semibold">Full Name</p>
              <p className="text-sm text-zinc-300 mt-0.5">{profile?.full_name || 'N/A'}</p>
            </div>
          </div>
        </SpotlightCard>

        {/* Billing Card */}
        <SpotlightCard className="p-6 hover:border-white/10 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4 text-emerald-400">
            <CreditCard size={20} />
            <h2 className="font-semibold text-white">Subscription & Billing</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-zinc-500 uppercase font-semibold">Current Status</p>
              <p className="text-sm font-semibold text-zinc-300 capitalize mt-0.5">
                {profile?.subscription_status || 'Inactive'}
              </p>
            </div>
            {profile?.stripe_customer_id ? (
              <CheckoutButton
                endpoint="/api/portal"
                label="Manage Billing on Stripe"
                className="bg-white/10 hover:bg-white/15 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors border border-white/5"
              />
            ) : (
              <CheckoutButton
                endpoint="/api/stripe/checkout"
                label="Upgrade to Pro ($19/mo)"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors shadow-lg shadow-indigo-600/20"
              />
            )}
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
