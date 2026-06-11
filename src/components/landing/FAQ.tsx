import SpotlightCard from '@/components/ui/SpotlightCard';

export default function FAQ() {
  return (
    <section id="faq" className="py-24 px-4 max-w-3xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-4">
        {[
          {
            q: 'How does the IP detection work?',
            a: "We use high-speed edge network functions (like Vercel Edge) to detect the 'x-vercel-ip-country' header. It's instantaneous and doesn't require external API calls or cookies."
          },
          {
            q: 'Will this slow down my website?',
            a: "Not at all. The widget is injected asynchronously and is incredibly lightweight (< 10kb). It won't block your page rendering."
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
  );
}
