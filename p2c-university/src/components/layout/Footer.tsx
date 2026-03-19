import { Link } from "wouter";
import { Twitter, Instagram, Youtube, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border footer-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          <div className="flex flex-col gap-6 lg:pr-8">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <img 
                src={`${import.meta.env.BASE_URL}images/logo.png`} 
                alt="Clippers University" 
                className="h-10 w-auto object-contain drop-shadow-lg" 
              />
              <span className="font-display font-bold text-xl tracking-tight text-white">Clippers University</span>
            </Link>
            <p className="text-blue-200/70 leading-relaxed">
              The premier platform connecting elite short-form creators with top brands. Turn your views into revenue.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/8 border border-white/12 flex items-center justify-center text-blue-200/60 hover:text-white hover:bg-white/15 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/8 border border-white/12 flex items-center justify-center text-blue-200/60 hover:text-white hover:bg-white/15 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/8 border border-white/12 flex items-center justify-center text-blue-200/60 hover:text-white hover:bg-white/15 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-6 text-white">Platform</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/campaigns" className="text-blue-200/60 hover:text-white transition-colors">Campaign Marketplace</Link></li>
              <li><Link href="/pricing" className="text-blue-200/60 hover:text-white transition-colors">Pricing &amp; Tiers</Link></li>
              <li><Link href="/case-studies" className="text-blue-200/60 hover:text-white transition-colors">Creator Success</Link></li>
              <li><Link href="/dashboard" className="text-blue-200/60 hover:text-white transition-colors">Analytics Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-6 text-white">Company</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/about" className="text-blue-200/60 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-blue-200/60 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="text-blue-200/60 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/book-a-call" className="text-blue-200/60 hover:text-white transition-colors">Book a Demo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-6 text-white">Stay Updated</h4>
            <p className="text-blue-200/60 mb-4">Get the latest high-paying campaigns directly in your inbox.</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-200/40" />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-white/8 border border-white/15 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400/40 transition-all"
                />
              </div>
              <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-md shadow-primary/30">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        <div className="mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-blue-200/50 text-sm">
            © {new Date().getFullYear()} Clippers University. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-blue-200/50">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
