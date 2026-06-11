import SpotlightCard from '@/components/ui/SpotlightCard';

export default function HowItWorks() {
  return (
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
  );
}
