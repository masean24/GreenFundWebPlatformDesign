import { createContext, useContext, useState, type ReactNode } from "react";
import { projects as initialProjects, type Project } from "../data/projects";

export type Role = "supporter" | "owner" | "admin" | null;

export interface DemoUser {
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

const DEMO_ACCOUNTS: DemoUser[] = [
  { name: "Budi Wicaksono", email: "supporter@demo.com", role: "supporter", avatar: "BW" },
  { name: "Yayasan Pendidikan Nusantara", email: "owner@demo.com", role: "owner", avatar: "YP" },
  { name: "Admin GreenFund", email: "admin@demo.com", role: "admin", avatar: "AG" },
];

// Projects that are pending admin approval (not yet in explore)
export interface PendingProject {
  id: string;
  title: string;
  org: string;
  location: string;
  province: string;
  category: "solar" | "wind" | "hydro" | "biogas" | "biomass";
  goal: number;
  submitted: string;
  trustScore: number;
  docs: boolean;
  image: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "revision";
  coordinates?: [number, number];
}

const INITIAL_PENDING: PendingProject[] = [
  {
    id: "pend-1",
    title: "Solar Panels for Pesantren Al-Ikhlas",
    org: "Yayasan Al-Ikhlas Aceh",
    location: "Aceh Besar, Aceh",
    province: "Aceh",
    category: "solar",
    goal: 95000000,
    submitted: "2 days ago",
    trustScore: 72,
    docs: true,
    image: "https://images.unsplash.com/photo-1703195966021-1ee2bea51662?w=400&h=300&fit=crop",
    description: "Install 36 solar panels to power Pesantren Al-Ikhlas and reduce reliance on PLN grid, saving Rp 3.2M/month in electricity costs for 480 students.",
    status: "pending",
    coordinates: [95.5, 5.5],
  },
  {
    id: "pend-2",
    title: "Biomass Power — Kalimantan Logging Cooperative",
    org: "Koperasi Hutan Mandiri",
    location: "Palangka Raya, Kalimantan Tengah",
    province: "Kalimantan Tengah",
    category: "biomass",
    goal: 340000000,
    submitted: "4 days ago",
    trustScore: 85,
    docs: true,
    image: "https://images.unsplash.com/photo-1508791290064-c27cc1ef7a9a?w=400&h=300&fit=crop",
    description: "Convert wood-processing waste into 80kW biomass electricity for 600 cooperative member families, eliminating the need for expensive diesel generators.",
    status: "pending",
    coordinates: [113.91, -2.21],
  },
  {
    id: "pend-3",
    title: "Micro-Hydro — Lembah Anai, Sumatera Barat",
    org: "BUMDes Lembah Anai",
    location: "Padang Panjang, Sumatera Barat",
    province: "Sumatera Barat",
    category: "hydro",
    goal: 220000000,
    submitted: "6 days ago",
    trustScore: 91,
    docs: false,
    image: "https://images.unsplash.com/photo-1452179535021-368bb0edc3a8?w=400&h=300&fit=crop",
    description: "A 20kW micro-hydro installation on the Lembah Anai river to bring 24/7 clean electricity to 3 villages totaling 1,800 residents.",
    status: "pending",
    coordinates: [100.38, -0.47],
  },
];

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning";
  forRole: Role | "all";
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: "n1", title: "🌱 Milestone tercapai!", message: "GreenFund melampaui Rp 42M total dana tersalurkan.", time: "1 jam lalu", read: false, type: "success", forRole: "all" },
  { id: "n2", title: "📊 Proyek mendekati target", message: "Solar Sukamaju sudah 78% terfundasi. 18 hari tersisa!", time: "3 jam lalu", read: false, type: "info", forRole: "supporter" },
  { id: "n3", title: "📄 Laporan dampak tersedia", message: "Impact report Agustus 2026 siap diunduh.", time: "1 hari lalu", read: false, type: "info", forRole: "supporter" },
  { id: "n4", title: "🔔 Update baru dari proyek", message: "Micro-Hydro Wae Rebo: Panel A sudah terpasang!", time: "2 hari lalu", read: true, type: "info", forRole: "supporter" },
  { id: "n5", title: "✅ Proyek disetujui!", message: "Proyekmu telah disetujui admin. Mulai fundraising sekarang.", time: "2 jam lalu", read: false, type: "success", forRole: "owner" },
  { id: "n6", title: "👥 5 supporter baru", message: "5 investor baru mendukung proyekmu minggu ini.", time: "6 jam lalu", read: false, type: "info", forRole: "owner" },
  { id: "n7", title: "⚠️ Pengingat dokumen", message: "Upload dokumen AMDAL sebelum 30 Sep untuk verifikasi.", time: "1 hari lalu", read: true, type: "warning", forRole: "owner" },
  { id: "n8", title: "🔔 3 proyek menunggu review", message: "Ada 3 pengajuan baru yang butuh persetujuan.", time: "30 menit lalu", read: false, type: "warning", forRole: "admin" },
  { id: "n9", title: "📈 Weekly summary", message: "Rp 2.4M dana masuk minggu ini dari 48 transaksi.", time: "1 hari lalu", read: false, type: "info", forRole: "admin" },
  { id: "n10", title: "⏰ Deadline alert", message: "2 proyek mendekati batas waktu fundraising.", time: "2 hari lalu", read: true, type: "warning", forRole: "admin" },
];

