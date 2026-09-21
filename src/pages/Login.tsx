import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Zap, Shield } from "lucide-react";
import { GreenFundMark, GreenFundWordmark } from "../components/GreenFundLogo";
import { useApp, type Role } from "../context/AppContext";

const demoAccounts = [
  {
    role: "supporter" as Role,
    email: "supporter@demo.com",
    name: "Budi Wicaksono",
    label: "Supporter",
    desc: "Browse projects, fund, view impact",
    avatar: "BW",
    color: "#4CAF50",
    bg: "#E7F5EA",
    destination: "/dashboard/supporter",
  },
  {
    role: "owner" as Role,
    email: "owner@demo.com",
    name: "Yayasan Pendidikan Nusantara",
    label: "Project Owner",
    desc: "Manage projects, post updates",
    avatar: "YP",
    color: "#1F8A8C",
    bg: "#E0F5F5",
    destination: "/dashboard/owner",
  },
  {
    role: "admin" as Role,
    email: "admin@demo.com",
    name: "Admin GreenFund",
    label: "Admin",
    desc: "Review & approve projects",
    avatar: "AG",
    color: "#8B5CF6",
    bg: "#EDE9FE",
    destination: "/admin",
  },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const { login, loginAs } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = login(email, password);
    if (ok) {
      const account = demoAccounts.find(a => a.email === email.toLowerCase());
      navigate(account?.destination || "/");
    } else {
      setError("Email or password is incorrect. Use a demo account below.");
    }
  };

  const handleDemo = (role: Role, destination: string) => {
    loginAs(role);
    navigate(destination);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#14432B] via-[#1a5436] to-[#1E2A26] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #4CAF50 0%, transparent 60%), radial-gradient(circle at 80% 20%, #1F8A8C 0%, transparent 50%)" }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <GreenFundMark size={40} />
            <GreenFundWordmark dark size="lg" />
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Indonesia's Clean Energy<br />Investment Platform
          </h2>
          <p className="text-white/60 leading-relaxed">
            Fund solar schools, micro-hydro villages, and wind cooperatives. Track every kilowatt you generate — in real time.
          </p>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-2 gap-4">
          {[
            { icon: Zap, label: "Clean Energy", value: "14.2 GWh" },
            { icon: Shield, label: "OJK Licensed", value: "Regulated" },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <s.icon size={18} className="text-[#4CAF50] mb-2" />
              <div className="text-lg font-bold text-white">{s.value}</div>
              <div className="text-xs text-white/50">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <GreenFundMark size={28} />
            <GreenFundWordmark size="md" />
          </div>

          <h1 className="text-2xl font-bold text-[#1E2A26] mb-1">Welcome back</h1>
          <p className="text-sm text-[#9CA3AF] mb-8">
            New here? <Link to="/signup" className="text-[#14432B] font-medium hover:underline">Create an account</Link>
          </p>

          {/* Demo shortcuts — the key feature for judges */}
          <div className="bg-[#E7F5EA] rounded-2xl p-4 mb-6 border border-[#4CAF50]/20">
            <p className="text-xs font-semibold text-[#14432B] mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-pulse" />
              Demo Accounts — one click to explore
            </p>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map(d => (
                <button
                  key={d.role}
                  onClick={() => handleDemo(d.role, d.destination)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white hover:shadow-card-hover transition-all duration-150 active:scale-[0.96] border border-transparent hover:border-[#E5E8E4] group"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white transition-transform group-hover:scale-105"
                    style={{ backgroundColor: d.color }}
                  >
                    {d.avatar}
                  </div>
                  <span className="text-[11px] font-semibold text-[#1E2A26]">{d.label}</span>
                  <span className="text-[9px] text-[#9CA3AF] text-center leading-tight">{d.desc}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[#4CAF50]/20">
              <p className="text-[10px] text-[#6B7280]">
                Password: <span className="font-mono font-semibold text-[#14432B]">demo1234</span> for all accounts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#E5E8E4]" />
            <span className="text-xs text-[#9CA3AF]">or sign in with email</span>
            <div className="flex-1 h-px bg-[#E5E8E4]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1E2A26] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="kamu@email.com"
                className="w-full px-4 py-3 rounded-2xl border border-[#E5E8E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50] bg-white transition-colors"
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-[#1E2A26]">Password</label>
                <a href="#" className="text-xs text-[#14432B] hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl border border-[#E5E8E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50] bg-white transition-colors pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#14432B] hover:bg-[#1a5436] text-white font-semibold text-sm transition-colors active:scale-[0.96] duration-150 flex items-center justify-center gap-2"
            >
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-xs text-center text-[#9CA3AF] mt-6">
            GreenFund is a competition prototype. All transactions are simulated.{" "}
            <a href="#" className="underline">Terms</a> · <a href="#" className="underline">Privacy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
