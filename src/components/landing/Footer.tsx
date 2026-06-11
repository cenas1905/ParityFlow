import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
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
  );
}
