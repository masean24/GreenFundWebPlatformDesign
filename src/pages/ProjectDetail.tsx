import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, Users, Clock, Zap, Leaf, CheckCircle2, Star, ChevronRight, Shield, Award, CreditCard, Smartphone, Building, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { formatRupiah } from "../data/projects";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useApp } from "../context/AppContext";
import { useT } from "../i18n/LanguageContext";

const updates = [
  { date: "28 Aug 2025", title: "Solar panels installed on Block A", desc: "All 24 panels on the main school building are now operational. We generated our first 147 kWh yesterday!", icon: "✅" },
  { date: "15 Aug 2025", title: "Construction begins", desc: "The installation team from PT Solar Nusantara arrived. Foundation work for panel mounts completed.", icon: "🔨" },
  { date: "3 Aug 2025", title: "Equipment shipped from Jakarta", desc: "240W monocrystalline panels and inverter systems loaded from Tanjung Priok port. ETA Sulawesi: 5 days.", icon: "📦" },
];

const timeline = [
  { phase: "Community Survey", status: "done", date: "Mar 2025" },
  { phase: "OJK Approval", status: "done", date: "May 2025" },
  { phase: "Fundraising", status: "active", date: "Jun–Sep 2025" },
  { phase: "Installation", status: "active", date: "Aug 2025" },
  { phase: "Commissioning", status: "pending", date: "Oct 2025" },
  { phase: "Impact Report", status: "pending", date: "Jan 2026" },
];

const BEFORE_AFTER: Record<string, { before: string[]; after: string[] }> = {
  solar: {
    before: [
      "🔴 Genset diesel: Rp 3.2M/bulan biaya BBM",
      "🌑 Pemadaman 4–8 jam/hari saat solar habis",
      "💨 Emisi asap langsung di area belajar siswa",
      "⚠️ Risiko kebakaran dari genset tua berkarat",
    ],
    after: [
      "✅ Energi surya gratis setelah payback 4 tahun",
      "⚡ Suplai 24/7 dengan sistem baterai 30 kWh",
      "🌿 Nol emisi CO₂ — hemat 42 ton/tahun",
      "🏆 Jadi contoh sekolah energi bersih di provinsi",
    ],
  },
  wind: {
    before: [
      "🔴 Ketergantungan pada jaringan PLN yang tidak stabil",
      "🌑 Pemadaman bergilir hingga 6 jam sehari",
      "💸 Biaya listrik menguras 30% anggaran operasional",
      "🏚️ Produktivitas UMKM terhambat akibat voltase rendah",
    ],
    after: [
      "✅ Turbin angin hasilkan 1.2 MWh/hari di musim angin",
      "⚡ Tegangan stabil — mesin UMKM bisa berjalan penuh",
      "🌿 Kurangi emisi 38 ton CO₂/tahun",
      "💰 Tagihan listrik turun rata-rata 70% per bulan",
    ],
  },
  hydro: {
    before: [
      "🕯️ 3 desa mengandalkan lilin dan lampu minyak tanah",
      "💸 Rp 800.000/keluarga/bulan untuk minyak tanah",
      "🌑 Anak-anak tidak bisa belajar malam hari",
      "🏥 Puskesmas tidak bisa simpan vaksin tanpa pendingin",
    ],
    after: [
      "✅ Mikro-hidro 20 kW → listrik 24/7 tanpa gangguan",
      "💡 1.800 jiwa di 3 desa kini teraliri listrik bersih",
      "📚 Jam belajar anak meningkat 3 jam/hari",
      "🏥 Puskesmas bisa operasi rantai dingin vaksin",
    ],
  },
  biogas: {
    before: [
      "💩 Limbah ternak 12 ton/hari tidak terkelola",
      "☠️ Pencemaran sungai dan sawah sekitar kandang",
      "🔥 Memasak menggunakan kayu bakar 3 jam/hari",
      "💸 Biaya LPG Rp 1.4M/bulan untuk 200 keluarga",
    ],
    after: [
      "✅ Biogas dari limbah → masak gratis 24 jam/hari",
      "🌱 Pupuk organik sisa biogas senilai Rp 600rb/bulan",
      "🌿 Emisi CH₄ tersita — setara 28 ton CO₂/tahun",
      "💧 Sungai kembali bersih — ikan mulai kembali",
    ],
  },
  biomass: {
    before: [
      "🪵 Limbah kayu 8 ton/hari dibakar terbuka",
      "🌫️ Kabut asap mempengaruhi kesehatan 1.200 warga",
      "🔋 600 keluarga bergantung pada genset diesel",
      "💸 Biaya solar industri Rp 15.000/liter",
    ],
    after: [
      "✅ 80 kW biomass power — eliminasi genset diesel",
      "🌿 Emisi CO₂ turun 62 ton/tahun vs pembakaran terbuka",
      "💡 600 keluarga koperasi dapat listrik bersih",
      "♻️ Zero-waste: abu sisa jadi pupuk kebun",
    ],
  },
};

