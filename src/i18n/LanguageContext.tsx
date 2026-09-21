import { createContext, useContext, useState, type ReactNode } from "react";

type Lang = "id" | "en";

const T = {
  id: {
    // Navbar
    "nav.explore": "Jelajahi Proyek",
    "nav.impact": "Portofolio Dampak",
    "nav.map": "Peta Proyek",
    "nav.about": "Tentang",
    "nav.login": "Masuk",
    "nav.signup": "Daftar",
    "nav.logout": "Keluar",
    "nav.dashboards": "Dashboard",
    "nav.supporter_dash": "Dashboard Supporter",
    "nav.owner_dash": "Dashboard Pemilik",
    "nav.admin": "Panel Admin",

    // Landing hero
    "hero.badge": "Terdaftar OJK · 127 proyek didanai · Rp 42M+ terkumpul",
    "hero.title1": "Dukung Masa Depan",
    "hero.title2": "Energi Bersih",
    "hero.subtitle": "Dukung proyek energi terbarukan di seluruh Indonesia dan pantau dampak lingkunganmu secara nyata.",
    "hero.cta_explore": "Jelajahi Proyek",
    "hero.cta_impact": "Lihat Portofolio Dampak",
    "hero.social": "supporter sudah berinvestasi",

    // Stats
    "stats.badge": "Statistik Live",
    "stats.title": "Dampak Nyata, Angka Nyata",
    "stats.subtitle": "Setiap proyek dipantau, diukur, dan diverifikasi. Data diperbarui secara real-time.",
    "stats.energy": "Energi Bersih Dihasilkan",
    "stats.co2": "Emisi CO₂ Dikurangi",
    "stats.communities": "Komunitas Teraliri",
    "stats.supporters": "Total Supporter",
    "stats.energy_sub": "dari semua proyek",
    "stats.co2_sub": "metrik ton diselamatkan",
    "stats.communities_sub": "desa & sekolah",
    "stats.supporters_sub": "investor aktif",

    // Featured
    "featured.badge": "Proyek Unggulan",
    "featured.title": "Proyek yang Butuh Dukunganmu",
    "featured.sub": "Terverifikasi, berdampak, dan siap untuk investasimu.",
    "featured.view_all": "Lihat semua proyek",

    // How it works
    "how.badge": "Cara Kerja",
    "how.title": "Investasi dalam 3 Langkah Mudah",
    "how.sub": "GreenFund membuat investasi energi bersih terjangkau untuk semua — mulai Rp 50.000.",
    "how.step1_title": "Temukan Proyek",
    "how.step1_desc": "Jelajahi proyek energi terbarukan terverifikasi di seluruh Indonesia.",
    "how.step2_title": "Danai Pilihanmu",
    "how.step2_desc": "Kontribusi berapa saja melalui pembayaran aman. Setiap rupiah langsung ke proyek.",
    "how.step3_title": "Pantau Dampak",
    "how.step3_desc": "Saksikan investasimu menghasilkan kilowatt bersih dan penghematan CO₂ secara real-time.",

    // Map section
    "map_section.badge": "Peta Sebaran Proyek",
    "map_section.title": "Proyek di Seluruh Kepulauan Indonesia",
    "map_section.sub": "Dari Sabang hingga Merauke — mencakup tenaga surya, mikro-hidro, angin, biogas, dan biomassa.",
    "map_section.open": "Buka Peta Interaktif",
    "map_section.count": "proyek dipetakan",
    "map_section.view_all": "Lihat semua",

    // Explore
    "explore.title": "Jelajahi Proyek",
    "explore.subtitle": "Temukan dan danai proyek energi terbarukan di seluruh Indonesia.",
    "explore.active": "proyek aktif",
    "explore.search": "Cari proyek, lokasi...",
    "explore.found": "proyek ditemukan",
    "explore.for": "untuk",
    "explore.none": "Tidak ada proyek",
    "explore.none_sub": "Coba sesuaikan filter atau kata pencarian.",
    "explore.clear": "Hapus semua filter",
    "explore.cta_title": "Punya proyek energi terbarukan?",
    "explore.cta_sub": "Ajukan proyekmu untuk direview dan mulai mengumpulkan dana dari jaringan investor energi bersih terbesar Indonesia.",
    "explore.cta_btn": "Ajukan Proyekmu",

    // Project Card
    "card.days_left": "hari lagi",
    "card.backers": "pendukung",
    "card.support": "Dukung Proyek",
    "card.funded_badge": "Terdanai",

    // Project Detail
    "detail.fund_btn": "Danai Proyek Ini",
    "detail.fund_amount": "Jumlah Dana (Rp)",
    "detail.pay_method": "Pilih Metode Pembayaran",
    "detail.funding_label": "Mendanai",
    "detail.confirm": "Konfirmasi Pembayaran",
    "detail.back": "Kembali",
    "detail.processing": "Memproses pembayaran…",
    "detail.verify": "Memverifikasi dengan bank",
    "detail.success_title": "Dukunganmu telah diterima!",
    "detail.success_tx": "ID Transaksi",
    "detail.impact_preview": "Pratinjau Dampak",
    "detail.impact_desc": "Dana kamu akan menghasilkan ~{kwh} kWh dan mengimbangi {co2}t CO₂ per tahun.",
    "detail.download_cert": "Unduh Sertifikat",
    "detail.fund_again": "Danai lagi",
    "detail.escrow": "Terdaftar OJK. Dana ditahan dalam escrow hingga milestone tercapai.",
    "detail.backers_label": "Pendukung",
    "detail.days_left": "Hari Tersisa",
    "detail.trust": "Trust Score",
    "detail.story": "Cerita",
    "detail.updates": "Update",
    "detail.backers_tab": "Pendukung",
    "detail.before_after": "Sebelum & Sesudah",
    "detail.before": "Sebelum",
    "detail.after": "Sesudah",
    "detail.transformation": "Transformasi Proyek",

    // Notifications
    "notif.title": "Notifikasi",
    "notif.mark_all": "Tandai semua dibaca",
    "notif.empty": "Belum ada notifikasi",

    // Map page
    "mappage.badge": "Peta Sebaran Proyek",
    "mappage.title": "Distribusi Proyek di Indonesia",
    "mappage.subtitle": "Temukan proyek energi terbarukan di seluruh kepulauan Indonesia — dari Sabang sampai Merauke.",
    "mappage.total": "Total Proyek",
    "mappage.active": "Aktif",
    "mappage.funded": "Terdanai",
    "mappage.review": "Review",

    // Create project
    "create.title": "Ajukan Proyekmu",
    "create.subtitle": "Hubungkan proyek energi terbarukan kamu dengan 24.800+ investor.",
    "create.pin_label": "Titik Lokasi di Peta",
    "create.pin_hint": "Klik peta atau seret pin untuk menandai lokasi proyek",
    "create.coords": "Koordinat",

    // Common
    "common.verified_org": "Organisasi Terverifikasi",
    "common.back_home": "Kembali ke Beranda",
    "common.view_project": "Lihat Proyek",
  },
  en: {
    "nav.explore": "Explore Projects",
    "nav.impact": "Impact Portfolio",
    "nav.map": "Project Map",
    "nav.about": "About",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "nav.logout": "Log Out",
    "nav.dashboards": "Dashboards",
    "nav.supporter_dash": "Supporter Dashboard",
    "nav.owner_dash": "Project Owner",
    "nav.admin": "Admin Panel",

    "hero.badge": "OJK Licensed · 127 projects funded · Rp 42B+ raised",
    "hero.title1": "Fund the Future of",
    "hero.title2": "Clean Energy",
    "hero.subtitle": "Support renewable energy projects across Indonesia and track your measurable environmental impact.",
    "hero.cta_explore": "Explore Projects",
    "hero.cta_impact": "View Impact Portfolio",
    "hero.social": "supporters already invested",

    "stats.badge": "Live Statistics",
    "stats.title": "Real Impact, Real Numbers",
    "stats.subtitle": "Every project on GreenFund is tracked, measured, and verified. These numbers update in real time.",
    "stats.energy": "Clean Energy Generated",
    "stats.co2": "CO₂ Emissions Reduced",
    "stats.communities": "Communities Powered",
    "stats.supporters": "Total Supporters",
    "stats.energy_sub": "across all projects",
    "stats.co2_sub": "metric tons saved",
    "stats.communities_sub": "villages & schools",
    "stats.supporters_sub": "active investors",

    "featured.badge": "Featured Projects",
    "featured.title": "Projects Needing Support",
    "featured.sub": "Verified, impactful, and ready for your investment.",
    "featured.view_all": "View all projects",

    "how.badge": "How It Works",
    "how.title": "Invest in 3 Simple Steps",
    "how.sub": "GreenFund makes clean energy investment accessible to everyone — from Rp 50,000.",
    "how.step1_title": "Discover Projects",
    "how.step1_desc": "Browse verified renewable energy projects across Indonesia.",
    "how.step2_title": "Fund Your Choice",
    "how.step2_desc": "Contribute any amount via secure payment. Every rupiah goes directly to the project.",
    "how.step3_title": "Track Impact",
    "how.step3_desc": "Watch your investment generate clean kilowatts and CO₂ savings in real time.",

    "map_section.badge": "Project Distribution Map",
    "map_section.title": "Projects Across the Indonesian Archipelago",
    "map_section.sub": "From Sabang to Merauke — solar, micro-hydro, wind, biogas, and biomass.",
    "map_section.open": "Open Interactive Map",
    "map_section.count": "projects mapped",
    "map_section.view_all": "View all",

    "explore.title": "Explore Projects",
    "explore.subtitle": "Discover and fund renewable energy projects across Indonesia.",
    "explore.active": "active projects",
    "explore.search": "Search projects, locations...",
    "explore.found": "projects found",
    "explore.for": "for",
    "explore.none": "No projects found",
    "explore.none_sub": "Try adjusting your filters or search term.",
    "explore.clear": "Clear all filters",
    "explore.cta_title": "Have a renewable energy project?",
    "explore.cta_sub": "Submit your project for review and start raising funds from Indonesia's largest clean energy investor network.",
    "explore.cta_btn": "Submit Your Project",

    "card.days_left": "days left",
    "card.backers": "backers",
    "card.support": "Support Project",
    "card.funded_badge": "Funded",

    "detail.fund_btn": "Fund This Project",
    "detail.fund_amount": "Fund Amount (Rp)",
    "detail.pay_method": "Choose Payment Method",
    "detail.funding_label": "Funding",
    "detail.confirm": "Confirm Payment",
    "detail.back": "Back",
    "detail.processing": "Processing payment…",
    "detail.verify": "Verifying with bank",
    "detail.success_title": "Your support was received!",
    "detail.success_tx": "Transaction ID",
    "detail.impact_preview": "Impact Preview",
    "detail.impact_desc": "Your {kwh} kWh will offset {co2}t CO₂ per year.",
    "detail.download_cert": "Download Certificate",
    "detail.fund_again": "Fund again",
    "detail.escrow": "OJK licensed. Funds held in escrow until milestone reached.",
    "detail.backers_label": "Supporters",
    "detail.days_left": "Days Left",
    "detail.trust": "Trust Score",
    "detail.story": "Story",
    "detail.updates": "Updates",
    "detail.backers_tab": "Backers",
    "detail.before_after": "Before & After",
    "detail.before": "Before",
    "detail.after": "After",
    "detail.transformation": "Project Transformation",

    "notif.title": "Notifications",
    "notif.mark_all": "Mark all as read",
    "notif.empty": "No notifications yet",

    "mappage.badge": "Project Distribution",
    "mappage.title": "Project Distribution Across Indonesia",
    "mappage.subtitle": "Find renewable energy projects from Sabang to Merauke.",
    "mappage.total": "Total Projects",
    "mappage.active": "Active",
    "mappage.funded": "Funded",
    "mappage.review": "Review",

    "create.title": "Submit Your Project",
    "create.subtitle": "Connect your renewable energy project with 24,800+ investors.",
    "create.pin_label": "Pin Location on Map",
    "create.pin_hint": "Click the map or drag the pin to mark your project's location",
    "create.coords": "Coordinates",

    "common.verified_org": "Verified Organizer",
    "common.back_home": "Back to Home",
    "common.view_project": "View Project",
  },
} as const;

type TranslationKey = keyof (typeof T)["id"];

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("gf-lang") as Lang) ?? "id";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("gf-lang", l);
  };

  const t = (key: TranslationKey): string => {
    return (T[lang] as Record<string, string>)[key]
      ?? (T["en"] as Record<string, string>)[key]
      ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useT must be used inside LanguageProvider");
  return ctx;
}
