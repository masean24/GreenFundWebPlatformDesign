import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Heart, Building2, ChevronLeft } from "lucide-react";
import { GreenFundMark, GreenFundWordmark } from "../components/GreenFundLogo";
import { useApp } from "../context/AppContext";

type SignupRole = "supporter" | "owner";
type Step = 1 | 2;

export default function Signup() {
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<SignupRole | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { loginAs } = useApp();
  const navigate = useNavigate();

  const handleRoleSelect = (r: SignupRole) => {
    setRole(r);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate signup — log them in with the chosen role
    loginAs(role);
    if (role === "owner") {
      navigate("/dashboard/owner");
    } else {
      navigate("/dashboard/supporter");
    }
  };

  const roles = [
    {
      value: "supporter" as SignupRole,
      icon: Heart,
      emoji: "🤝",
      title: "Supporter",
      subtitle: "Fund clean energy projects",
      points: [
        "Browse & filter all projects",
        "Fund from Rp 50,000",
        "Track your CO₂ impact",
        "Earn sustainability achievements",
      ],
      color: "#4CAF50",
      bg: "bg-[#E7F5EA]",
      border: "border-[#4CAF50]",
      cta: "Join as Supporter",
    },
    {
      value: "owner" as SignupRole,
      icon: Building2,
      emoji: "🏗️",
      title: "Project Owner",
      subtitle: "Raise funds for your project",
      points: [
        "Submit your energy project",
        "Receive donations & investments",
        "Post progress updates",
        "Get verified OJK trust score",
      ],
      color: "#1F8A8C",
      bg: "bg-[#E0F5F5]",
      border: "border-[#1F8A8C]",
      cta: "Join as Project Owner",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <GreenFundMark size={30} />
          <GreenFundWordmark size="md" />
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                s < step ? "bg-[#4CAF50] text-white" : s === step ? "bg-[#14432B] text-white" : "bg-[#E5E8E4] text-[#9CA3AF]"
              }`}>{s}</div>
              {s < 2 && <div className={`w-12 h-px ${s < step ? "bg-[#4CAF50]" : "bg-[#E5E8E4]"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1 — role selection */}
        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#1E2A26] mb-2">Join GreenFund</h1>
              <p className="text-[#9CA3AF] text-sm">Choose how you want to participate in Indonesia's clean energy future.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {roles.map(r => (
                <button
                  key={r.value}
                  onClick={() => handleRoleSelect(r.value)}
                  className={`text-left p-6 rounded-3xl border-2 bg-white hover:shadow-card-hover transition-all duration-150 active:scale-[0.98] group hover:border-current`}
                  style={{ "--tw-border-opacity": 1 } as React.CSSProperties}
                >
                  <div className={`w-14 h-14 rounded-2xl ${r.bg} flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition-transform`}>
                    {r.emoji}
                  </div>
                  <h3 className="text-lg font-bold text-[#1E2A26] mb-1">{r.title}</h3>
                  <p className="text-sm text-[#9CA3AF] mb-5">{r.subtitle}</p>
                  <ul className="space-y-2 mb-5">
                    {r.points.map(pt => (
                      <li key={pt} className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <div
                    className="w-full py-3 rounded-2xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-opacity group-hover:opacity-90"
                    style={{ backgroundColor: r.color }}
                  >
                    {r.cta} <ArrowRight size={15} />
                  </div>
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-[#9CA3AF]">
              Already have an account? <Link to="/login" className="text-[#14432B] font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        )}

        {/* Step 2 — account details */}
        {step === 2 && role && (
          <div className="bg-white rounded-3xl p-8 shadow-card max-w-md mx-auto">
            <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-[#9CA3AF] hover:text-[#1E2A26] mb-6 transition-colors">
              <ChevronLeft size={16} /> Back
            </button>

            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 ${
              role === "supporter" ? "bg-[#E7F5EA] text-[#14432B]" : "bg-[#E0F5F5] text-[#1F8A8C]"
            }`}>
              {role === "supporter" ? "🤝 Supporter Account" : "🏗️ Project Owner Account"}
            </div>

            <h2 className="text-xl font-bold text-[#1E2A26] mb-6">Create your account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E2A26] mb-1.5">
                  {role === "owner" ? "Organization / Community Name" : "Full Name"}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={role === "owner" ? "e.g. Yayasan Energi Hijau" : "e.g. Budi Santoso"}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E5E8E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50] bg-white transition-colors"
                  required
                />
              </div>

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
                <label className="block text-sm font-medium text-[#1E2A26] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="w-full px-4 py-3 rounded-2xl border border-[#E5E8E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50] bg-white transition-colors pr-11"
                    minLength={8}
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

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm transition-colors active:scale-[0.96] duration-150 flex items-center justify-center gap-2"
                style={{ backgroundColor: role === "supporter" ? "#14432B" : "#1F8A8C" }}
              >
                Create Account <ArrowRight size={16} />
              </button>
            </form>

            <p className="text-xs text-center text-[#9CA3AF] mt-4">
              By signing up, you agree to our{" "}
              <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
