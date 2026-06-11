import { createServerSupabase, Database } from '@/lib/supabase';
import { createServerComponentSupabase } from '@/lib/supabaseServer';
import SpotlightCard from '@/components/ui/SpotlightCard';

type AnalyticsRow = Database['public']['Tables']['analytics']['Row'];

export default async function AnalyticsPage() {
  const supabase = createServerComponentSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const serverSupabase = createServerSupabase();

  // Kullanicinin tum projelerini al
  const { data: projects } = await serverSupabase
    .from('projects')
    .select('id, name')
    .eq('user_id', user.id);

  const projectIds = ((projects as { id: string }[] | null) || []).map(p => p.id);

  // Son 30 gunun analitigini al
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: analytics } = await serverSupabase
    .from('analytics')
    .select('*')
    .in('project_id', projectIds)
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: false });

  const events = (analytics as AnalyticsRow[] | null) || [];
  const totalImpressions = events.filter(e => e.event_type === 'impression').length;
  const totalClicks = events.filter(e => e.event_type === 'click').length;
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0';

  // Ulke bazinda grupla
  const byCountry: Record<string, { impressions: number; clicks: number }> = {};
  events.forEach(e => {
    if (!byCountry[e.country_code]) {
      byCountry[e.country_code] = { impressions: 0, clicks: 0 };
    }
    if (e.event_type === 'impression') byCountry[e.country_code].impressions++;
    if (e.event_type === 'click') byCountry[e.country_code].clicks++;
  });

  const countryRows = Object.entries(byCountry)
    .sort((a, b) => b[1].impressions - a[1].impressions)
    .slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-zinc-400 mt-1">Last 30 days across all projects</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <SpotlightCard className="p-5 text-center hover:border-white/10 transition-all duration-300">
          <p className="text-3xl font-bold text-indigo-400">{totalImpressions.toLocaleString()}</p>
          <p className="text-sm text-zinc-400 mt-1">Total Impressions</p>
        </SpotlightCard>
        <SpotlightCard className="p-5 text-center hover:border-white/10 transition-all duration-300">
          <p className="text-3xl font-bold text-emerald-400">{totalClicks.toLocaleString()}</p>
          <p className="text-sm text-zinc-400 mt-1">Coupon Copies</p>
        </SpotlightCard>
        <SpotlightCard className="p-5 text-center hover:border-white/10 transition-all duration-300">
          <p className="text-3xl font-bold text-amber-400">{ctr}%</p>
          <p className="text-sm text-zinc-400 mt-1">Click-through Rate</p>
        </SpotlightCard>
      </div>

      {/* Ulke Tablosu */}
      <SpotlightCard className="p-6 hover:border-white/10 transition-all duration-300">
        <h2 className="font-semibold text-white mb-4">Top Countries</h2>
        {countryRows.length === 0 ? (
          <p className="text-zinc-400 text-sm py-8 text-center">
            No data yet. Add the widget to your site to start tracking.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-400 border-b border-white/5">
                <th className="text-left pb-3 font-medium">Country</th>
                <th className="text-right pb-3 font-medium">Impressions</th>
                <th className="text-right pb-3 font-medium">Clicks</th>
                <th className="text-right pb-3 font-medium">CTR</th>
              </tr>
            </thead>
            <tbody>
              {countryRows.map(([country, data]) => (
                <tr key={country} className="border-b border-white/5 last:border-0">
                  <td className="py-3 text-white font-medium">{country}</td>
                  <td className="py-3 text-right text-zinc-400">{data.impressions}</td>
                  <td className="py-3 text-right text-zinc-400">{data.clicks}</td>
                  <td className="py-3 text-right text-zinc-400">
                    {data.impressions > 0
                      ? ((data.clicks / data.impressions) * 100).toFixed(1)
                      : '0'}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SpotlightCard>
    </div>
  );
}