// Funded projects in supporter's portfolio
export interface FundedProject {
  projectId: string;
  amount: number;
  date: string;
  txId: string;
}

interface AppState {
  user: DemoUser | null;
  login: (email: string, password: string) => boolean;
  loginAs: (role: Role) => void;
  logout: () => void;
  projects: Project[];
  pendingProjects: PendingProject[];
  approveProject: (id: string) => void;
  rejectProject: (id: string) => void;
  requestRevision: (id: string) => void;
  portfolio: FundedProject[];
  fundProject: (projectId: string, amount: number) => void;
  notifications: AppNotification[];
  markNotifRead: (id: string) => void;
  markAllRead: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [pendingProjects, setPendingProjects] = useState<PendingProject[]>(INITIAL_PENDING);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const markNotifRead = (id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const [portfolio, setPortfolio] = useState<FundedProject[]>([
    { projectId: "1", amount: 500000, date: "Jun 2025", txId: "GF-2025-001" },
    { projectId: "2", amount: 1000000, date: "Jul 2025", txId: "GF-2025-042" },
    { projectId: "3", amount: 250000, date: "Aug 2025", txId: "GF-2025-118" },
  ]);

  const login = (email: string, _password: string): boolean => {
    const account = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (account) {
      setUser(account);
      return true;
    }
    return false;
  };

  const loginAs = (role: Role) => {
    const account = DEMO_ACCOUNTS.find(a => a.role === role);
    if (account) setUser(account);
  };

  const logout = () => setUser(null);

  const approveProject = (id: string) => {
    const pending = pendingProjects.find(p => p.id === id);
    if (!pending) return;

    // Move to live projects
    const newProject: Project = {
      id: pending.id,
      title: pending.title,
      location: pending.location,
      province: pending.province,
      category: pending.category,
      description: pending.description,
      raised: 0,
      goal: pending.goal,
      backers: 0,
      daysLeft: 45,
      status: "active",
      image: pending.image,
      co2Reduced: Math.round(pending.goal / 3000000 * 10) / 10,
      energyKwh: Math.round(pending.goal / 2000),
      beneficiaries: Math.round(pending.goal / 100000),
      organization: pending.org,
      trustScore: pending.trustScore,
      coordinates: pending.coordinates,
    };
    setProjects(prev => [...prev, newProject]);
    setPendingProjects(prev => prev.map(p => p.id === id ? { ...p, status: "approved" } : p));
  };

  const rejectProject = (id: string) => {
    setPendingProjects(prev => prev.map(p => p.id === id ? { ...p, status: "rejected" } : p));
  };

  const requestRevision = (id: string) => {
    setPendingProjects(prev => prev.map(p => p.id === id ? { ...p, status: "revision" } : p));
  };

  const fundProject = (projectId: string, amount: number) => {
    // Update project raised amount and backers
    setProjects(prev => prev.map(p =>
      p.id === projectId
        ? { ...p, raised: p.raised + amount, backers: p.backers + 1 }
        : p
    ));
    // Add to portfolio
    const txId = `GF-${Date.now()}`;
    setPortfolio(prev => [...prev, {
      projectId,
      amount,
      date: new Date().toLocaleDateString("id-ID", { month: "short", year: "numeric" }),
      txId,
    }]);
  };

  return (
    <AppContext.Provider value={{
      user, login, loginAs, logout,
      projects, pendingProjects, approveProject, rejectProject, requestRevision,
      portfolio, fundProject,
      notifications, markNotifRead, markAllRead,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
