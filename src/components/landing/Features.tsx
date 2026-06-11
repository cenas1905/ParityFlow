import { Globe, BarChart2, Zap, Shield } from 'lucide-react';
import SpotlightCard from '@/components/ui/SpotlightCard';

export default function Features() {
  return (
    <section className="py-24 px-4 max-w-5xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
          Everything You Need to Convert Globally
        </h2>
        <p className="text-zinc-400 max-w-lg mx-auto text-sm md:text-base">
          Engineered for speed, privacy, and maximum conversion rates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { icon: Globe, title: 'Automatic IP Location Detection', desc: "Detect visitors' country instantly using high-speed edge networks. No cookies or tracker scripts required." },
          { icon: BarChart2, title: 'Granular Analytics Dashboard', desc: 'Monitor impressions, coupon copies, and click-through rates (CTR) by country in real-time.' },
          { icon: Zap, title: 'Shadow DOM Widget Isolation', desc: "Widget is completely encapsulated in a Shadow DOM. It will never conflict with or break your site's styles." },
          { icon: Shield, title: 'Subscription Security Paywall', desc: 'The script safely references subscription status at edge node, preventing unauthorized API usage.' },
        ].map((f) => {
          const Icon = f.icon;
          return (
            <SpotlightCard key={f.title} className="p-6 flex gap-5 hover:border-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={22} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
}
