import { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Leaf, Users, Zap, TrendingUp, Shield, Globe2, Bell, Filter } from "lucide-react";
import {
  AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { formatRupiah } from "../data/projects";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";

const platformMetrics = [
  { month: "Apr", funded: 6.8 },
  { month: "May", funded: 8.2 },
  { month: "Jun", funded: 11.4 },
  { month: "Jul", funded: 14.6 },
  { month: "Aug", funded: 19.2 },
];

export default function AdminDashboard() {
  const { pendingProjects, approveProject, rejectProject, requestRevision } = useApp();
  const [revisionModal, setRevisionModal] = useState<string | null>(null);
  const [revisionNote, setRevisionNote] = useState("");

  const queue = pendingProjects.filter(p => p.status === "pending");
  const processed = pendingProjects.filter(p => p.status !== "pending");

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-[#1E2A26] px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1F8A8C] flex items-center justify-center">
                  <Shield size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">Platform Administration</p>
                  <h2 className="text-white font-semibold">Admin Panel</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {queue.length > 0 && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                    {queue.length} pending review
                  </span>
                )}
                <button className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Notifications">
                  <Bell size={16} className="text-white" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: TrendingUp, label: "Total Raised", value: "Rp 42.8B", sub: "+19% this month", color: "#4CAF50" },
                { icon: Leaf, label: "CO₂ Reduced", value: "8,420 t", sub: "since launch", color: "#1F8A8C" },
                { icon: Users, label: "Total Users", value: "24,912", sub: "14,800 supporters", color: "#F59E0B" },
                { icon: Globe2, label: "Active Projects", value: "38", sub: "17 provinces", color: "#8B5CF6" },
              ].map(m => (
                <div key={m.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: m.color + "30" }}>
                    <m.icon size={16} style={{ color: m.color }} />
                  </div>
                  <div className="text-xl font-bold text-white mb-0.5">{m.value}</div>
                  <div className="text-xs text-white/60">{m.label}</div>
                  <div className="text-xs text-white/40">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Verification Queue */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-[#1E2A26]">Verification Queue</h3>
                    <p className="text-xs text-[#9CA3AF]">{queue.length} project{queue.length !== 1 ? "s" : ""} pending review</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#F4F4F0] text-[#6B7280] hover:bg-[#E5E8E4] transition-colors">
                    <Filter size={12} /> Filter
                  </button>
                </div>

                {queue.length === 0 ? (
                  <div className="text-center py-10">
                    <CheckCircle2 size={32} className="text-[#4CAF50] mx-auto mb-3" />
                    <p className="font-medium text-[#1E2A26]">All caught up!</p>
                    <p className="text-sm text-[#9CA3AF]">No projects pending review.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {queue.map(p => (
                      <div key={p.id} className="border border-[#E5E8E4] rounded-2xl p-4 hover:border-[#14432B]/30 transition-colors">
                        <div className="flex items-start gap-4">
                          <img src={p.image} alt={p.title} className="w-14 h-14 rounded-xl object-cover shrink-0 outline outline-1 -outline-offset-1 outline-black/10" />
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-[#1E2A26] text-sm">{p.title}</h4>
                              <span className="text-xs text-[#9CA3AF] shrink-0">{p.submitted}</span>
                            </div>
                            <p className="text-xs text-[#6B7280] mb-2">{p.org} · {p.location}</p>
                            <div className="flex items-center gap-3 mb-3">
                              <span className="px-2 py-0.5 rounded-full text-xs bg-[#E7F5EA] text-[#14432B] font-medium capitalize">{p.category}</span>
                              <span className="text-xs text-[#9CA3AF]">Goal: {formatRupiah(p.goal)}</span>
                              <span className={`flex items-center gap-1 text-xs font-medium ${p.docs ? "text-[#4CAF50]" : "text-[#F59E0B]"}`}>
                                {p.docs ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                                {p.docs ? "Docs complete" : "Missing docs"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Shield size={12} className="text-[#14432B]" />
                              <span className="text-xs text-[#6B7280]">Trust: <span className="font-medium text-[#1E2A26]">{p.trustScore}/100</span></span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => approveProject(p.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#14432B] hover:bg-[#1a5436] transition-colors active:scale-[0.96] duration-150"
                          >
                            <CheckCircle2 size={13} /> Approve
                          </button>
                          <button
                            onClick={() => { setRevisionModal(p.id); }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-[#D97706] bg-[#FEF3C7] hover:bg-[#FDE68A] transition-colors"
                          >
                            <AlertCircle size={13} /> Request Revision
                          </button>
                          <button
                            onClick={() => rejectProject(p.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] transition-colors"
                          >
                            <XCircle size={13} /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {processed.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-[#E5E8E4]">
                    <h4 className="text-xs font-semibold text-[#9CA3AF] mb-3">Processed</h4>
                    {processed.map(p => (
                      <div key={p.id} className="flex items-center justify-between py-2 border-b border-[#E5E8E4] last:border-0">
                        <span className="text-xs text-[#6B7280] truncate flex-1 mr-3">{p.title}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                          p.status === "approved" ? "bg-[#E7F5EA] text-[#14432B]" :
                          p.status === "rejected" ? "bg-[#FEF2F2] text-[#DC2626]" : "bg-[#FEF3C7] text-[#D97706]"
                        }`}>
                          {p.status === "approved" ? "✓ Approved — now live in Explore" : p.status === "rejected" ? "✗ Rejected" : "⚠ Revision Sent"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Funding Analytics */}
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <h3 className="font-semibold text-[#1E2A26] mb-1">Global Funding Analytics</h3>
                <p className="text-xs text-[#9CA3AF] mb-6">Monthly platform funding (billion Rp)</p>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={platformMetrics} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1F8A8C" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#1F8A8C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EE" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={35} />
                    <Tooltip />
                    <Area type="monotone" dataKey="funded" stroke="#1F8A8C" strokeWidth={2.5} fill="url(#adminGrad)" name="Billion Rp" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <div className="bg-[#14432B] rounded-3xl p-6">
                <h3 className="font-semibold text-white mb-4">Environmental Impact</h3>
                <div className="space-y-4">
                  {[
                    { label: "Total CO₂ Avoided", value: "8,420 t", pct: 84, icon: Leaf, color: "#4CAF50" },
                    { label: "Energy Generated", value: "14.2 GWh", pct: 71, icon: Zap, color: "#F59E0B" },
                    { label: "Communities Powered", value: "127", pct: 63, icon: Users, color: "#1F8A8C" },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <item.icon size={14} style={{ color: item.color }} />
                        <span className="text-xs text-white/70 flex-1">{item.label}</span>
                        <span className="text-xs font-bold text-white">{item.value}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10">
                        <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/30 mt-4 pt-3 border-t border-white/10">vs. 2030 national target</p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-card">
                <h3 className="font-semibold text-[#1E2A26] mb-4">User Monitoring</h3>
                <div className="space-y-3">
                  {[
                    { label: "Total Supporters", value: "14,800", change: "+842 this week" },
                    { label: "Project Owners", value: "112", change: "+18 this month" },
                    { label: "Active Projects", value: "38", change: "+4 this week" },
                    { label: "Pending Verification", value: `${queue.length}`, change: queue.length > 0 ? "Needs attention" : "All clear" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#E5E8E4] last:border-0">
                      <div>
                        <div className="text-sm font-medium text-[#1E2A26]">{item.value}</div>
                        <div className="text-xs text-[#9CA3AF]">{item.label}</div>
                      </div>
                      <span className="text-[10px] font-medium text-[#4CAF50]">{item.change}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-card">
                <h3 className="font-semibold text-[#1E2A26] mb-4">Admin Activity Log</h3>
                <div className="space-y-3">
                  {processed.slice(-3).map((p, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <span className={`font-medium px-2 py-0.5 rounded-full shrink-0 ${
                        p.status === "approved" ? "bg-[#E7F5EA] text-[#14432B]" :
                        p.status === "rejected" ? "bg-[#FEF2F2] text-[#DC2626]" : "bg-[#FEF3C7] text-[#D97706]"
                      }`}>
                        {p.status === "approved" ? "Approved" : p.status === "rejected" ? "Rejected" : "Revision"}
                      </span>
                      <span className="text-[#6B7280] truncate flex-1">{p.title}</span>
                      <span className="text-[#9CA3AF] shrink-0">just now</span>
                    </div>
                  ))}
                  {processed.length === 0 && <p className="text-xs text-[#9CA3AF]">No actions yet this session.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revision Modal */}
      {revisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-elevated">
            <h2 className="text-xl font-bold text-[#1E2A26] mb-2">Request Revision</h2>
            <p className="text-sm text-[#9CA3AF] mb-6">Explain what needs to be corrected before approval.</p>
            <textarea
              value={revisionNote}
              onChange={e => setRevisionNote(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[#E5E8E4] text-sm h-32 resize-none mb-6 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"
              placeholder="e.g. Please provide certified financial statements and a detailed impact methodology..."
            />
            <div className="flex gap-3">
              <button onClick={() => { setRevisionModal(null); setRevisionNote(""); }}
                className="flex-1 py-3 rounded-2xl border border-[#E5E8E4] text-sm font-medium text-[#6B7280] hover:bg-[#FAFAF7] transition-colors">
                Cancel
              </button>
              <button
                onClick={() => { requestRevision(revisionModal); setRevisionModal(null); setRevisionNote(""); }}
                className="flex-1 py-3 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-semibold transition-colors active:scale-[0.96] duration-150"
              >
                Send Revision Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
