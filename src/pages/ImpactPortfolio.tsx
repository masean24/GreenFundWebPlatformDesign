import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Leaf, Users, Star, Award, Download, ChevronRight, TrendingUp, Globe2, Sun, Wind, Droplets } from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";
import { projects, formatRupiah } from "../data/projects";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const impactTimeline = [
  { month: "Jan '25", kwh: 0, co2: 0, communities: 0 },
  { month: "Mar '25", kwh: 820, co2: 1.6, communities: 1 },
  { month: "May '25", kwh: 1240, co2: 2.4, communities: 2 },
  { month: "Jul '25", kwh: 1820, co2: 3.5, communities: 3 },
  { month: "Sep '25", kwh: 2160, co2: 4.2, communities: 3 },
];

const contributionHistory = [
  { project: "Solar Sukamaju School", date: "Jun 2025", amount: 500000, kwh: 584, co2: 0.5 },
  { project: "Micro-Hydro Wae Rebo", date: "Jul 2025", amount: 1000000, kwh: 1314, co2: 1.1 },
  { project: "Biogas Klaten Farmers", date: "Aug 2025", amount: 250000, kwh: 262, co2: 0.2 },
];

const radarData = [
  { axis: "Energy Scale", value: 72 },
  { axis: "CO₂ Impact", value: 84 },
  { axis: "Community\nReach", value: 60 },
  { axis: "Diversity", value: 85 },
  { axis: "Frequency", value: 68 },
];

