import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Leaf, Globe2, Users, TrendingUp, Sun, Wind, Droplets, CheckCircle2, Star, ChevronRight, MapPin, ArrowDown } from "lucide-react";
import { projects, formatRupiah } from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import IndonesiaMap, { STATUS_CONFIG, type MapMarker } from "../components/IndonesiaMap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useT } from "../i18n/LanguageContext";

// Animated counter
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStarted(true);
    }, { threshold: 0.6 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(target);
      return;
    }
    let raf: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return { count, ref };
}

function StatCard({ numericTarget, format, label, sub, icon: Icon, color }: {
  numericTarget: number;
  format: (n: number) => string;
  label: string;
  sub: string;
  icon: React.ElementType;
  color: string;
}) {
  const { count, ref } = useCountUp(numericTarget);
  return (
    <div className="bg-[#FAFAF7] rounded-3xl p-6 shadow-card">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: color + "20" }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div ref={ref} className="text-2xl md:text-3xl font-bold text-[#1E2A26] mb-1" style={{ fontVariantNumeric: "tabular-nums" }}>
        {format(count)}
      </div>
      <div className="text-sm font-medium text-[#1E2A26] mb-0.5">{label}</div>
      <div className="text-xs text-[#9CA3AF]">{sub}</div>
    </div>
  );
}

const howItWorksIcons = [Sun, TrendingUp, Leaf];

