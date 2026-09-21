import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Filter, ArrowRight, Zap, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatRupiah, categoryLabels, categoryColors } from "../data/projects";
import IndonesiaMap, { STATUS_CONFIG, type MapMarker } from "../components/IndonesiaMap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const REGIONS: Record<string, string[]> = {
  "Semua Wilayah": [],
  "Sumatera": ["Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Jambi", "Sumatera Selatan", "Bengkulu", "Lampung", "Bangka Belitung", "Kepulauan Riau"],
  "Jawa": ["DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Banten"],
  "Kalimantan": ["Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara"],
  "Sulawesi": ["Sulawesi Utara", "Sulawesi Tengah", "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo", "Sulawesi Barat"],
  "Nusa Tenggara": ["Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur"],
  "Maluku & Papua": ["Maluku", "Maluku Utara", "Papua", "Papua Barat", "Papua Selatan", "Papua Tengah"],
};

const STATUS_FILTER_OPTIONS = ["Semua", "Aktif", "Terdanai", "Menunggu Review"];

export default function MapPage() {
  const { projects, pendingProjects } = useApp();
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState("Semua Wilayah");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [showPending, setShowPending] = useState(true);

  // Build markers from live projects + pending projects
  const allMarkers = useMemo<MapMarker[]>(() => {
    const liveMarkers: MapMarker[] = projects
      .filter((p) => p.coordinates)
      .map((p) => ({
        id: p.id,
        title: p.title,
        coordinates: p.coordinates!,
        status: p.status === "funded" ? "funded" : "active",
        raised: p.raised,
        goal: p.goal,
        backers: p.backers,
        category: p.category,
        location: p.location,
      }));

    const pendingMarkers: MapMarker[] = showPending
      ? pendingProjects
          .filter((p) => p.coordinates && p.status === "pending")
          .map((p) => ({
            id: p.id,
            title: p.title,
            coordinates: p.coordinates!,
            status: "pending" as const,
            goal: p.goal,
            category: p.category,
            location: p.location,
          }))
      : [];

    const revisionMarkers: MapMarker[] = showPending
      ? pendingProjects
          .filter((p) => p.coordinates && p.status === "revision")
          .map((p) => ({
            id: p.id,
            title: p.title,
            coordinates: p.coordinates!,
            status: "revision" as const,
            goal: p.goal,
            category: p.category,
            location: p.location,
          }))
      : [];

    return [...liveMarkers, ...pendingMarkers, ...revisionMarkers];
  }, [projects, pendingProjects, showPending]);

  const filteredMarkers = useMemo(() => {
    return allMarkers.filter((m) => {
      const matchStatus =
        statusFilter === "Semua" ||
        (statusFilter === "Aktif" && m.status === "active") ||
        (statusFilter === "Terdanai" && m.status === "funded") ||
        (statusFilter === "Menunggu Review" && (m.status === "pending" || m.status === "revision"));

      if (!matchStatus) return false;

      if (regionFilter !== "Semua Wilayah") {
        const regionProvinces = REGIONS[regionFilter] ?? [];
        const projectProvince =
          projects.find((p) => p.id === m.id)?.province ??
          pendingProjects.find((p) => p.id === m.id)?.province ??
          "";
        if (!regionProvinces.includes(projectProvince)) return false;
      }

      return true;
    });
  }, [allMarkers, statusFilter, regionFilter, projects, pendingProjects]);

  // Stats
  const stats = useMemo(() => {
    const active = allMarkers.filter((m) => m.status === "active").length;
    const funded = allMarkers.filter((m) => m.status === "funded").length;
    const pending = allMarkers.filter((m) => m.status === "pending" || m.status === "revision").length;
    const totalRaised = projects.reduce((sum, p) => sum + p.raised, 0);
    return { active, funded, pending, total: allMarkers.length, totalRaised };
  }, [allMarkers, projects]);

  // Project lookup for sidebar list
  const sidebarItems = useMemo(() => {
    return filteredMarkers.map((m) => {
      const liveProject = projects.find((p) => p.id === m.id);
      const pendingProject = pendingProjects.find((p) => p.id === m.id);
      return { marker: m, liveProject, pendingProject };
    });
  }, [filteredMarkers, projects, pendingProjects]);

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />

      {/* Header */}
      <div className="bg-[#14432B] pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium mb-3">
                <MapPin size={12} /> Peta Sebaran Proyek
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Distribusi Proyek di Indonesia</h1>
              <p className="text-white/60 mt-2 max-w-lg">
                Temukan proyek energi terbarukan di seluruh kepulauan Indonesia — dari Sabang sampai Merauke.
              </p>
            </div>
            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total Proyek", value: stats.total, icon: MapPin, color: "text-white" },
                { label: "Aktif", value: stats.active, icon: Zap, color: "text-[#F59E0B]" },
                { label: "Terdanai", value: stats.funded, icon: CheckCircle2, color: "text-[#4CAF50]" },
                { label: "Review", value: stats.pending, icon: Clock, color: "text-[#60A5FA]" },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm">
                  <s.icon size={14} className={`${s.color} mb-1`} />
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/60">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 space-y-4">
            {/* Filter card */}
            <div className="bg-white rounded-3xl p-5 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={14} className="text-[#14432B]" />
                <span className="text-sm font-semibold text-[#1E2A26]">Filter</span>
              </div>

              {/* Status filter */}
              <p className="text-xs font-medium text-[#9CA3AF] mb-2 uppercase tracking-wide">Status</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {STATUS_FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setStatusFilter(opt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      statusFilter === opt
                        ? "bg-[#14432B] text-white"
                        : "bg-[#F4F4F0] text-[#6B7280] hover:bg-[#E7F5EA] hover:text-[#14432B]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Region filter */}
              <p className="text-xs font-medium text-[#9CA3AF] mb-2 uppercase tracking-wide">Wilayah</p>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-[#F4F4F0] text-[#1E2A26] border border-[#E5E8E4] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 mb-4"
              >
                {Object.keys(REGIONS).map((r) => <option key={r}>{r}</option>)}
              </select>

              {/* Show pending toggle */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-[#6B7280]">Tampilkan proyek pending</span>
                <button
                  onClick={() => setShowPending((v) => !v)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${showPending ? "bg-[#4CAF50]" : "bg-[#D1D5DB]"}`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${showPending ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
              </label>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-3xl p-5 shadow-card">
              <p className="text-xs font-semibold text-[#1E2A26] mb-3">Legenda Status</p>
              <div className="space-y-2.5">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-2.5">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      {cfg.pulse && (
                        <span
                          className="absolute w-4 h-4 rounded-full opacity-30 animate-ping"
                          style={{ background: cfg.color }}
                        />
                      )}
                      <span className="w-3 h-3 rounded-full relative" style={{ background: cfg.color }} />
                    </div>
                    <span className="text-xs text-[#6B7280]">{cfg.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[#F0F4F0]">
                <p className="text-xs font-semibold text-[#1E2A26] mb-3">Jenis Energi</p>
                {(Object.entries(categoryColors) as [string, string][]).map(([cat, color]) => (
                  <div key={cat} className="flex items-center gap-2.5 mb-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                    <span className="text-xs text-[#6B7280] capitalize">{categoryLabels[cat as keyof typeof categoryLabels]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total raised */}
            <div className="bg-[#14432B] rounded-3xl p-5">
              <TrendingUp size={18} className="text-[#4CAF50] mb-2" />
              <div className="text-xl font-bold text-white mb-0.5">{formatRupiah(stats.totalRaised)}</div>
              <div className="text-xs text-white/60">Total dana terkumpul</div>
            </div>
          </aside>

          {/* Map + list */}
          <div className="flex-1 space-y-6">
            {/* Map */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-card">
              <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#1E2A26]">
                    {filteredMarkers.length} proyek ditampilkan
                  </p>
                  <p className="text-xs text-[#9CA3AF]">
                    {regionFilter !== "Semua Wilayah" ? regionFilter : "Seluruh Indonesia"}
                    {statusFilter !== "Semua" && ` · ${statusFilter}`}
                  </p>
                </div>
                <span className="text-xs text-[#9CA3AF] bg-[#F4F4F0] px-3 py-1.5 rounded-xl">
                  Scroll/pinch untuk zoom
                </span>
              </div>
              <IndonesiaMap
                markers={filteredMarkers}
                interactive
                onMarkerClick={setHighlightedId}
                highlightedId={highlightedId}
              />
            </div>

            {/* Project list */}
            <div className="bg-white rounded-3xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F0F4F0]">
                <h2 className="text-sm font-semibold text-[#1E2A26]">Daftar Proyek</h2>
              </div>
              {sidebarItems.length === 0 ? (
                <div className="py-12 text-center text-sm text-[#9CA3AF]">Tidak ada proyek yang sesuai filter.</div>
              ) : (
                <div className="divide-y divide-[#F0F4F0]">
                  {sidebarItems.map(({ marker, liveProject }) => {
                    const cfg = STATUS_CONFIG[marker.status];
                    const pct = liveProject
                      ? Math.min((liveProject.raised / liveProject.goal) * 100, 100)
                      : 0;
                    const isHL = highlightedId === marker.id;

                    return (
                      <div
                        key={marker.id}
                        className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors ${
                          isHL ? "bg-[#E7F5EA]" : "hover:bg-[#FAFAF7]"
                        }`}
                        onClick={() => setHighlightedId(isHL ? null : marker.id)}
                      >
                        {/* Status dot */}
                        <div className="relative mt-1 shrink-0 w-5 h-5 flex items-center justify-center">
                          {cfg?.pulse && (
                            <span
                              className="absolute w-4 h-4 rounded-full opacity-30 animate-ping"
                              style={{ background: cfg.color }}
                            />
                          )}
                          <span className="w-3 h-3 rounded-full" style={{ background: cfg?.color }} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-[#1E2A26] leading-snug line-clamp-1">
                              {marker.title}
                            </p>
                            <span
                              className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full"
                              style={{ background: cfg?.color + "20", color: cfg?.color }}
                            >
                              {cfg?.label}
                            </span>
                          </div>
                          <p className="text-xs text-[#9CA3AF] mt-0.5 mb-2">{marker.location}</p>
                          {liveProject && (
                            <>
                              <div className="h-1 rounded-full bg-[#E5E8E4] overflow-hidden mb-1">
                                <div
                                  className="h-full rounded-full bg-[#4CAF50]"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] text-[#6B7280]">
                                  {formatRupiah(liveProject.raised)}
                                  <span className="text-[#C4C9C2]"> / {formatRupiah(liveProject.goal)}</span>
                                </span>
                                {liveProject.status !== "funded" && (
                                  <Link
                                    to={`/project/${liveProject.id}`}
                                    className="text-[11px] font-medium text-[#14432B] hover:underline flex items-center gap-0.5"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Lihat <ArrowRight size={10} />
                                  </Link>
                                )}
                              </div>
                            </>
                          )}
                          {!liveProject && marker.goal && (
                            <p className="text-[11px] text-[#9CA3AF]">Target: {formatRupiah(marker.goal)}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
