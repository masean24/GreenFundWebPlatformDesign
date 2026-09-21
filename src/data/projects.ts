export interface Project {
  id: string;
  title: string;
  location: string;
  province: string;
  category: "solar" | "wind" | "hydro" | "biogas" | "biomass";
  description: string;
  raised: number;
  goal: number;
  backers: number;
  daysLeft: number;
  status: "active" | "funded" | "review";
  image: string;
  co2Reduced: number;
  energyKwh: number;
  beneficiaries: number;
  organization: string;
  trustScore: number;
  featured?: boolean;
  coordinates?: [number, number]; // [longitude, latitude]
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Solar Energy for Sukamaju School",
    location: "Sukamaju, Sulawesi",
    province: "Sulawesi Selatan",
    category: "solar",
    description: "Install 48 solar panels to power SD Negeri Sukamaju and 3 surrounding schools, eliminating costly diesel generators and providing reliable electricity for 840 students.",
    raised: 142000000,
    goal: 180000000,
    backers: 312,
    daysLeft: 18,
    status: "active",
    image: "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=800&h=500&fit=crop&auto=format",
    co2Reduced: 42.6,
    energyKwh: 58400,
    beneficiaries: 840,
    organization: "Yayasan Pendidikan Nusantara",
    trustScore: 94,
    featured: true,
    coordinates: [120.1, -2.3],
  },
  {
    id: "2",
    title: "Micro-Hydro Power for Desa Wae Rebo",
    location: "Ruteng, Flores",
    province: "Nusa Tenggara Timur",
    category: "hydro",
    description: "A 15kW micro-hydro installation powered by the Wae Rebo river to bring 24/7 electricity to this remote UNESCO-heritage village of 1,200 residents.",
    raised: 210000000,
    goal: 250000000,
    backers: 487,
    daysLeft: 7,
    status: "active",
    image: "https://images.unsplash.com/photo-1452179535021-368bb0edc3a8?w=800&h=500&fit=crop&auto=format",
    co2Reduced: 68.4,
    energyKwh: 131400,
    beneficiaries: 1200,
    organization: "PT Energi Flores Mandiri",
    trustScore: 97,
    featured: true,
    coordinates: [120.47, -8.62],
  },
  {
    id: "3",
    title: "Biogas from Rice Straw — Klaten Farmers Collective",
    location: "Klaten, Central Java",
    province: "Jawa Tengah",
    category: "biogas",
    description: "Convert rice straw waste from 120 hectares into biogas energy, providing cooking fuel for 350 farming families while reducing methane emissions by 78%.",
    raised: 87000000,
    goal: 120000000,
    backers: 198,
    daysLeft: 32,
    status: "active",
    image: "https://images.unsplash.com/photo-1508791290064-c27cc1ef7a9a?w=800&h=500&fit=crop&auto=format",
    co2Reduced: 31.2,
    energyKwh: 42000,
    beneficiaries: 350,
    organization: "Koperasi Tani Sejahtera Klaten",
    trustScore: 88,
    featured: true,
    coordinates: [110.61, -7.71],
  },
  {
    id: "4",
    title: "Wind Turbine Array — Pantai Selatan Jogja",
    location: "Gunung Kidul, Yogyakarta",
    province: "DI Yogyakarta",
    category: "wind",
    description: "Deploy 6 small wind turbines along the southern coastline to power a fishing cooperative, cold storage facility, and community center serving 2,400 fisherfolk.",
    raised: 320000000,
    goal: 480000000,
    backers: 621,
    daysLeft: 45,
    status: "active",
    image: "https://images.unsplash.com/photo-1548613053-22087dd8edb8?w=800&h=500&fit=crop&auto=format",
    co2Reduced: 95.8,
    energyKwh: 219600,
    beneficiaries: 2400,
    organization: "Koperasi Nelayan Pantai Selatan",
    trustScore: 91,
    coordinates: [110.65, -8.10],
  },
  {
    id: "5",
    title: "Rooftop Solar for Pasar Beringharjo",
    location: "Kota Yogyakarta",
    province: "DI Yogyakarta",
    category: "solar",
    description: "Install 120kWp rooftop solar on the historic Beringharjo market to reduce electricity bills for 800+ small traders and fund daily market operations.",
    raised: 450000000,
    goal: 450000000,
    backers: 1024,
    daysLeft: 0,
    status: "funded",
    image: "https://images.unsplash.com/photo-1703195966021-1ee2bea51662?w=800&h=500&fit=crop&auto=format",
    co2Reduced: 112.4,
    energyKwh: 175200,
    beneficiaries: 800,
    organization: "PEMKOT Yogyakarta",
    trustScore: 99,
    coordinates: [110.37, -7.80],
  },
  {
    id: "6",
    title: "Solar Water Pump — Desa Kering, NTT",
    location: "Kupang, Nusa Tenggara Timur",
    province: "Nusa Tenggara Timur",
    category: "solar",
    description: "Solar-powered water pumping system to bring clean water access to 600 families in drought-prone eastern Indonesia, eliminating 4km daily water-fetching walks.",
    raised: 55000000,
    goal: 95000000,
    backers: 143,
    daysLeft: 28,
    status: "active",
    image: "https://images.unsplash.com/photo-1784985363357-86263fcea5bb?w=800&h=500&fit=crop&auto=format",
    co2Reduced: 18.9,
    energyKwh: 28800,
    beneficiaries: 600,
    organization: "NGO Air Bersih NTT",
    trustScore: 85,
    coordinates: [123.61, -10.17],
  },
];

export const formatRupiah = (amount: number): string => {
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`;
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(0)} jt`;
  return `Rp ${amount.toLocaleString("id-ID")}`;
};

export const categoryLabels: Record<Project["category"], string> = {
  solar: "Solar Energy",
  wind: "Wind Power",
  hydro: "Micro-Hydro",
  biogas: "Biogas",
  biomass: "Biomass",
};

export const categoryColors: Record<Project["category"], string> = {
  solar: "#F59E0B",
  wind: "#3B82F6",
  hydro: "#06B6D4",
  biogas: "#8B5CF6",
  biomass: "#10B981",
};
