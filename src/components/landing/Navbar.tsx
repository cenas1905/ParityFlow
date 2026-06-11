import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Navbar() {
  return (
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
  );
}
