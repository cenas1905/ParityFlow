import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ParticlesBackground from '@/components/ui/ParticlesBackground';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 px-4 text-center">
      {/* Particles Background */}
      <ParticlesBackground className="absolute inset-0 z-0 pointer-events-none" quantity={90} color="99, 102, 241" />

      {/* Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs md:text-sm font-medium px-4 py-1.5 rounded-full mb-8 backdrop-blur-md animate-fade-in">
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-ping" />
          PPP Pricing Widget for SaaS Founders
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-8">
          Sell More in Emerging Markets
          <br />
          <span className="gradient-text">Without Changing Your Pricing</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Add one line of code to your site. We automatically show localized
          discount banners to visitors from India, Turkey, Brazil and 40+ countries.
          Increase emerging market conversions by up to <strong className="text-indigo-400">40%</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href="/signup"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-600/40"
          >
            Start 14-Day Free Trial
            <ArrowRight size={20} />
          </Link>
          <p className="text-zinc-500 text-sm font-medium">No credit card required</p>
        </div>
      </div>
    </section>
  );
}
