import { useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Users, Zap, Plus, Bell, Settings, ChevronRight, ArrowUpRight, MessageSquare, Edit } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { projects, formatRupiah } from "../data/projects";
import Navbar from "../components/Navbar";

const fundingTimeline = [
  { day: "Aug 1", amount: 12000000 },
  { day: "Aug 5", amount: 28000000 },
  { day: "Aug 10", amount: 54000000 },
  { day: "Aug 15", amount: 87000000 },
  { day: "Aug 20", amount: 112000000 },
  { day: "Aug 25", amount: 134000000 },
  { day: "Aug 28", amount: 142000000 },
];

const supporterGrowth = [
  { week: "W1", supporters: 42 },
  { week: "W2", supporters: 98 },
  { week: "W3", supporters: 174 },
  { week: "W4", supporters: 231 },
  { week: "W5", supporters: 289 },
  { week: "W6", supporters: 312 },
];

const weeklyFunding = [
  { week: "W1", amount: 24 },
  { week: "W2", amount: 38 },
  { week: "W3", amount: 52 },
  { week: "W4", amount: 31 },
  { week: "W5", amount: 44 },
  { week: "W6", amount: 28 },
];

const activities = [
  { icon: "💚", text: "Ahmad Fauzi made a Rp 5,000,000 investment", time: "2h ago" },
  { icon: "📢", text: "Your update 'Solar panels installed on Block A' got 47 likes", time: "1d ago" },
  { icon: "❓", text: "Question from Sari: 'When will Phase 2 begin?'", time: "2d ago" },
  { icon: "✅", text: "Milestone achieved: 75% funding goal reached", time: "3d ago" },
  { icon: "🏅", text: "Your project featured on GreenFund homepage", time: "5d ago" },
];

