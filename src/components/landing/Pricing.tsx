import Link from 'next/link';
import { Check } from 'lucide-react';
import SpotlightCard from '@/components/ui/SpotlightCard';

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 relative z-10">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Simple Pricing</h2>
        <p className="text-zinc-400 mb-12">One transparent plan with everything included.</p>

        <SpotlightCard className="p-10 border border-indigo-500/30 glow-primary bg-[#121215]/80 hover:border-indigo-500/50 transition-all duration-500">
          <div className="inline-block bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold px-3.5 py-1 rounded-full mb-6 uppercase tracking-wider">
            Unlimited Plan
          </div>
          <div className="text-5xl font-black text-white mb-2 tracking-tight">
            $19<span className="text-zinc-500 text-xl font-normal">/mo</span>
          </div>
          <p className="text-zinc-400 mb-8 text-sm">Unlimited projects, widget displays, and page views.</p>
          <ul className="space-y-4 mb-8 text-left">
            {[
              'Unlimited websites & projects',
              'Unlimited monthly impressions',
              'Real-time analytics dashboard',
              'Custom discount tiers & styling',
              'Widget content localization settings',
              '14-day free trial (cancel anytime)',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm">
                <Check size={16} className="text-emerald-400 flex-shrink-0" />
                <span className="text-zinc-300 font-medium">{feature}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all text-center shadow-lg shadow-indigo-600/35"
          >
            Start Free Trial →
          </Link>
        </SpotlightCard>
      </div>
    </section>
  );
}