function fireConfetti() {
  const colors = ["#14432B", "#4CAF50", "#66BB6A", "#F59E0B", "#1F8A8C", "#fff"];
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 }, colors });
  setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.6 }, colors }), 350);
  setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors }), 450);
}

type PayStep = "input" | "method" | "processing" | "success";

export default function ProjectDetail() {
  const { id } = useParams();
  const { projects, fundProject } = useApp();
  const { t } = useT();
  const project = projects.find(p => p.id === id) || projects[0];

  const [fundAmount, setFundAmount] = useState("500000");
  const [activeTab, setActiveTab] = useState<"story" | "updates" | "backers">("story");
  const [payStep, setPayStep] = useState<PayStep>("input");
  const [payMethod, setPayMethod] = useState<string>("");
  const [txId] = useState(`GF-${Date.now()}`);

  const progress = Math.min((project.raised / project.goal) * 100, 100);

  const beforeAfter = BEFORE_AFTER[project.category] ?? BEFORE_AFTER.solar;

  const handlePay = () => {
    setPayStep("processing");
    setTimeout(() => {
      fundProject(project.id, Number(fundAmount));
      setPayStep("success");
      fireConfetti();
    }, 2000);
  };

  const tabs = [
    { key: "story", label: t("detail.story") },
    { key: "updates", label: `${t("detail.updates")} (${updates.length})` },
    { key: "backers", label: t("detail.backers_tab") },
  ] as const;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="pt-16">
        <div className="w-full h-80 md:h-[420px] bg-[#E7F5EA] relative">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-[#F59E0B] mr-2">Solar Energy</span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-[#14432B]">Active</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-xl">
              <Shield size={14} className="text-[#4CAF50]" />
              <span className="text-xs text-white font-medium">Trust Score {project.trustScore}/100</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-6">
            <Link to="/" className="hover:text-[#14432B]">Home</Link>
            <ChevronRight size={12} />
            <Link to="/explore" className="hover:text-[#14432B]">Explore</Link>
            <ChevronRight size={12} />
            <span className="text-[#1E2A26]">{project.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={14} className="text-[#9CA3AF]" />
                <span className="text-sm text-[#9CA3AF]">{project.location}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1E2A26] mb-2">{project.title}</h1>
              <p className="text-sm text-[#6B7280] mb-1">by <span className="font-medium text-[#1E2A26]">{project.organization}</span></p>

              <div className="flex flex-wrap gap-2 my-4">
                {["OJK Verified", "Environmental Impact Certified", "3rd-Party Audited"].map(badge => (
                  <span key={badge} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E7F5EA] text-[#14432B] text-xs font-medium">
                    <CheckCircle2 size={11} /> {badge}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 my-6">
                {[
                  { icon: Zap, label: "Clean Energy", value: `${(project.energyKwh / 1000).toFixed(1)} MWh/yr`, color: "#F59E0B" },
                  { icon: Leaf, label: "CO₂ Reduced", value: `${project.co2Reduced}t/yr`, color: "#4CAF50" },
                  { icon: Users, label: "Beneficiaries", value: project.beneficiaries.toLocaleString(), color: "#1F8A8C" },
                ].map(m => (
                  <div key={m.label} className="bg-white rounded-2xl p-4 shadow-card text-center">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: m.color + "20" }}>
                      <m.icon size={18} style={{ color: m.color }} />
                    </div>
                    <div className="text-lg font-bold text-[#1E2A26]">{m.value}</div>
                    <div className="text-xs text-[#9CA3AF]">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-[#F4F4F0] rounded-2xl p-1 mb-6">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === tab.key ? "bg-white text-[#1E2A26] shadow-card" : "text-[#6B7280] hover:text-[#1E2A26]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "story" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-3xl p-6 shadow-card">
                    <h3 className="text-lg font-semibold text-[#1E2A26] mb-3">The Problem</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
                      SD Negeri Sukamaju and three surrounding schools in rural Sulawesi Selatan rely on aging diesel generators. Monthly fuel costs consume 40% of the school operational budget.
                    </p>
                    <h3 className="text-lg font-semibold text-[#1E2A26] mb-3">Our Solution</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                      48 × 370W monocrystalline solar panels, a 30kWh battery system, and a 20kW hybrid inverter — generating 58,400 kWh per year. Three times the schools' current consumption.
                    </p>
                  </div>

                  {/* Before / After */}
                  <div className="bg-white rounded-3xl p-6 shadow-card">
                    <div className="flex items-center gap-2 mb-5">
                      <ArrowRight size={18} className="text-[#14432B]" />
                      <h3 className="text-lg font-semibold text-[#1E2A26]">{t("detail.transformation")}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Before */}
                      <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-6 h-6 rounded-full bg-[#FCA5A5] flex items-center justify-center text-xs font-bold text-[#991B1B]">✕</span>
                          <span className="text-sm font-bold text-[#991B1B]">{t("detail.before")}</span>
                        </div>
                        <ul className="space-y-2">
                          {beforeAfter.before.map((item, i) => (
                            <li key={i} className="text-xs text-[#7F1D1D] leading-relaxed">{item}</li>
                          ))}
                        </ul>
                      </div>
                      {/* After */}
                      <div className="rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-6 h-6 rounded-full bg-[#86EFAC] flex items-center justify-center text-xs font-bold text-[#14532D]">✓</span>
                          <span className="text-sm font-bold text-[#14532D]">{t("detail.after")}</span>
                        </div>
                        <ul className="space-y-2">
                          {beforeAfter.after.map((item, i) => (
                            <li key={i} className="text-xs text-[#14532D] leading-relaxed">{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-white rounded-3xl p-6 shadow-card">
                    <h3 className="text-lg font-semibold text-[#1E2A26] mb-4">Project Timeline</h3>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-px bg-[#E5E8E4]" />
                      <div className="space-y-4">
                        {timeline.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 relative pl-10">
                            <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                              item.status === "done" ? "border-[#4CAF50] bg-[#4CAF50]" :
                              item.status === "active" ? "border-[#14432B] bg-white" : "border-[#E5E8E4] bg-white"
                            }`} />
                            <div className="flex-1 flex items-center justify-between">
                              <span className={`text-sm font-medium ${item.status === "pending" ? "text-[#9CA3AF]" : "text-[#1E2A26]"}`}>{item.phase}</span>
                              <span className="text-xs text-[#9CA3AF]">{item.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "updates" && (
                <div className="space-y-4">
                  {updates.map((u, i) => (
                    <div key={i} className="bg-white rounded-3xl p-6 shadow-card">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-[#E7F5EA] flex items-center justify-center text-xl shrink-0">{u.icon}</div>
                        <div>
                          <div className="text-xs text-[#9CA3AF] mb-1">{u.date}</div>
                          <h4 className="font-semibold text-[#1E2A26] mb-2">{u.title}</h4>
                          <p className="text-sm text-[#6B7280]">{u.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "backers" && (
                <div className="bg-white rounded-3xl p-6 shadow-card">
                  <div className="flex items-center gap-2 mb-4">
                    <Users size={18} className="text-[#14432B]" />
                    <h3 className="font-semibold text-[#1E2A26]">{project.backers} {t("detail.backers_label")}</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Budi W.", amount: "Rp 2,500,000", time: "2 hours ago", avatar: "BW" },
                      { name: "Sari M.", amount: "Rp 500,000", time: "5 hours ago", avatar: "SM" },
                      { name: "Anonymous", amount: "Rp 1,000,000", time: "1 day ago", avatar: "??" },
                      { name: "Ahmad F.", amount: "Rp 5,000,000", time: "2 days ago", avatar: "AF" },
                    ].map((backer, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-[#E5E8E4] last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#14432B] flex items-center justify-center text-xs font-bold text-white">{backer.avatar}</div>
                          <div>
                            <div className="text-sm font-medium text-[#1E2A26]">{backer.name}</div>
                            <div className="text-xs text-[#9CA3AF]">{backer.time}</div>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-[#14432B]">{backer.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 shadow-card sticky top-24">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-2xl font-bold text-[#14432B]">{formatRupiah(project.raised)}</span>
                    <span className="text-sm text-[#9CA3AF]">of {formatRupiah(project.goal)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#E7F5EA] overflow-hidden mb-1">
                    <div className="h-full rounded-full bg-[#4CAF50] transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
                    <span className="text-[#4CAF50] font-medium">{Math.round(progress)}% funded</span>
                    <span>{project.daysLeft} {t("detail.days_left").toLowerCase()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#1E2A26]">{project.backers}</div>
                    <div className="text-xs text-[#9CA3AF]">{t("detail.backers_label")}</div>
                  </div>
                  <div className="text-center border-x border-[#E5E8E4]">
                    <div className="text-lg font-bold text-[#1E2A26]">{project.daysLeft}</div>
                    <div className="text-xs text-[#9CA3AF]">{t("detail.days_left")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#1E2A26]">{project.trustScore}</div>
                    <div className="text-xs text-[#9CA3AF]">{t("detail.trust")}</div>
                  </div>
                </div>

                {/* Payment flow */}
                {payStep === "input" && (
                  <>
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-[#6B7280] mb-2">{t("detail.fund_amount")}</label>
                      <div className="flex gap-2 flex-wrap mb-2">
                        {["50000", "100000", "500000", "1000000"].map(amt => (
                          <button key={amt} onClick={() => setFundAmount(amt)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${fundAmount === amt ? "bg-[#14432B] text-white" : "bg-[#E7F5EA] text-[#14432B] hover:bg-[#14432B] hover:text-white"}`}>
                            {formatRupiah(Number(amt))}
                          </button>
                        ))}
                      </div>
                      <input type="number" value={fundAmount} onChange={e => setFundAmount(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-[#E5E8E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]" min="50000" />
                    </div>
                    <button onClick={() => setPayStep("method")}
                      className="w-full py-3.5 rounded-2xl bg-[#14432B] hover:bg-[#1a5436] text-white font-semibold text-sm transition-colors active:scale-[0.96] duration-150 mb-2">
                      {t("detail.fund_btn")}
                    </button>
                  </>
                )}

                {payStep === "method" && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#1E2A26] mb-3">{t("detail.pay_method")}</h4>
                    <p className="text-xs text-[#9CA3AF] mb-4">{t("detail.funding_label")} <span className="font-semibold text-[#14432B]">{formatRupiah(Number(fundAmount))}</span></p>
                    <div className="space-y-2 mb-4">
                      {[
                        { id: "va", label: "Virtual Account", sub: "BCA / Mandiri / BNI", icon: Building },
                        { id: "qris", label: "QRIS", sub: "Scan with any e-wallet", icon: Smartphone },
                        { id: "card", label: "Credit / Debit Card", sub: "Visa · Mastercard", icon: CreditCard },
                      ].map(m => (
                        <button key={m.id} onClick={() => setPayMethod(m.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-colors ${payMethod === m.id ? "border-[#14432B] bg-[#E7F5EA]" : "border-[#E5E8E4] hover:border-[#14432B]/30"}`}>
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${payMethod === m.id ? "bg-[#14432B]" : "bg-[#F4F4F0]"}`}>
                            <m.icon size={16} className={payMethod === m.id ? "text-white" : "text-[#6B7280]"} />
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-medium text-[#1E2A26]">{m.label}</div>
                            <div className="text-xs text-[#9CA3AF]">{m.sub}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button onClick={handlePay} disabled={!payMethod}
                      className="w-full py-3.5 rounded-2xl bg-[#4CAF50] hover:bg-[#66BB6A] disabled:opacity-50 text-white font-semibold text-sm transition-colors active:scale-[0.96] duration-150 mb-2">
                      {t("detail.confirm")}
                    </button>
                    <button onClick={() => setPayStep("input")} className="w-full py-2 text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                      {t("detail.back")}
                    </button>
                  </div>
                )}

                {payStep === "processing" && (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full border-4 border-[#E7F5EA] border-t-[#4CAF50] animate-spin mx-auto mb-4" />
                    <p className="text-sm font-medium text-[#1E2A26]">{t("detail.processing")}</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">{t("detail.verify")}</p>
                  </div>
                )}

                {payStep === "success" && (
                  <div className="text-center py-4">
                    <div className="w-14 h-14 rounded-full bg-[#E7F5EA] flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 size={28} className="text-[#4CAF50]" />
                    </div>
                    <h4 className="font-bold text-[#1E2A26] mb-1">{t("detail.success_title")}</h4>
                    <p className="text-xs text-[#9CA3AF] mb-3">{t("detail.success_tx")}: <span className="font-mono font-medium text-[#14432B]">{txId}</span></p>
                    <div className="bg-[#E7F5EA] rounded-2xl p-3 mb-4 text-left">
                      <p className="text-xs font-semibold text-[#14432B] mb-1">{t("detail.impact_preview")}</p>
                      <p className="text-xs text-[#6B7280]">
                        {t("detail.impact_desc")
                          .replace("{kwh}", Math.round(Number(fundAmount) / 8500).toString())
                          .replace("{co2}", (Number(fundAmount) / 4200000).toFixed(2))}
                      </p>
                    </div>
                    <button className="w-full py-3 rounded-2xl bg-[#14432B] text-white text-xs font-semibold mb-2 active:scale-[0.96] duration-150">
                      {t("detail.download_cert")}
                    </button>
                    <button onClick={() => setPayStep("input")} className="w-full py-2 text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                      {t("detail.fund_again")}
                    </button>
                  </div>
                )}

                {payStep === "input" && (
                  <div className="mt-2 pt-4 border-t border-[#E5E8E4] flex items-center gap-2">
                    <Shield size={14} className="text-[#4CAF50]" />
                    <span className="text-xs text-[#9CA3AF]">{t("detail.escrow")}</span>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E7F5EA] flex items-center justify-center">
                    <Award size={18} className="text-[#14432B]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#1E2A26]">{project.organization}</div>
                    <div className="text-xs text-[#9CA3AF]">{t("common.verified_org")}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className="text-[#F59E0B] fill-[#F59E0B]" />)}
                  <span className="text-xs text-[#6B7280] ml-1">5.0 · 8 projects</span>
                </div>
                <p className="text-xs text-[#9CA3AF]">Non-profit foundation focused on education infrastructure in eastern Indonesia since 2018.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
