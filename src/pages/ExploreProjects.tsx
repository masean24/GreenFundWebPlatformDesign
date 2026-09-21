import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, Zap } from "lucide-react";
import { categoryLabels, type Project } from "../data/projects";
import { useApp } from "../context/AppContext";
import ProjectCard from "../components/ProjectCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const energyTypes = ["All", "Solar", "Wind", "Micro-Hydro", "Biogas", "Biomass"];
const statusOptions = ["All", "Active", "Funded", "Under Review"];
const sortOptions = ["Most Funded", "Newest", "Ending Soon", "Most Backers"];
const provinces = ["All Provinces", "Jawa Tengah", "Sulawesi Selatan", "Nusa Tenggara Timur", "DI Yogyakarta", "Sumatera Utara", "Kalimantan Timur"];

export default function ExploreProjects() {
  const { projects } = useApp();
  const [search, setSearch] = useState("");
  const [energyFilter, setEnergyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Most Funded");
  const [province, setProvince] = useState("All Provinces");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchEnergy = energyFilter === "All" || categoryLabels[p.category] === energyFilter ||
      (energyFilter === "Micro-Hydro" && p.category === "hydro");
    const matchStatus = statusFilter === "All" ||
      (statusFilter === "Active" && p.status === "active") ||
      (statusFilter === "Funded" && p.status === "funded");
    const matchProvince = province === "All Provinces" || p.province === province;
    return matchSearch && matchEnergy && matchStatus && matchProvince;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Most Funded") return (b.raised / b.goal) - (a.raised / a.goal);
    if (sortBy === "Most Backers") return b.backers - a.backers;
    if (sortBy === "Ending Soon") return a.daysLeft - b.daysLeft;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />

      {/* Hero band */}
      <div className="bg-[#14432B] pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium mb-3">
                <Zap size={12} /> {projects.filter(p => p.status === "active").length} active projects
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Explore Projects</h1>
              <p className="text-white/60 mt-2">Discover and fund renewable energy projects across Indonesia.</p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <label htmlFor="explore-search" className="sr-only">Search projects</label>
              <Search size={16} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
              <input
                id="explore-search"
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects, locations..."
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/10 border border-white/20 text-base sm:text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Energy type pills */}
          <div className="flex gap-2 flex-wrap">
            {energyTypes.map(type => (
              <button
                key={type}
                onClick={() => setEnergyFilter(type)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                  energyFilter === type
                    ? "bg-[#14432B] text-white"
                    : "bg-white text-[#6B7280] hover:bg-[#E7F5EA] hover:text-[#14432B] shadow-card"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="ml-auto flex gap-3">
            {/* Province select */}
            <select
              value={province}
              onChange={e => setProvince(e.target.value)}
              aria-label="Filter by province"
              className="px-3 py-2 rounded-xl text-xs font-medium bg-white text-[#6B7280] border border-[#E5E8E4] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 shadow-card"
            >
              {provinces.map(p => <option key={p}>{p}</option>)}
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              className="px-3 py-2 rounded-xl text-xs font-medium bg-white text-[#6B7280] border border-[#E5E8E4] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 shadow-card"
            >
              {statusOptions.map(s => <option key={s}>{s}</option>)}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              aria-label="Sort projects"
              className="px-3 py-2 rounded-xl text-xs font-medium bg-white text-[#6B7280] border border-[#E5E8E4] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 shadow-card"
            >
              {sortOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#6B7280]">
            <span className="font-medium text-[#1E2A26]">{sorted.length}</span> projects found
            {search && <span> for "<span className="text-[#14432B] font-medium">{search}</span>"</span>}
          </p>
        </div>

        {/* Grid */}
        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-3xl bg-[#E7F5EA] flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-[#14432B]" />
            </div>
            <p className="font-medium text-[#1E2A26] mb-2">No projects found</p>
            <p className="text-sm text-[#9CA3AF]">Try adjusting your filters or search term.</p>
            <button
              onClick={() => { setSearch(""); setEnergyFilter("All"); setStatusFilter("All"); setProvince("All Provinces"); }}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-medium bg-[#E7F5EA] text-[#14432B] hover:bg-[#14432B] hover:text-white transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Coming soon banner */}
        <div className="mt-12 rounded-3xl bg-[#14432B] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-semibold text-white text-lg mb-1">Have a renewable energy project?</h3>
            <p className="text-white/60 text-sm">Submit your project for review and start raising funds from Indonesia's largest clean energy investor network.</p>
          </div>
          <Link
            to="/create"
            className="shrink-0 px-5 py-3 rounded-2xl bg-[#4CAF50] hover:bg-[#66BB6A] text-white font-semibold text-sm transition-colors active:scale-[0.96] duration-150"
          >
            Submit Your Project
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
