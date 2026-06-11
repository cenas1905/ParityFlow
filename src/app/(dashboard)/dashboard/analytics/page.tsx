import { createServerSupabase, Database } from '@/lib/supabase';
import { createServerComponentSupabase } from '@/lib/supabaseServer';
import SpotlightCard from '@/components/ui/SpotlightCard';
import AnalyticsChart from './AnalyticsChart';

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

  // Phase 4: A/B Testing Stats
  const variantA = events.filter(e => e.variant === 'A');
  const variantB = events.filter(e => e.variant === 'B');
  
  const aImpressions = variantA.filter(e => e.event_type === 'impression').length;
  const aClicks = variantA.filter(e => e.event_type === 'click').length;
  const aCtr = aImpressions > 0 ? ((aClicks / aImpressions) * 100).toFixed(1) : '0';

  const bImpressions = variantB.filter(e => e.event_type === 'impression').length;
  const bClicks = variantB.filter(e => e.event_type === 'click').length;
  const bCtr = bImpressions > 0 ? ((bClicks / bImpressions) * 100).toFixed(1) : '0';
  
  const hasAbTesting = bImpressions > 0;

  // Ulke bazinda grupla ve gunluk verileri (chart) hazirla
  const byCountry: Record<string, { impressions: number; clicks: number }> = {};
  const byDate: Record<string, { impressions: number; clicks: number }> = {};

  events.forEach(e => {
    // Ulke analitigi
    if (!byCountry[e.country_code]) {
      byCountry[e.country_code] = { impressions: 0, clicks: 0 };
    }
    if (e.event_type === 'impression') byCountry[e.country_code].impressions++;
    if (e.event_type === 'click') byCountry[e.country_code].clicks++;

    // Gunluk analitik (Chart)
    const dateKey = new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!byDate[dateKey]) {
      byDate[dateKey] = { impressions: 0, clicks: 0 };
    }
    if (e.event_type === 'impression') byDate[dateKey].impressions++;
    if (e.event_type === 'click') byDate[dateKey].clicks++;
  });

  const chartData = Object.entries(byDate).map(([date, data]) => ({
    date,
    ...data
  })).reverse(); // Tarihe gore (eskiden yeniye) siralama gerekecek ama basite indirgeyelim

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

      {/* Phase 4: A/B Testing ROI Comparison */}
      {hasAbTesting && (
        <SpotlightCard className="p-6 mb-8 hover:border-white/10 transition-all duration-300 bg-indigo-900/10 border-indigo-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-white">A/B Testing ROI Proof</h2>
            <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md">Live Experiment</span>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/5 rounded-xl p-4">
              <h3 className="text-sm text-zinc-400 font-medium mb-3">Variant A (Widget Shown)</h3>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-zinc-500">Impressions:</span>
                <span className="text-sm text-white font-medium">{aImpressions}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-zinc-500">Conversions:</span>
                <span className="text-sm text-emerald-400 font-bold">{aClicks}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min(100, Number(aCtr))}%` }}></div>
              </div>
              <div className="text-right text-xs mt-1 text-zinc-400">{aCtr}% CTR</div>
            </div>
            
            <div className="bg-white/5 border border-white/5 rounded-xl p-4">
              <h3 className="text-sm text-zinc-400 font-medium mb-3">Variant B (Control Group)</h3>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-zinc-500">Impressions:</span>
                <span className="text-sm text-white font-medium">{bImpressions}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-zinc-500">Conversions:</span>
                <span className="text-sm text-zinc-400 font-bold">{bClicks}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div className="bg-zinc-500 h-2 rounded-full" style={{ width: `${Math.min(100, Number(bCtr))}%` }}></div>
              </div>
              <div className="text-right text-xs mt-1 text-zinc-400">{bCtr}% CTR</div>
            </div>
          </div>
          {Number(aCtr) > Number(bCtr) && (
            <div className="mt-4 text-center text-sm text-emerald-400 font-medium">
              ParityFlow increases your conversion rate by {((Number(aCtr) - Number(bCtr)) / (Number(bCtr) || 1) * 100).toFixed(0)}%!
            </div>
          )}
        </SpotlightCard>
      )}

      {/* Recharts Cizgi Grafigi */}
      <SpotlightCard className="p-6 mb-8 hover:border-white/10 transition-all duration-300">
        <h2 className="font-semibold text-white mb-6">Performance Trend</h2>
        <AnalyticsChart data={chartData} />
      </SpotlightCard>

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