// Live funding progress bar animation
function AnimatedProgress({ target }: { target: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(target), 300);
    return () => clearTimeout(t);
  }, [target]);
  return (
    <div className="h-2 rounded-full bg-[#E7F5EA] overflow-hidden">
      <div
        className="h-full rounded-full bg-[#4CAF50] transition-all duration-[1800ms] ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export default function Landing() {
  const [email, setEmail] = useState("");
  const { t } = useT();
  const featured = projects.filter(p => p.featured);
  const liveProject = projects[0];

  const mapMarkers = useMemo<MapMarker[]>(() =>
    projects
      .filter((p) => p.coordinates)
      .map((p) => ({
        id: p.id,
        title: p.title,
        coordinates: p.coordinates!,
        status: p.status === "funded" ? "funded" as const : "active" as const,
        raised: p.raised,
        goal: p.goal,
        backers: p.backers,
        category: p.category,
        location: p.location,
      })),
  []);

  const stats = [
    { numericTarget: 14.2, format: (n: number) => `${n.toFixed(1)} GWh`, label: t("stats.energy"), sub: t("stats.energy_sub"), icon: Zap, color: "#F59E0B" },
    { numericTarget: 8420, format: (n: number) => `${Math.round(n).toLocaleString()} t`, label: t("stats.co2"), sub: t("stats.co2_sub"), icon: Leaf, color: "#4CAF50" },
    { numericTarget: 127, format: (n: number) => `${Math.round(n)}`, label: t("stats.communities"), sub: t("stats.communities_sub"), icon: Globe2, color: "#1F8A8C" },
    { numericTarget: 24800, format: (n: number) => `${Math.round(n).toLocaleString()}+`, label: t("stats.supporters"), sub: t("stats.supporters_sub"), icon: Users, color: "#8B5CF6" },
  ];

  const howItWorks = [
    { step: "01", title: t("how.step1_title"), desc: t("how.step1_desc"), icon: howItWorksIcons[0] },
    { step: "02", title: t("how.step2_title"), desc: t("how.step2_desc"), icon: howItWorksIcons[1] },
    { step: "03", title: t("how.step3_title"), desc: t("how.step3_desc"), icon: howItWorksIcons[2] },
  ];

  const testimonials = [
    { name: "Budi Santoso", role: "Small Business Owner, Surabaya", avatar: "BS", text: "I funded 3 solar projects through GreenFund. The impact dashboard makes me feel like I'm genuinely making a difference.", rating: 5 },
    { name: "Dr. Ratna Sari", role: "University Lecturer, Bandung", avatar: "RS", text: "GreenFund connects my values with my investments. Seeing real CO₂ reduction numbers from the school solar project I backed is deeply rewarding.", rating: 5 },
    { name: "Ahmad Fauzi", role: "Tech Entrepreneur, Jakarta", avatar: "AF", text: "The UX is phenomenal — rivaling any global fintech product. And the underlying mission of electrifying rural Indonesia makes this meaningful.", rating: 5 },
  ];

  return (
    <div className="bg-[#FAFAF7]">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen bg-[#0E2E1D] overflow-hidden flex flex-col">
        {/* Background texture — subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Ambient light blobs */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #4CAF50 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #1F8A8C 0%, transparent 65%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(ellipse, #14432B 0%, transparent 70%)" }} />

        {/* Content */}
        <div className="relative flex-1 flex items-center max-w-7xl mx-auto w-full px-6 pt-20 pb-16">
          <div className="grid lg:grid-cols-[1fr_440px] gap-16 xl:gap-24 items-center w-full">

            {/* Left */}
            <div>
              {/* OJK badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-pulse" />
                <span className="text-xs font-medium text-white/70 tracking-wide">{t("hero.badge")}</span>
              </div>

              {/* Headline */}
              <h1 className="mb-6">
                <span className="block text-white/55 text-lg md:text-xl font-light tracking-widest uppercase mb-2" style={{ letterSpacing: "0.18em" }}>
                  Platform investasi
                </span>
                <span
                  className="block leading-[0.9] text-[clamp(56px,9vw,100px)] font-bold italic text-[#4CAF50]"
                  style={{ fontFamily: "'Fraunces', serif", fontOpticalSizing: "auto" }}
                >
                  {t("hero.title2")}
                </span>
                <span className="block text-white text-[clamp(28px,4.5vw,52px)] font-bold leading-tight mt-2">
                  {t("hero.title1").replace("Dukung Masa Depan", "").trim() || "untuk Indonesia"}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-white/70 text-lg leading-relaxed max-w-xl mb-10 text-pretty">
                {t("hero.subtitle")}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#4CAF50] hover:bg-[#66BB6A] text-white font-semibold text-sm transition-all active:scale-[0.97] duration-150 shadow-lg shadow-green-900/30"
                >
                  {t("hero.cta_explore")} <ArrowRight size={16} />
                </Link>
                <Link
                  to="/impact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/8 hover:bg-white/14 text-white font-medium text-sm border border-white/15 transition-all active:scale-[0.97] duration-150 backdrop-blur-sm"
                >
                  {t("hero.cta_impact")}
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 mb-12">
                <div className="flex -space-x-2.5">
                  {["#14432B", "#1F8A8C", "#4CAF50", "#F59E0B", "#8B5CF6"].map((color, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-[#0E2E1D] flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: color }}
                    >
                      {["BW", "RS", "AF", "DK", "ML"][i]}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-white/65">
                  <span className="text-white font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>24,800+</span> {t("hero.social")}
                </p>
              </div>

              {/* Live stats strip */}
              <div className="grid grid-cols-3 gap-0 border-t border-white/10 pt-8">
                {[
                  { value: "Rp 42B+", label: "Dana tersalurkan" },
                  { value: "127", label: "Komunitas teraliri" },
                  { value: "8,420t", label: "CO₂ dikurangi" },
                ].map((s, i) => (
                  <div key={s.label} className={`pr-6 ${i > 0 ? "pl-6 border-l border-white/10" : ""}`}>
                    <div
                      className="text-2xl md:text-3xl font-bold text-white mb-1"
                      style={{ fontFamily: "'Fraunces', serif", fontVariantNumeric: "tabular-nums" }}
                    >
                      {s.value}
                    </div>
                    <div className="text-xs text-white/60 font-medium uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating project card */}
            <div className="hidden lg:block relative">
              {/* Glow behind card */}
              <div className="absolute inset-0 rounded-3xl blur-2xl opacity-20" style={{ background: "#4CAF50", transform: "scale(0.9) translateY(8%)" }} />

              {/* Main card */}
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
                {/* Image */}
                <div className="relative h-52 bg-[#14432B]">
                  <img
                    src="https://images.unsplash.com/photo-1703195966021-1ee2bea51662?w=600&h=400&fit=crop&auto=format"
                    alt="Solar panels aerial view"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#4CAF50] text-white text-[10px] font-bold uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Live
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-[10px] font-semibold">
                      Solar Energy
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-bold text-sm leading-tight line-clamp-2">{liveProject.title}</p>
                    <p className="text-white/70 text-xs mt-0.5">{liveProject.location}</p>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-[#9CA3AF] mb-2">
                      <span className="font-semibold text-[#14432B]">{formatRupiah(liveProject.raised)}</span>
                      <span className="font-bold text-[#4CAF50]">{Math.round((liveProject.raised / liveProject.goal) * 100)}%</span>
                    </div>
                    <AnimatedProgress target={Math.round((liveProject.raised / liveProject.goal) * 100)} />
                    <p className="text-[11px] text-[#9CA3AF] mt-1.5">dari {formatRupiah(liveProject.goal)} target</p>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-0 py-3 border-t border-[#E5E8E4]">
                    <div className="flex-1 text-center">
                      <div className="text-sm font-bold text-[#1E2A26]">{liveProject.backers}</div>
                      <div className="text-[10px] text-[#9CA3AF] mt-0.5">Pendukung</div>
                    </div>
                    <div className="w-px h-8 bg-[#E5E8E4]" />
                    <div className="flex-1 text-center">
                      <div className="text-sm font-bold text-[#1E2A26]">{liveProject.daysLeft}</div>
                      <div className="text-[10px] text-[#9CA3AF] mt-0.5">Hari tersisa</div>
                    </div>
                    <div className="w-px h-8 bg-[#E5E8E4]" />
                    <div className="flex-1 text-center">
                      <div className="text-sm font-bold text-[#1E2A26]">{liveProject.trustScore}</div>
                      <div className="text-[10px] text-[#9CA3AF] mt-0.5">Trust score</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/project/${liveProject.id}`}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#14432B] hover:bg-[#1a5436] text-white text-xs font-bold transition-colors active:scale-[0.97]"
                  >
                    Danai Proyek Ini <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Floating badge — CO₂ */}
              <div className="absolute -top-5 -right-4 bg-white rounded-2xl px-3.5 py-2.5 shadow-elevated border border-[#E5E8E4] flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#E7F5EA] flex items-center justify-center">
                  <Leaf size={14} className="text-[#14432B]" />
                </div>
                <div>
                  <div className="text-[10px] text-[#9CA3AF] leading-none mb-0.5">CO₂ dihindari</div>
                  <div className="text-xs font-bold text-[#14432B]">42t / tahun</div>
                </div>
              </div>

              {/* Floating badge — kWh */}
              <div className="absolute -bottom-5 -left-4 bg-[#4CAF50] rounded-2xl px-3.5 py-2.5 shadow-elevated flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                  <Zap size={14} className="text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-white/70 leading-none mb-0.5">Energi bersih</div>
                  <div className="text-xs font-bold text-white">58,400 kWh/yr</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative flex justify-center pb-10">
          <a
            href="#stats"
            className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors rounded-lg px-3 py-1"
            aria-label="Scroll to statistics"
          >
            <span className="text-[10px] font-medium uppercase tracking-widest">Scroll</span>
            <ArrowDown size={14} className="animate-bounce" />
          </a>
        </div>
      </section>

      {/* ── ANIMATED STATS ── */}
      <section id="stats" className="py-20 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F5EA] text-[#14432B] text-xs font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-pulse" />
              {t("stats.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E2A26]">{t("stats.title")}</h2>
            <p className="text-[#6B7280] mt-3 max-w-xl mx-auto">{t("stats.subtitle")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section className="py-20 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#E7F5EA] text-[#14432B] text-xs font-semibold mb-3">{t("featured.badge")}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1E2A26]">{t("featured.title")}</h2>
              <p className="text-[#6B7280] mt-2">{t("featured.sub")}</p>
            </div>
            <Link to="/explore" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[#14432B] hover:text-[#1a5436] transition-colors">
              {t("featured.view_all")} <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(project => <ProjectCard key={project.id} project={project} />)}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#14432B]">
              {t("featured.view_all")} <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-[#E7F5EA] text-[#14432B] text-xs font-semibold mb-3">{t("how.badge")}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E2A26]">{t("how.title")}</h2>
            <p className="text-[#6B7280] mt-3 max-w-lg mx-auto">{t("how.sub")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-px bg-[#E5E8E4] -translate-x-1/2 z-0" />
                )}
                <div className="relative z-10 flex flex-col items-start">
                  <div className="w-16 h-16 rounded-2xl bg-[#14432B] flex items-center justify-center mb-6">
                    <step.icon size={28} color="#4CAF50" />
                  </div>
                  <span className="text-xs font-bold text-[#9CA3AF] tracking-wider mb-2">STEP {step.step}</span>
                  <h3 className="text-xl font-semibold text-[#1E2A26] mb-3">{step.title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECT DISTRIBUTION MAP ── */}
      <section className="py-20 bg-[#FAFAF7] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F5EA] text-[#14432B] text-xs font-semibold mb-4">
                <MapPin size={12} /> {t("map_section.badge")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1E2A26] mb-4" style={{ textWrap: "balance" }}>
                {t("map_section.title")}
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-6">{t("map_section.sub")}</p>
              <div className="flex flex-col gap-2.5 mb-8">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      {cfg.pulse && <span className="absolute w-4 h-4 rounded-full opacity-25 animate-ping" style={{ background: cfg.color }} />}
                      <span className="w-3 h-3 rounded-full" style={{ background: cfg.color }} />
                    </div>
                    <span className="text-sm text-[#6B7280]">{cfg.label}</span>
                  </div>
                ))}
              </div>
              <Link to="/map" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#14432B] hover:bg-[#1a5436] text-white font-semibold text-sm transition-colors active:scale-[0.96] duration-150">
                {t("map_section.open")} <ArrowRight size={16} />
              </Link>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-card-hover border border-[#E5E8E4]">
              <IndonesiaMap markers={mapMarkers} compact />
              <div className="bg-[#FAFAF7] px-5 py-3 flex items-center justify-between border-t border-[#E5E8E4]">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-[#6B7280]"><span className="font-semibold text-[#1E2A26]">{mapMarkers.length}</span> {t("map_section.count")}</span>
                  <span className="text-xs text-[#6B7280]"><span className="font-semibold text-[#F59E0B]">{mapMarkers.filter(m => m.status === "active").length}</span> aktif</span>
                  <span className="text-xs text-[#6B7280]"><span className="font-semibold text-[#4CAF50]">{mapMarkers.filter(m => m.status === "funded").length}</span> terdanai</span>
                </div>
                <Link to="/map" className="text-xs font-medium text-[#14432B] hover:underline flex items-center gap-1">
                  {t("map_section.view_all")} <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ENVIRONMENTAL IMPACT ── */}
      <section className="py-20 bg-[#14432B] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #4CAF50 0%, transparent 60%), radial-gradient(circle at 80% 50%, #1F8A8C 0%, transparent 60%)" }} />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#4CAF50]/20 text-[#4CAF50] text-xs font-semibold mb-4">Environmental Impact</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ textWrap: "balance" }}>
                Every Investment Measured in CO₂ Saved
              </h2>
              <p className="text-white/70 leading-relaxed mb-8">
                We track every kilowatt-hour generated and every metric ton of CO₂ avoided. Your personal impact certificate shows exactly what your investment achieved for Indonesia's environment.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Third-party verified impact data", icon: CheckCircle2 },
                  { label: "Real-time energy generation monitoring", icon: Zap },
                  { label: "Downloadable impact certificates", icon: Leaf },
                  { label: "UN SDG alignment tracking", icon: Globe2 },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <item.icon size={18} className="text-[#4CAF50] shrink-0" />
                    <span className="text-sm text-white/80">{item.label}</span>
                  </div>
                ))}
              </div>
              <Link to="/impact" className="inline-flex items-center gap-2 mt-8 px-5 py-3 rounded-2xl bg-[#4CAF50] hover:bg-[#66BB6A] text-white font-semibold text-sm transition-colors active:scale-[0.96] duration-150">
                See Your Impact <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Solar Energy", value: "8.4 GWh", sub: "total generated", color: "#F59E0B", icon: Sun },
                { label: "CO₂ Avoided", value: "8,420t", sub: "metric tons", color: "#4CAF50", icon: Leaf },
                { label: "Wind Power", value: "3.1 GWh", sub: "capacity online", color: "#3B82F6", icon: Wind },
                { label: "Communities", value: "127", sub: "villages helped", color: "#1F8A8C", icon: Droplets },
              ].map(item => (
                <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
                  <item.icon size={24} style={{ color: item.color }} className="mb-4" />
                  <div className="text-2xl font-bold text-white mb-1" style={{ fontVariantNumeric: "tabular-nums" }}>{item.value}</div>
                  <div className="text-sm font-medium text-white/80">{item.label}</div>
                  <div className="text-xs text-white/50">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-[#E7F5EA] text-[#14432B] text-xs font-semibold mb-3">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E2A26]">Trusted by Indonesia's Changemakers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-3xl p-6 shadow-card">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} className="text-[#F59E0B] fill-[#F59E0B]" />)}
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#14432B] flex items-center justify-center text-xs font-bold text-white">{t.avatar}</div>
                  <div>
                    <div className="text-sm font-semibold text-[#1E2A26]">{t.name}</div>
                    <div className="text-xs text-[#9CA3AF]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-[#E7F5EA] text-[#14432B] text-xs font-semibold mb-4">Start Today</span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1E2A26] mb-4" style={{ textWrap: "balance" }}>
            Ready to Power Indonesia's Green Future?
          </h2>
          <p className="text-[#6B7280] text-lg mb-8">Join 24,800+ supporters. Start with as little as Rp 50,000 and track every watt you generate.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <label htmlFor="cta-email" className="sr-only">Email address</label>
            <input
              id="cta-email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-2xl border border-[#E5E8E4] text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50] bg-[#FAFAF7]"
            />
            <Link to="/explore" className="px-5 py-3 rounded-2xl bg-[#14432B] hover:bg-[#1a5436] text-white font-semibold text-sm transition-colors whitespace-nowrap active:scale-[0.96] duration-150">
              Get Started Free
            </Link>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-3">No fees to sign up. OJK licensed and regulated.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
