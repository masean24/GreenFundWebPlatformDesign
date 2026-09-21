import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Leaf, Users, TrendingUp, Award, Bell, Settings, ChevronRight, Sun, Wind, Droplets, Star, ArrowUpRight } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { projects, formatRupiah } from "../data/projects";
import Navbar from "../components/Navbar";

const impactGrowth = [
  { month: "Jan", kwh: 420, co2: 0.8 },
  { month: "Feb", kwh: 640, co2: 1.2 },
  { month: "Mar", kwh: 820, co2: 1.6 },
  { month: "Apr", kwh: 980, co2: 1.9 },
  { month: "May", kwh: 1240, co2: 2.4 },
  { month: "Jun", kwh: 1480, co2: 2.9 },
  { month: "Jul", kwh: 1820, co2: 3.5 },
  { month: "Aug", kwh: 2160, co2: 4.2 },
];

const portfolioBreakdown = [
  { name: "Solar", value: 45, color: "#F59E0B" },
  { name: "Micro-Hydro", value: 28, color: "#06B6D4" },
  { name: "Wind", value: 18, color: "#3B82F6" },
  { name: "Biogas", value: 9, color: "#8B5CF6" },
];

const achievements = [
  { icon: "🌱", title: "Green Pioneer", desc: "First 5 projects funded", unlocked: true },
  { icon: "⚡", title: "Megawatt Milestone", desc: "1,000+ kWh generated", unlocked: true },
  { icon: "🌍", title: "CO₂ Champion", desc: "2t of CO₂ offset", unlocked: true },
  { icon: "🏘️", title: "Community Builder", desc: "3+ communities helped", unlocked: false },
  { icon: "🔥", title: "Series Investor", desc: "Fund 10 projects", unlocked: false },
  { icon: "💚", title: "Impact Leader", desc: "Top 1% on platform", unlocked: false },
];

const myProjects = [
  { ...projects[0], invested: 500000, returns: 12.4 },
  { ...projects[1], invested: 1000000, returns: 18.7 },
  { ...projects[2], invested: 250000, returns: 6.2 },
];