const pipeline = [
  { title: "Wind Turbines Pantai Selatan — Phase 2", status: "draft", completion: 45 },
  { title: "Biogas Plant Klaten Expansion", status: "review", completion: 80 },
  { title: "Community Solar Makassar", status: "planning", completion: 20 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E5E8E4] rounded-2xl p-3 shadow-elevated">
        <p className="text-xs font-semibold text-[#1E2A26] mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-xs text-[#6B7280]">
            <span style={{ color: p.color }}>●</span> {typeof p.value === "number" && p.value > 1000 ? formatRupiah(p.value * 1_000_000) : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function OwnerDashboard() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateText, setUpdateText] = useState("");
  const ownerProject = projects[0];
  const progress = (ownerProject.raised / ownerProject.goal) * 100;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-[#1E2A26] px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#4CAF50] flex items-center justify-center text-sm font-bold text-white">YP</div>
                <div>
                  <p className="text-white/60 text-xs">Project Owner</p>
                  <h2 className="text-white font-semibold">Yayasan Pendidikan Nusantara</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Notifications">
                  <Bell size={16} className="text-white" />
                </button>
                <Link to="/create" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4CAF50] hover:bg-[#66BB6A] text-white text-sm font-medium transition-colors active:scale-[0.96] duration-150">
                  <Plus size={14} /> New Project
                </Link>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Project Owner Dashboard</h1>
            <p className="text-white/60 text-sm">Manage your active projects and track funding performance.</p>

            {/* Top metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { icon: TrendingUp, label: "Total Raised", value: formatRupiah(ownerProject.raised), sub: `${Math.round(progress)}% of goal`, color: "#4CAF50" },
                { icon: Users, label: "Total Supporters", value: ownerProject.backers.toLocaleString(), sub: "+48 this week", color: "#1F8A8C" },
                { icon: Zap, label: "Energy Online", value: "14.6 kWp", sub: "Phase 1 active", color: "#F59E0B" },
                { icon: ArrowUpRight, label: "Days Remaining", value: `${ownerProject.daysLeft}d`, sub: "until deadline", color: "#8B5CF6" },
              ].map(m => (
                <div key={m.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: m.color + "30" }}>
                    <m.icon size={16} style={{ color: m.color }} />
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
          {/* Post Update CTA */}
          <div className="bg-[#14432B] rounded-3xl p-6 flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#4CAF50]/20 flex items-center justify-center">
                <MessageSquare size={20} className="text-[#4CAF50]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Post Project Update</h3>
                <p className="text-white/60 text-xs">Keep your {ownerProject.backers} supporters informed about project progress.</p>
              </div>
            </div>
            <button
              onClick={() => setShowUpdateModal(true)}
              className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#4CAF50] hover:bg-[#66BB6A] text-white font-semibold text-sm transition-colors active:scale-[0.96] duration-150"
            >
              <Edit size={14} /> Post Update
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Project */}
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1E2A26]">Active Projects</h3>
                  <Link to={`/project/${ownerProject.id}`} className="text-xs font-medium text-[#14432B] flex items-center gap-1 hover:underline">
                    View detail <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="flex items-start gap-4 p-4 bg-[#FAFAF7] rounded-2xl">
                  <img src={ownerProject.image} alt={ownerProject.title} className="w-20 h-20 rounded-2xl object-cover shrink-0 outline outline-1 -outline-offset-1 outline-black/10" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#1E2A26] mb-1">{ownerProject.title}</h4>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-[#E7F5EA] text-[#14432B] font-medium">Active</span>
                      <span className="text-xs text-[#9CA3AF]">{ownerProject.daysLeft} days left</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#E7F5EA] overflow-hidden mb-1">
                      <div className="h-full rounded-full bg-[#4CAF50]" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-[#4CAF50] font-medium">{Math.round(progress)}% funded</span>
                      <span className="text-[#9CA3AF]">{formatRupiah(ownerProject.raised)} of {formatRupiah(ownerProject.goal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Funding Performance Chart */}
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-[#1E2A26]">Funding Performance</h3>
                    <p className="text-xs text-[#9CA3AF]">Cumulative funds raised (million Rp)</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#E7F5EA] text-[#14432B] font-medium">Aug 2025</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={fundingTimeline} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="fundGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14432B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#14432B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EE" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={v => `${(v/1000000).toFixed(0)}M`} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={38} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="amount" stroke="#14432B" strokeWidth={2.5} fill="url(#fundGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Supporter Growth + Weekly Funding */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 shadow-card">
                  <h3 className="font-semibold text-[#1E2A26] mb-1">Supporter Growth</h3>
                  <p className="text-xs text-[#9CA3AF] mb-4">New backers per week</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={supporterGrowth} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EE" vertical={false} />
                      <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="supporters" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-card">
                  <h3 className="font-semibold text-[#1E2A26] mb-1">Funding Analytics</h3>
                  <p className="text-xs text-[#9CA3AF] mb-4">Weekly amount (million Rp)</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={weeklyFunding} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EE" vertical={false} />
                      <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#1F8A8C" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6">
              {/* Project Pipeline */}
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1E2A26]">Project Pipeline</h3>
                  <Link to="/create" className="text-xs font-medium text-[#14432B] flex items-center gap-1 hover:underline">
                    New <Plus size={12} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {pipeline.map((p, i) => (
                    <div key={i} className="p-3 bg-[#FAFAF7] rounded-2xl">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-medium text-[#1E2A26] line-clamp-1">{p.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          p.status === "review" ? "bg-[#FEF3C7] text-[#D97706]" :
                          p.status === "draft" ? "bg-[#F4F4F0] text-[#6B7280]" : "bg-[#EDE9FE] text-[#7C3AED]"
                        }`}>
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#E5E8E4] overflow-hidden">
                        <div className="h-full rounded-full bg-[#14432B]" style={{ width: `${p.completion}%` }} />
                      </div>
                      <div className="text-[10px] text-[#9CA3AF] mt-1">{p.completion}% complete</div>
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
                      <span className="text-base shrink-0">{a.icon}</span>
                      <div>
                        <p className="text-xs text-[#6B7280] leading-relaxed">{a.text}</p>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-elevated">
            <h2 className="text-xl font-bold text-[#1E2A26] mb-2">Post Project Update</h2>
            <p className="text-sm text-[#9CA3AF] mb-6">Update your {ownerProject.backers} supporters on project progress.</p>
            <input className="w-full px-4 py-3 rounded-2xl border border-[#E5E8E4] text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]" placeholder="Update title" />
            <textarea
              value={updateText}
              onChange={e => setUpdateText(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[#E5E8E4] text-sm h-32 resize-none mb-6 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"
              placeholder="Share what's happening with your project..."
            />
            <div className="flex gap-3">
              <button onClick={() => setShowUpdateModal(false)} className="flex-1 py-3 rounded-2xl border border-[#E5E8E4] text-sm font-medium text-[#6B7280] hover:bg-[#FAFAF7] transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowUpdateModal(false)} className="flex-1 py-3 rounded-2xl bg-[#14432B] hover:bg-[#1a5436] text-white text-sm font-semibold transition-colors active:scale-[0.96] duration-150">
                Publish Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
