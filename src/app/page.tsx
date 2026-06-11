import Link from 'next/link';
import { ArrowRight, Check, Globe, BarChart2, Zap, Shield } from 'lucide-react';
import ParticlesBackground from '@/components/ui/ParticlesBackground';
import SpotlightCard from '@/components/ui/SpotlightCard';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] relative overflow-hidden font-sans">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#09090b]/70 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Zap size={15} className="text-white fill-white" />
          </div>
          <span className="gradient-text font-extrabold tracking-tight">ParityFlow</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="#pricing" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors hidden sm:block">
            Pricing
          </Link>
          <Link href="#faq" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors hidden sm:block">
            FAQ
          </Link>
          <Link href="/login" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:-translate-y-0.5"
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
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

      {/* How It Works Section */}
      <section className="py-24 px-4 max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            Live in <span className="gradient-text">2 Minutes</span>
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto text-sm md:text-base">
            Simple setup with zero maintenance. Get started with three easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Sign Up & Create Project',
              desc: 'Create your account and add your SaaS website as a project in our dashboard.',
            },
            {
              step: '02',
              title: 'Paste One Line of Code',
              desc: 'Copy the script tag and paste it before the closing </body> tag on your site.',
            },
            {
              step: '03',
              title: 'Watch Sales Come In',
              desc: 'Visitors from emerging markets instantly see localized discount coupons and convert.',
            },
          ].map((item) => (
            <SpotlightCard key={item.step} className="p-8 flex flex-col justify-between hover:border-white/10 transition-all duration-300">
              <div>
                <div className="text-4xl font-black text-indigo-500/20 mb-4 tracking-tight">{item.step}</div>
                <h3 className="font-bold text-white text-lg mb-3">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* Features Section */}
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

      {/* Pricing Section */}
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

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {[
            {
              q: 'How does the IP detection work?',
              a: 'We use high-speed edge network functions (like Vercel Edge) to detect the \'x-vercel-ip-country\' header. It\'s instantaneous and doesn\'t require external API calls or cookies.'
            },
            {
              q: 'Will this slow down my website?',
              a: 'Not at all. The widget is injected asynchronously and is incredibly lightweight (< 10kb). It won\'t block your page rendering.'
            },
            {
              q: 'Does it work with Stripe / LemonSqueezy?',
              a: 'Yes! You create the coupon codes in your own payment gateway (Stripe, LemonSqueezy, Paddle), and simply paste the code names into our dashboard. When users click "Claim", the widget copies the code to their clipboard.'
            },
            {
              q: 'Can I change the colors and text?',
              a: 'Absolutely. You can customize the primary color, theme (dark, light, glass), banner position, and all the text directly from your dashboard.'
            }
          ].map((faq, i) => (
            <SpotlightCard key={i} className="p-6 hover:border-white/10 transition-all duration-300">
              <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-8 text-zinc-500 text-sm relative z-10 bg-[#09090b]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <Zap size={12} className="text-white fill-white" />
              </div>
              <span className="text-white">ParityFlow</span>
            </Link>
            <p className="text-zinc-400 max-w-xs leading-relaxed">
              Helping SaaS founders globally maximize their revenue through smart, automated Purchasing Power Parity pricing.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Start Trial</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto text-center border-t border-white/5 pt-8">
          <p>© {new Date().getFullYear()} ParityFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
