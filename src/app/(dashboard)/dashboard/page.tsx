import { createServerSupabase, Database } from '@/lib/supabase';
import { createServerComponentSupabase } from '@/lib/supabaseServer';
import ProjectsList from './ProjectsList';
import SpotlightCard from '@/components/ui/SpotlightCard';
import CheckoutButton from '@/components/CheckoutButton';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default async function DashboardPage() {
  const supabase = createServerComponentSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const serverSupabase = createServerSupabase();

  const [{ data: profile }, { data: projects }] = await Promise.all([
    serverSupabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    serverSupabase
      .from('projects')
      .select('*, project_settings(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ]);

  const profileData = profile as Profile | null;
  const projectsData = projects as Database['public']['Tables']['projects']['Row'][] | null;

  const isSubscribed =
    profileData?.subscription_status === 'active' ||
    profileData?.subscription_status === 'trialing';

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {profileData?.full_name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-zinc-400 mt-1">
          Manage your PPP widgets and track recovered revenue.
        </p>
      </div>

      {/* Subscription Banner (aktif degilse goster) */}
      {!isSubscribed && (
        <div className="glass p-5 mb-6 border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-amber-400">Subscription Required</h3>
              <p className="text-sm text-zinc-400 mt-0.5">
                Activate your plan to enable your widgets on live sites.
              </p>
            </div>
            <UpgradeButton />
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <SpotlightCard className="p-5">
          <p className="text-sm text-zinc-400 mb-1">Total Projects</p>
          <p className="text-3xl font-bold text-white">{projectsData?.length || 0}</p>
        </SpotlightCard>
        <SpotlightCard className="p-5">
          <p className="text-sm text-zinc-400 mb-1">Plan Status</p>
          <p className="text-3xl font-bold text-white capitalize">
            {profileData?.subscription_status || 'Inactive'}
          </p>
        </SpotlightCard>
        <SpotlightCard className="p-5">
          <p className="text-sm text-zinc-400 mb-1">Active Widgets</p>
          <p className="text-3xl font-bold text-white">
            {isSubscribed ? (projectsData?.filter(p => p.is_active).length || 0) : 0}
          </p>
        </SpotlightCard>
      </div>

      {/* Projects */}
      <ProjectsList
        initialProjects={projectsData || []}
        userId={user.id}
        isSubscribed={isSubscribed}
      />
    </div>
  );
}

function UpgradeButton() {
  return (
    <CheckoutButton
      endpoint="/api/stripe/checkout"
      label="Upgrade Now →"
      className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
    />
  );
}
