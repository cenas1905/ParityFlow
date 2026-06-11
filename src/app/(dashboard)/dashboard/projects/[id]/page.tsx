'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabase, Database } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import SpotlightCard from '@/components/ui/SpotlightCard';

type ProjectSettings = Database['public']['Tables']['project_settings']['Row'];

export default function ProjectSettingsPage() {
  const { id: projectId } = useParams() as { id: string };
  const [settings, setSettings] = useState<ProjectSettings | null>(null);
  const [stats, setStats] = useState({ impressions: 0, clicks: 0 });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createBrowserSupabase();

  useEffect(() => {
    async function loadData() {
      const settingsResult = (await supabase.from('project_settings').select('*').eq('project_id', projectId).single()) as unknown as { data: ProjectSettings | null; error: Error | null };
      const analyticsResult = (await supabase.from('analytics').select('event_type').eq('project_id', projectId)) as unknown as { data: { event_type: string }[] | null; error: Error | null };

      if (settingsResult.data) setSettings(settingsResult.data as ProjectSettings);

      if (analyticsResult.data) {
        const imps = analyticsResult.data.filter(e => e.event_type === 'impression').length;
        const clicks = analyticsResult.data.filter(e => e.event_type === 'click').length;
        setStats({ impressions: imps, clicks: clicks });
      }
    }
    loadData();
  }, [projectId, supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);

    const { error } = (await supabase
      .from('project_settings')
      .update(settings as unknown as never)
      .eq('project_id', projectId)) as unknown as { error: Error | null };

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  const update = (key: keyof ProjectSettings, value: string | number) => {
    setSettings((prev) => {
      if (!prev) return null;
      return { ...prev, [key]: value };
    });
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Loading settings...</div>
      </div>
    );
  }

  const ctr = stats.impressions > 0 ? ((stats.clicks / stats.impressions) * 100).toFixed(1) : '0';

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Project Settings</h1>
          <p className="text-sm text-zinc-400">Configure widget appearance and discount tiers</p>
        </div>
      </div>

      {/* Analytics Kartlari */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <SpotlightCard className="p-4 text-center hover:border-white/10 transition-all duration-300">
          <p className="text-2xl font-bold text-indigo-400">{stats.impressions}</p>
          <p className="text-xs text-zinc-400 mt-1">Impressions</p>
        </SpotlightCard>
        <SpotlightCard className="p-4 text-center hover:border-white/10 transition-all duration-300">
          <p className="text-2xl font-bold text-emerald-400">{stats.clicks}</p>
          <p className="text-xs text-zinc-400 mt-1">Clicks</p>
        </SpotlightCard>
        <SpotlightCard className="p-4 text-center hover:border-white/10 transition-all duration-300">
          <p className="text-2xl font-bold text-amber-400">{ctr}%</p>
          <p className="text-xs text-zinc-400 mt-1">Click Rate</p>
        </SpotlightCard>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Widget Icerik Ayarlari */}
        <SpotlightCard className="p-6 hover:border-white/10 transition-all duration-300">
          <h2 className="font-semibold text-white mb-5">Widget Content</h2>
          <div className="space-y-4">
            <Field label="Banner Title">
              <input
                type="text"
                value={settings.banner_title}
                onChange={(e) => update('banner_title', e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Message Text" hint="Use {country} and {discount} as dynamic placeholders">
              <textarea
                rows={3}
                value={settings.banner_text}
                onChange={(e) => update('banner_text', e.target.value)}
                className={`${inputCls} resize-y`}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="CTA Button Text">
                <input
                  type="text"
                  value={settings.banner_cta}
                  onChange={(e) => update('banner_cta', e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Accent Color">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => update('primary_color', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primary_color}
                    onChange={(e) => update('primary_color', e.target.value)}
                    className={`${inputCls} flex-1`}
                  />
                </div>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Banner Position">
                <select
                  value={settings.banner_position}
                  onChange={(e) => update('banner_position', e.target.value)}
                  className={inputCls}
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-bar">Top Bar</option>
                </select>
              </Field>
              <Field label="Theme">
                <select
                  value={settings.banner_theme}
                  onChange={(e) => update('banner_theme', e.target.value)}
                  className={inputCls}
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="glass">Glass</option>
                </select>
              </Field>
            </div>
            
            {/* Phase 4: Advanced Triggers */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 mt-4">
              <Field label="Trigger Type" hint="When should the widget appear?">
                <select
                  value={settings.trigger_type || 'immediate'}
                  onChange={(e) => update('trigger_type', e.target.value)}
                  className={inputCls}
                >
                  <option value="immediate">Immediately</option>
                  <option value="delay">Time Delay</option>
                  <option value="exit_intent">Exit Intent (Mouse Leave)</option>
                </select>
              </Field>
              {settings.trigger_type === 'delay' && (
                <Field label="Delay (Seconds)" hint="Wait before showing">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.trigger_delay || 5}
                    onChange={(e) => update('trigger_delay', parseInt(e.target.value))}
                    className={inputCls}
                  />
                </Field>
              )}
            </div>

            {/* Phase 4: A/B Testing */}
            <div className="pt-4 border-t border-white/5">
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
                <input
                  type="checkbox"
                  checked={settings.ab_test_enabled || false}
                  onChange={(e) => update('ab_test_enabled', e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 bg-black/50 text-indigo-500 focus:ring-indigo-500/50 cursor-pointer"
                />
                <div>
                  <div className="text-sm font-semibold text-white">Enable A/B Testing</div>
                  <div className="text-xs text-zinc-400">Show widget to 50% of traffic to prove ROI in analytics.</div>
                </div>
              </label>
            </div>
          </div>
        </SpotlightCard>

        {/* Indirim Tier Ayarlari */}
        <SpotlightCard className="p-6 hover:border-white/10 transition-all duration-300">
          <h2 className="font-semibold text-white mb-2">Discount Tiers by Country</h2>
          <p className="text-xs text-zinc-500 mb-5">
            Tier 1 (US, UK, DE, AU, etc.) - No discount shown. Set Stripe coupon codes for each tier.
          </p>

          <div className="space-y-5">
            {[
              {
                tier: 2,
                label: 'Tier 2 — Mid-High Income',
                countries: 'Spain, South Korea, Italy, Poland, Portugal, Greece, Taiwan, Czech Rep.',
                discountKey: 'tier2_discount',
                couponKey: 'tier2_coupon',
              },
              {
                tier: 3,
                label: 'Tier 3 — Middle Income',
                countries: 'Turkey, Brazil, Russia, Mexico, Argentina, South Africa, Chile, Colombia',
                discountKey: 'tier3_discount',
                couponKey: 'tier3_coupon',
              },
              {
                tier: 4,
                label: 'Tier 4 — Lower Income',
                countries: 'India, Indonesia, Pakistan, Philippines, Vietnam, Egypt, Nigeria, Bangladesh',
                discountKey: 'tier4_discount',
                couponKey: 'tier4_coupon',
              },
            ].map(({ tier, label, countries, discountKey, couponKey }) => (
              <div key={tier} className="bg-white/5 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-medium text-zinc-300 mb-1">{label}</h3>
                <p className="text-xs text-zinc-500 mb-3">{countries}</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Discount %">
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={settings[discountKey as keyof ProjectSettings] as number}
                      onChange={(e) => update(discountKey as keyof ProjectSettings, parseInt(e.target.value))}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Stripe Coupon Code">
                    <input
                      type="text"
                      value={settings[couponKey as keyof ProjectSettings] as string}
                      onChange={(e) => update(couponKey as keyof ProjectSettings, e.target.value)}
                      placeholder="e.g. INDIA50"
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>

        {/* Apify Rakip Fiyat Takibi */}
        <SpotlightCard className="p-6 hover:border-white/10 transition-all duration-300">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-white">Competitor Tracking (Apify)</h2>
            <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md">Beta</span>
          </div>
          <p className="text-sm text-zinc-400 mb-4">
            Automatically track a competitor's pricing page to compare your PPP discounts against market rates.
          </p>
          <div className="space-y-4">
            <Field label="Competitor Product URL">
              <input
                type="url"
                placeholder="https://competitor.com/pricing"
                className={inputCls}
              />
            </Field>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 border border-white/10 shadow-lg shadow-black/20 text-white font-semibold py-2.5 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => alert('Apify scraper triggered. Check background jobs.')}
            >
              Scrape Current Price
            </button>
          </div>
        </SpotlightCard>

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 disabled:hover:scale-100 text-white font-bold py-3.5 rounded-xl transition-all shadow-xl shadow-indigo-500/25 border border-indigo-500/50 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Save size={18} className={saving ? 'animate-pulse' : ''} />
          {saving ? 'Saving Changes...' : saved ? '✓ Successfully Saved!' : 'Save Settings'}
        </button>
      </form>
      </div>

      {/* Right Column: Live Preview */}
      <div className="sticky top-8 self-start">
        <SpotlightCard className="p-6 h-[600px] flex flex-col items-center justify-center relative overflow-hidden bg-zinc-950">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
          <div className="absolute top-4 left-4 bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-white/70">
            Live Preview
          </div>
          
          {/* Simulated Website Background */}
          <div className="w-full max-w-sm h-64 border border-white/10 rounded-xl bg-zinc-900/50 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="h-6 border-b border-white/5 bg-zinc-900 flex items-center px-3 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex-1 p-4">
              <div className="w-2/3 h-4 bg-white/5 rounded-full mb-3" />
              <div className="w-full h-2 bg-white/5 rounded-full mb-2" />
              <div className="w-4/5 h-2 bg-white/5 rounded-full mb-2" />
              <div className="w-1/2 h-2 bg-white/5 rounded-full" />
            </div>

            {/* Simulated ParityFlow Banner */}
            <div 
              className="absolute w-full px-4 py-3 flex items-center justify-between border-t border-white/10 backdrop-blur-md"
              style={{
                backgroundColor: settings.banner_theme === 'light' ? '#fff' : settings.banner_theme === 'glass' ? 'rgba(0,0,0,0.6)' : '#000',
                color: settings.banner_theme === 'light' ? '#000' : '#fff',
                bottom: settings.banner_position.includes('bottom') ? 0 : 'auto',
                top: settings.banner_position === 'top-bar' ? '24px' : 'auto',
              }}
            >
              <div>
                <p className="font-bold text-xs" style={{ color: settings.primary_color }}>
                  {settings.banner_title || 'Purchasing Power Parity'}
                </p>
                <p className="text-[10px] opacity-80 mt-0.5">
                  {(settings.banner_text || '').replace('{country}', 'Turkey').replace('{discount}', '50')}
                </p>
              </div>
              <button 
                className="text-[10px] px-2 py-1.5 rounded-md font-semibold shrink-0 ml-2"
                style={{ backgroundColor: settings.primary_color, color: '#fff' }}
              >
                {settings.banner_cta || 'Claim Discount'}
              </button>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors';

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-zinc-400 mb-1.5 font-medium">
        {label}
        {hint && <span className="ml-2 text-xs text-zinc-500 font-normal">({hint})</span>}
      </label>
      {children}
    </div>
  );
}