const achievements = [
  { icon: "🌱", title: "Green Pioneer", desc: "First 5 projects funded", unlocked: true, date: "Jun 2025" },
  { icon: "⚡", title: "Megawatt Milestone", desc: "1,000 kWh generated", unlocked: true, date: "Jul 2025" },
  { icon: "🌍", title: "CO₂ Champion", desc: "4 tons of CO₂ offset", unlocked: true, date: "Aug 2025" },
  { icon: "🏘️", title: "Community Builder", desc: "5+ communities helped", unlocked: false, date: null },
  { icon: "💫", title: "Series Investor", desc: "10 projects funded", unlocked: false, date: null },
  { icon: "🔥", title: "Impact Leader", desc: "Top 1% on platform", unlocked: false, date: null },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E5E8E4] rounded-2xl p-3 shadow-elevated">
        <p className="text-xs font-semibold text-[#1E2A26] mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-xs" style={{ color: p.color }}>
            {p.name}: <span className="font-semibold text-[#1E2A26]">{p.value}{p.name === "co2" ? " t" : p.name === "kwh" ? " kWh" : ""}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ImpactPortfolio() {
  const [activeMetric, setActiveMetric] = useState<"kwh" | "co2" | "communities">("kwh");
  const [showCertModal, setShowCertModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="pt-16">
        {/* Hero — emotional, inspiring */}
        <div className="relative bg-gradient-to-br from-[#0d2e1c] via-[#14432B] to-[#0f2621] overflow-hidden">
          {/* Particles */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#4CAF50] opacity-30"
                style={{
                  left: `${(i * 8.3) % 100}%`,
                  top: `${(i * 7.7 + 20) % 80}%`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle at 10% 50%, #4CAF50 0%, transparent 50%), radial-gradient(circle at 90% 30%, #1F8A8C 0%, transparent 50%)"
          }} />

          <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4CAF50]/20 border border-[#4CAF50]/30 mb-6">
                <Star size={12} className="text-[#4CAF50]" />
                <span className="text-xs font-medium text-[#4CAF50]">Your Signature Impact Feature</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4" style={{ textWrap: "balance" }}>
                Your Environmental<br />Impact Portfolio
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Every rupiah you invested is creating clean energy, reducing carbon, and empowering communities across Indonesia. This is your legacy.
              </p>

              {/* Hero metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Zap, label: "Total Energy Generated", value: "2,160 kWh", sub: "≈ 540 households powered for 1 month", color: "#F59E0B" },
                  { icon: Leaf, label: "CO₂ Offset", value: "4.2 tons", sub: "≈ 12 flights Jakarta–Denpasar", color: "#4CAF50" },
                  { icon: Users, label: "Communities", value: "3 helped", sub: "840+ direct beneficiaries", color: "#1F8A8C" },
                  { icon: TrendingUp, label: "Sustainability Score", value: "78/100", sub: "Top 24% on platform", color: "#8B5CF6" },
                ].map(m => (
                  <div key={m.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: m.color + "25" }}>
                      <m.icon size={16} style={{ color: m.color }} />
                    </div>
                    <div className="text-xl font-bold text-white mb-0.5" style={{ fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
                    <div className="text-xs text-white/60 mb-1">{m.label}</div>
                    <div className="text-[10px] text-white/40">{m.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left — 2 cols */}
            <div className="lg:col-span-2 space-y-6">
              {/* Impact Timeline */}
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-[#1E2A26]">Impact Timeline</h3>
                    <p className="text-xs text-[#9CA3AF]">Your cumulative environmental contribution since first investment</p>
                  </div>
                  <div className="flex gap-1 bg-[#F4F4F0] rounded-xl p-1">
                    {([["kwh", "Energy"], ["co2", "CO₂"], ["communities", "Communities"]] as const).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setActiveMetric(key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeMetric === key ? "bg-white text-[#1E2A26] shadow-card" : "text-[#6B7280]"}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={impactTimeline} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="impactGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EE" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={35} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey={activeMetric}
                      name={activeMetric}
                      stroke="#4CAF50"
                      strokeWidth={2.5}
                      fill="url(#impactGrad)"
                      dot={{ fill: "#4CAF50", strokeWidth: 0, r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Supported Projects */}
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-[#1E2A26]">Supported Projects</h3>
                  <Link to="/explore" className="text-xs font-medium text-[#14432B] flex items-center gap-1 hover:underline">
                    Add more <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="space-y-4">
                  {contributionHistory.map((c, i) => {
                    const proj = projects.find(p => p.title === c.project) || projects[i];
                    return (
                      <div key={i} className="flex items-center gap-4 p-4 bg-[#FAFAF7] rounded-2xl hover:bg-[#E7F5EA] transition-colors">
                        <img src={proj.image} alt={proj.title} className="w-16 h-16 rounded-2xl object-cover shrink-0 outline outline-1 -outline-offset-1 outline-black/10" />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-[#1E2A26] mb-1 line-clamp-1">{c.project}</h4>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs text-[#9CA3AF]">{c.date}</span>
                            <span className="text-xs font-medium text-[#14432B]">{formatRupiah(c.amount)} invested</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Zap size={11} className="text-[#F59E0B]" />
                              <span className="text-xs text-[#6B7280]">{c.kwh} kWh generated</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Leaf size={11} className="text-[#4CAF50]" />
                              <span className="text-xs text-[#6B7280]">{c.co2}t CO₂ saved</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowCertModal(true)}
                          className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border border-[#E5E8E4] hover:bg-[#E7F5EA] hover:border-[#14432B]/30 transition-colors flex items-center gap-1"
                        >
                          <Download size={11} /> Cert
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Environmental equivalents */}
              <div className="bg-[#14432B] rounded-3xl p-6">
                <h3 className="font-semibold text-white mb-2">Your Impact, In Perspective</h3>
                <p className="text-white/60 text-xs mb-6">What your 4.2 tons of CO₂ avoided means in everyday terms</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: "✈️", value: "12", label: "Flights avoided", sub: "Jakarta to Bali" },
                    { icon: "🌳", value: "192", label: "Trees equivalent", sub: "one year of growth" },
                    { icon: "🚗", value: "16,800 km", label: "Car-free travel", sub: "avoided emissions" },
                    { icon: "💡", value: "6,240 days", label: "Light bulb", sub: "powered on clean energy" },
                  ].map(item => (
                    <div key={item.label} className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <div className="text-lg font-bold text-white" style={{ fontVariantNumeric: "tabular-nums" }}>{item.value}</div>
                      <div className="text-xs text-white/80 font-medium">{item.label}</div>
                      <div className="text-[10px] text-white/40">{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Sustainability Score Radar */}
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} className="text-[#4CAF50]" />
                  <h3 className="font-semibold text-[#1E2A26]">Sustainability Profile</h3>
                </div>
                <div className="text-center mb-2">
                  <span className="text-4xl font-bold text-[#14432B]" style={{ fontVariantNumeric: "tabular-nums" }}>78</span>
                  <span className="text-sm text-[#9CA3AF]">/100</span>
                </div>
                <p className="text-xs text-center text-[#9CA3AF] mb-4">Top 24% of all GreenFund investors</p>
                <ResponsiveContainer width="100%" height={180}>
                  <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                    <PolarGrid stroke="#E5E8E4" />
                    <PolarAngleAxis dataKey="axis" tick={{ fontSize: 9, fill: "#9CA3AF" }} />
                    <Radar dataKey="value" stroke="#14432B" fill="#4CAF50" fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1E2A26]">Achievements</h3>
                  <span className="text-xs text-[#9CA3AF]">3/6 unlocked</span>
                </div>
                <div className="space-y-3">
                  {achievements.map((a, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${a.unlocked ? "bg-[#E7F5EA]" : "bg-[#F4F4F0] opacity-60"}`}>
                      <span className="text-2xl">{a.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-[#1E2A26]">{a.title}</div>
                        <div className="text-xs text-[#9CA3AF]">{a.desc}</div>
                      </div>
                      {a.unlocked ? (
                        <div className="text-right">
                          <span className="text-[10px] font-medium text-[#4CAF50]">Earned</span>
                          <div className="text-[10px] text-[#9CA3AF]">{a.date}</div>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-[#E5E8E4] flex items-center justify-center">
                          <span className="text-[10px] text-[#9CA3AF]">🔒</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Certificate preview */}
              <div className="bg-gradient-to-br from-[#14432B] to-[#1a5436] rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={18} className="text-[#4CAF50]" />
                  <h3 className="font-semibold text-white">Impact Certificate</h3>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-white/60 mb-1">Certified Impact Statement</div>
                    <div className="text-white font-semibold text-sm mb-1">Budi Wicaksono</div>
                    <div className="text-[#4CAF50] text-xs font-medium mb-2">has offset <strong>4.2 tons</strong> of CO₂</div>
                    <div className="text-white/50 text-[10px]">via 3 renewable energy projects</div>
                    <div className="text-white/50 text-[10px]">GreenFund · 2025 · OJK Verified</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowCertModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#4CAF50] hover:bg-[#66BB6A] text-white font-semibold text-sm transition-colors active:scale-[0.96] duration-150"
                >
                  <Download size={14} /> Download Certificate
                </button>
              </div>

              {/* Next milestone */}
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <h3 className="font-semibold text-[#1E2A26] mb-4">Next Milestone</h3>
                <div className="text-center">
                  <div className="text-4xl mb-2">🏘️</div>
                  <div className="font-semibold text-[#1E2A26] mb-1">Community Builder</div>
                  <div className="text-xs text-[#9CA3AF] mb-4">Fund 2 more communities to unlock</div>
                  <div className="h-2 rounded-full bg-[#E7F5EA] overflow-hidden mb-2">
                    <div className="h-full rounded-full bg-[#4CAF50]" style={{ width: "60%" }} />
                  </div>
                  <div className="text-xs text-[#9CA3AF]">3 of 5 communities</div>
                </div>
                <Link
                  to="/explore"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#E7F5EA] hover:bg-[#14432B] text-[#14432B] hover:text-white font-semibold text-sm transition-colors"
                >
                  Explore More Projects <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-0 w-full max-w-md shadow-elevated overflow-hidden">
            {/* Certificate design */}
            <div className="bg-gradient-to-br from-[#14432B] to-[#0d2e1c] p-8 text-center relative">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #4CAF50 0%, transparent 70%)" }} />
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#4CAF50]/20 border-2 border-[#4CAF50]/40 flex items-center justify-center mx-auto mb-4">
                  <Leaf size={28} className="text-[#4CAF50]" />
                </div>
                <div className="text-xs font-medium text-white/60 tracking-widest uppercase mb-2">Certificate of Environmental Impact</div>
                <h2 className="text-2xl font-bold text-white mb-1">Budi Wicaksono</h2>
                <p className="text-white/70 text-sm mb-4">has contributed to a greener Indonesia</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xl font-bold text-[#4CAF50]">2,160</div>
                    <div className="text-[10px] text-white/60">kWh generated</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#F59E0B]">4.2t</div>
                    <div className="text-[10px] text-white/60">CO₂ offset</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#1F8A8C]">3</div>
                    <div className="text-[10px] text-white/60">communities</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs text-[#9CA3AF] text-center mb-4">GreenFund Indonesia · Verified 2025 · OJK License No. S-123/MS.72/2024</p>
              <div className="flex gap-3">
                <button onClick={() => setShowCertModal(false)} className="flex-1 py-3 rounded-2xl border border-[#E5E8E4] text-sm font-medium text-[#6B7280] hover:bg-[#F4F4F0] transition-colors">
                  Close
                </button>
                <button onClick={() => setShowCertModal(false)} className="flex-1 py-3 rounded-2xl bg-[#14432B] hover:bg-[#1a5436] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 active:scale-[0.96] duration-150">
                  <Download size={14} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
