import { Link } from "react-router-dom";
import { Leaf, Link as LinkIcon, Globe, AtSign, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1E2A26] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#4CAF50] flex items-center justify-center">
                <Leaf size={16} color="white" />
              </div>
              <span className="font-bold text-lg">GreenFund</span>
            </div>
            <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-xs">
              Indonesia's premier renewable energy crowdfunding platform. Connecting communities with clean energy solutions across the archipelago.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Twitter/X">
                <AtSign size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Instagram">
                <Globe size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <LinkIcon size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Email">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-3">
              {["Explore Projects", "Start a Project", "Impact Portfolio", "How It Works", "Success Stories"].map(item => (
                <li key={item}><Link to="/explore" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {["About Us", "Our Mission", "Team", "Careers", "Press Kit", "Blog"].map(item => (
                <li key={item}><a href="#" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {["Terms of Service", "Privacy Policy", "Investment Disclosure", "Refund Policy", "Contact Us"].map(item => (
                <li key={item}><a href="#" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B7280]">© 2025 GreenFund Indonesia. All rights reserved. OJK Licensed Fintech Platform No. S-123/MS.72/2024</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B7280]">Powered by clean energy</span>
            <Leaf size={12} className="text-[#4CAF50]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