const activities = [
  { icon: "💚", text: "Your investment generated 147 kWh at Sukamaju School", time: "2h ago" },
  { icon: "📢", text: "Project update from Wae Rebo: turbine installed!", time: "1d ago" },
  { icon: "🏆", text: "You earned the 'Megawatt Milestone' achievement", time: "3d ago" },
  { icon: "🌱", text: "New recommended project: Solar for Desa Kering, NTT", time: "5d ago" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E5E8E4] rounded-2xl p-3 shadow-elevated">
        <p className="text-xs font-semibold text-[#1E2A26] mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-xs text-[#6B7280]">
            <span style={{ color: p.color }}>●</span> {p.name}: <span className="font-medium text-[#1E2A26]">{p.value}{p.name === "co2" ? "t" : " kWh"}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SupporterDashboard() {
  const [activeChart, setActiveChart] = useState<"kwh" | "co2">("kwh");

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#14432B] via-[#1a5436] to-[#1E2A26] px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-full bg-[#4CAF50] flex items-center justify-center text-sm font-bold text-white">BW</div>
                  <div>
                    <p className="text-white/60 text-xs">Welcome back,</p>
                    <h1 className="text-white font-semibold text-lg">Budi Wicaksono</h1>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Notifications">
                  <Bell size={16} className="text-white" />
                </button>
                <button className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Settings">
                  <Settings size={16} className="text-white" />
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Energy Impact Portfolio</h2>
              <p className="text-white/60 text-sm">Your environmental contribution across {myProjects.length} active projects</p>
            </div>

            {/* Hero metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { icon: Zap, label: "Clean Energy Generated", value: "2,160 kWh", sub: "+147 kWh today", color: "#F59E0B", delta: "+12%" },
                { icon: Leaf, label: "CO₂ Reduced", value: "4.2 tons", sub: "this year", color: "#4CAF50", delta: "+0.3t" },
                { icon: Users, label: "Communities Impacted", value: "3", sub: "schools & villages", color: "#1F8A8C", delta: "active" },
                { icon: TrendingUp, label: "Projects Supported", value: "3", sub: `${formatRupiah(1750000)} invested`, color: "#8B5CF6", delta: "funded" },
              ].map(m => (
                <div key={m.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: m.color + "30" }}>
                      <m.icon size={16} style={{ color: m.color }} />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">{m.delta}</span>
                  </div>
                  <div className="text-xl font-bold text-white mb-0.5" style={{ fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
                  <div className="text-xs text-white/60">{m.label}</div>
                  <div className="text-xs text-white/40">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Impact Growth Chart */}
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-[#1E2A26]">Impact Growth</h3>
                    <p className="text-xs text-[#9CA3AF]">Cumulative clean energy generated</p>
                  </div>
                  <div className="flex gap-1 bg-[#F4F4F0] rounded-xl p-1">
                    <button
                      onClick={() => setActiveChart("kwh")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeChart === "kwh" ? "bg-white text-[#1E2A26] shadow-card" : "text-[#6B7280]"}`}
                    >
                      Energy (kWh)
                    </button>
                    <button
                      onClick={() => setActiveChart("co2")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeChart === "co2" ? "bg-white text-[#1E2A26] shadow-card" : "text-[#6B7280]"}`}
                    >
                      CO₂ (tons)
                    </button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={impactGrowth} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EE" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={35} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey={activeChart}
                      name={activeChart === "kwh" ? "kwh" : "co2"}
                      stroke="#4CAF50"
                      strokeWidth={2.5}
                      fill="url(#greenGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Portfolio Breakdown */}
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <h3 className="font-semibold text-[#1E2A26] mb-1">Portfolio Breakdown</h3>
                <p className="text-xs text-[#9CA3AF] mb-6">Energy type distribution</p>
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={portfolioBreakdown} innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                        {portfolioBreakdown.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-3">
                    {portfolioBreakdown.map(item => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-[#6B7280]">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-20 rounded-full bg-[#F4F4F0] overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                          </div>
                          <span className="text-xs font-semibold text-[#1E2A26] w-8 text-right">{item.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* My Projects */}
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-[#1E2A26]">Active Investments</h3>
                  <Link to="/explore" className="text-xs font-medium text-[#14432B] flex items-center gap-1 hover:underline">
                    Add more <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="space-y-4">
                  {myProjects.map(p => (
                    <div key={p.id} className="flex items-center gap-4 p-4 bg-[#FAFAF7] rounded-2xl hover:bg-[#E7F5EA] transition-colors">
                      <img src={p.image} alt={p.title} className="w-14 h-14 rounded-xl object-cover shrink-0 outline outline-1 -outline-offset-1 outline-black/10" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-[#1E2A26] truncate">{p.title}</h4>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#E7F5EA] overflow-hidden mb-1">
                          <div className="h-full rounded-full bg-[#4CAF50]" style={{ width: `${(p.raised / p.goal) * 100}%` }} />
                        </div>
                        <div className="flex gap-3">
                          <span className="text-xs text-[#9CA3AF]">Invested: <span className="font-medium text-[#1E2A26]">{formatRupiah(p.invested)}</span></span>
                          <span className="text-xs text-[#4CAF50] font-medium">+{p.returns}% impact</span>
                        </div>
                      </div>
                      <Link to={`/project/${p.id}`}>
                        <ArrowUpRight size={16} className="text-[#9CA3AF] hover:text-[#14432B] transition-colors" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Sustainability Score */}
              <div className="bg-[#14432B] rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={16} className="text-[#4CAF50]" />
                  <span className="text-sm font-semibold text-white">Sustainability Score</span>
                </div>
                <div className="text-5xl font-bold text-white mb-1" style={{ fontVariantNumeric: "tabular-nums" }}>78</div>
                <p className="text-white/60 text-xs mb-4">Top 24% of investors</p>
                <div className="space-y-2">
                  {[
                    { label: "Portfolio Diversity", score: 85 },
                    { label: "Investment Frequency", score: 72 },
                    { label: "Community Impact", score: 90 },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-white/70">{item.label}</span>
                        <span className="text-xs text-white/70">{item.score}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/20">
                        <div className="h-full rounded-full bg-[#4CAF50]" style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1E2A26]">Achievements</h3>
                  <span className="text-xs text-[#9CA3AF]">3/6 unlocked</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {achievements.map((a, i) => (
                    <div key={i} className={`text-center p-3 rounded-2xl transition-all ${a.unlocked ? "bg-[#E7F5EA]" : "bg-[#F4F4F0] opacity-50"}`}>
                      <div className="text-2xl mb-1">{a.icon}</div>
                      <div className="text-xs font-semibold text-[#1E2A26] leading-tight">{a.title}</div>
                      <div className="text-[10px] text-[#9CA3AF] mt-0.5">{a.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <h3 className="font-semibold text-[#1E2A26] mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {activities.map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-lg shrink-0">{a.icon}</span>
                      <div>
                        <p className="text-xs text-[#6B7280] leading-relaxed">{a.text}</p>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended */}
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <h3 className="font-semibold text-[#1E2A26] mb-4">Recommended for You</h3>
                {projects.filter(p => p.status === "active").slice(3, 5).map(p => (
                  <Link key={p.id} to={`/project/${p.id}`} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F4F4F0] transition-colors mb-2 last:mb-0">
                    <img src={p.image} alt={p.title} className="w-12 h-12 rounded-xl object-cover shrink-0 outline outline-1 -outline-offset-1 outline-black/10" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#1E2A26] truncate">{p.title}</p>
                      <p className="text-[10px] text-[#9CA3AF]">{p.daysLeft}d left · {Math.round((p.raised/p.goal)*100)}% funded</p>
                    </div>
                    <ChevronRight size={14} className="text-[#9CA3AF] shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
