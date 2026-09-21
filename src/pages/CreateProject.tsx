import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight, Upload, Info, Leaf, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useT } from "../i18n/LanguageContext";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const steps = [
  { id: 1, label: "Organization", short: "Org Info" },
  { id: 2, label: "Project Info", short: "Project" },
  { id: 3, label: "Funding Details", short: "Funding" },
  { id: 4, label: "Impact Metrics", short: "Impact" },
  { id: 5, label: "Documents", short: "Docs" },
  { id: 6, label: "Review & Submit", short: "Review" },
];

interface FormData {
  orgName: string; orgType: string; orgAddress: string; orgDesc: string; orgLegal: string;
  title: string; category: string; location: string; province: string; description: string; timeline: string;
  lat: string; lng: string;
  goal: string; minInvestment: string; fundingType: string; deadline: string;
  energyKwh: string; co2: string; beneficiaries: string; sdgAlignment: string[];
  docs: string[];
}

const emptyForm: FormData = {
  orgName: "", orgType: "", orgAddress: "", orgDesc: "", orgLegal: "",
  title: "", category: "", location: "", province: "", description: "", timeline: "",
  lat: "-2.5", lng: "118",
  goal: "", minInvestment: "50000", fundingType: "", deadline: "",
  energyKwh: "", co2: "", beneficiaries: "", sdgAlignment: [],
  docs: [],
};

const sdgOptions = ["SDG 7: Affordable and Clean Energy", "SDG 13: Climate Action", "SDG 11: Sustainable Cities", "SDG 1: No Poverty", "SDG 4: Quality Education", "SDG 6: Clean Water"];

// Draggable marker with click-to-place
const pinIcon = L.divIcon({
  html: `<div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
    <div style="width:18px;height:18px;background:#14432B;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>
  </div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 26],
});

function MapClickHandler({ onMove }: { onMove: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onMove(e.latlng.lat, e.latlng.lng) });
  return null;
}

function LocationPicker({ lat, lng, onChange }: {
  lat: number; lng: number; onChange: (lat: number, lng: number) => void;
}) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={5}
      style={{ height: 280, width: "100%", borderRadius: "16px" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      <MapClickHandler onMove={onChange} />
      <Marker
        position={[lat, lng]}
        icon={pinIcon}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const pos = (e.target as L.Marker).getLatLng();
            onChange(pos.lat, pos.lng);
          },
        }}
      />
    </MapContainer>
  );
}

export default function CreateProject() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const { t } = useT();

  const update = (field: keyof FormData, value: string) => setForm(prev => ({ ...prev, [field]: value }));
  const toggleSdg = (sdg: string) => setForm(prev => ({
    ...prev,
    sdgAlignment: prev.sdgAlignment.includes(sdg)
      ? prev.sdgAlignment.filter(s => s !== sdg)
      : [...prev.sdgAlignment, sdg]
  }));

  const inputClass = "w-full px-4 py-3 rounded-2xl border border-[#E5E8E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50] bg-white transition-colors";
  const labelClass = "block text-sm font-medium text-[#1E2A26] mb-1.5";
  const fieldClass = "mb-5";

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAFAF7]">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-[#E7F5EA] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-[#14432B]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1E2A26] mb-3">Project Submitted!</h1>
            <p className="text-[#6B7280] mb-8 leading-relaxed">
              Your project <strong>{form.title || "has"}</strong> been submitted for review. Our team will verify your documents and respond within 3–5 business days.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/dashboard/owner" className="px-6 py-3 rounded-2xl bg-[#14432B] text-white font-semibold text-sm hover:bg-[#1a5436] transition-colors">
                Go to Dashboard
              </Link>
              <Link to="/explore" className="px-6 py-3 rounded-2xl border border-[#E5E8E4] text-sm font-medium text-[#6B7280] hover:bg-[#F4F4F0] transition-colors">
                Explore Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-[#14432B] px-6 py-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-white/60 mb-4">
              <Link to="/" className="hover:text-white">Home</Link>
              <ChevronRight size={12} />
              <span className="text-white">Create Project</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{t("create.title")}</h1>
            <p className="text-white/60 text-sm">{t("create.subtitle")}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Progress Stepper */}
          <div className="bg-white rounded-3xl p-6 shadow-card mb-8">
            <div className="flex items-center overflow-x-auto">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center shrink-0">
                  <button
                    onClick={() => s.id < step ? setStep(s.id as Step) : undefined}
                    className="flex items-center gap-2 group"
                    disabled={s.id > step}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      s.id < step ? "bg-[#4CAF50] text-white" :
                      s.id === step ? "bg-[#14432B] text-white" : "bg-[#F4F4F0] text-[#9CA3AF]"
                    }`}>
                      {s.id < step ? <CheckCircle2 size={16} /> : s.id}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${
                      s.id === step ? "text-[#1E2A26]" : s.id < step ? "text-[#4CAF50]" : "text-[#9CA3AF]"
                    }`}>{s.short}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <div className={`mx-2 h-px w-8 md:w-12 ${s.id < step ? "bg-[#4CAF50]" : "bg-[#E5E8E4]"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-8 shadow-card">
            <h2 className="text-xl font-bold text-[#1E2A26] mb-1">{steps[step - 1].label}</h2>
            <p className="text-sm text-[#9CA3AF] mb-8">Step {step} of {steps.length}</p>

            {/* Step 1: Organization */}
            {step === 1 && (
              <div>
                <div className={fieldClass}>
                  <label className={labelClass}>Organization Name *</label>
                  <input className={inputClass} value={form.orgName} onChange={e => update("orgName", e.target.value)} placeholder="e.g. Yayasan Energi Hijau Nusantara" />
                </div>
                <div className={fieldClass}>
                  <label className={labelClass}>Organization Type *</label>
                  <select className={inputClass} value={form.orgType} onChange={e => update("orgType", e.target.value)}>
                    <option value="">Select type...</option>
                    <option>Non-profit Foundation (Yayasan)</option>
                    <option>Cooperative (Koperasi)</option>
                    <option>Village-Owned Enterprise (BUMDes)</option>
                    <option>SME / PT</option>
                    <option>NGO</option>
                    <option>School / Educational Institution</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className={labelClass}>Province *</label>
                    <select className={inputClass} value={form.province} onChange={e => update("province", e.target.value)}>
                      <option value="">Select province...</option>
                      {["DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "DI Yogyakarta", "Sumatera Utara", "Sumatera Barat", "Sulawesi Selatan", "Nusa Tenggara Timur", "Kalimantan Timur", "Papua"].map(p => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Legal Registration No.</label>
                    <input className={inputClass} value={form.orgLegal} onChange={e => update("orgLegal", e.target.value)} placeholder="Notarial deed / NIB number" />
                  </div>
                </div>
                <div className={fieldClass}>
                  <label className={labelClass}>Organization Description</label>
                  <textarea className={`${inputClass} h-24 resize-none`} value={form.orgDesc} onChange={e => update("orgDesc", e.target.value)} placeholder="Briefly describe your organization's mission and track record..." />
                </div>
              </div>
            )}

            {/* Step 2: Project Info */}
            {step === 2 && (
              <div>
                <div className={fieldClass}>
                  <label className={labelClass}>Project Title *</label>
                  <input className={inputClass} value={form.title} onChange={e => update("title", e.target.value)} placeholder="e.g. Solar Energy for SDN Harapan, Kalimantan" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className={labelClass}>Energy Category *</label>
                    <select className={inputClass} value={form.category} onChange={e => update("category", e.target.value)}>
                      <option value="">Select category...</option>
                      <option>Solar Energy</option>
                      <option>Wind Power</option>
                      <option>Micro-Hydro</option>
                      <option>Biogas</option>
                      <option>Biomass</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Project Location *</label>
                    <input className={inputClass} value={form.location} onChange={e => update("location", e.target.value)} placeholder="e.g. Desa Sukamaju, Sulawesi Selatan" />
                  </div>
                </div>

                {/* Location Picker Map */}
                <div className={fieldClass}>
                  <label className={labelClass}>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#14432B]" />
                      {t("create.pin_label")}
                    </span>
                  </label>
                  <p className="text-xs text-[#9CA3AF] mb-3">{t("create.pin_hint")}</p>
                  <div className="rounded-2xl overflow-hidden border border-[#E5E8E4] shadow-sm mb-3">
                    <LocationPicker
                      lat={parseFloat(form.lat) || -2.5}
                      lng={parseFloat(form.lng) || 118}
                      onChange={(lat, lng) => {
                        update("lat", lat.toFixed(6));
                        update("lng", lng.toFixed(6));
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F4F4F0] text-xs font-mono text-[#6B7280]">
                      <span className="text-[#9CA3AF]">Lat</span>
                      <span className="font-semibold text-[#1E2A26]">{parseFloat(form.lat).toFixed(4)}°</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F4F4F0] text-xs font-mono text-[#6B7280]">
                      <span className="text-[#9CA3AF]">Lng</span>
                      <span className="font-semibold text-[#1E2A26]">{parseFloat(form.lng).toFixed(4)}°</span>
                    </div>
                    <span className="text-xs text-[#9CA3AF]">{t("create.coords")}: klik peta untuk memperbarui</span>
                  </div>
                </div>

                <div className={fieldClass}>
                  <label className={labelClass}>Project Description *</label>
                  <textarea className={`${inputClass} h-32 resize-none`} value={form.description} onChange={e => update("description", e.target.value)} placeholder="Describe the problem, your solution, who benefits, and why this project matters..." />
                </div>
                <div className={fieldClass}>
                  <label className={labelClass}>Project Timeline</label>
                  <input className={inputClass} value={form.timeline} onChange={e => update("timeline", e.target.value)} placeholder="e.g. 6 months: 2 months planning, 2 months procurement, 2 months installation" />
                </div>
              </div>
            )}

            {/* Step 3: Funding */}
            {step === 3 && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className={labelClass}>Funding Goal (Rp) *</label>
                    <input type="number" className={inputClass} value={form.goal} onChange={e => update("goal", e.target.value)} placeholder="e.g. 180000000" min="10000000" />
                    <p className="text-xs text-[#9CA3AF] mt-1">Minimum: Rp 10,000,000</p>
                  </div>
                  <div>
                    <label className={labelClass}>Minimum Investment (Rp) *</label>
                    <select className={inputClass} value={form.minInvestment} onChange={e => update("minInvestment", e.target.value)}>
                      <option value="50000">Rp 50,000</option>
                      <option value="100000">Rp 100,000</option>
                      <option value="250000">Rp 250,000</option>
                      <option value="500000">Rp 500,000</option>
                      <option value="1000000">Rp 1,000,000</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className={labelClass}>Funding Type *</label>
                    <select className={inputClass} value={form.fundingType} onChange={e => update("fundingType", e.target.value)}>
                      <option value="">Select type...</option>
                      <option>Donation-based (no return)</option>
                      <option>Revenue-sharing (% of savings)</option>
                      <option>Social Bond</option>
                      <option>Grant Co-funding</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Campaign Deadline *</label>
                    <input type="date" className={inputClass} value={form.deadline} onChange={e => update("deadline", e.target.value)} />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#E7F5EA] flex items-start gap-3">
                  <Info size={16} className="text-[#14432B] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#14432B]">
                    All funds are held in escrow by our licensed custodian bank (Bank Mandiri) until project milestones are verified. GreenFund charges a 5% platform fee on successfully funded projects.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Impact */}
            {step === 4 && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                  <div>
                    <label className={labelClass}>Annual Energy (kWh) *</label>
                    <input type="number" className={inputClass} value={form.energyKwh} onChange={e => update("energyKwh", e.target.value)} placeholder="e.g. 58400" />
                    <p className="text-xs text-[#9CA3AF] mt-1">Estimated annual generation</p>
                  </div>
                  <div>
                    <label className={labelClass}>CO₂ Avoided (tons/yr) *</label>
                    <input type="number" className={inputClass} value={form.co2} onChange={e => update("co2", e.target.value)} placeholder="e.g. 42.6" step="0.1" />
                    <p className="text-xs text-[#9CA3AF] mt-1">vs. diesel baseline</p>
                  </div>
                  <div>
                    <label className={labelClass}>Direct Beneficiaries *</label>
                    <input type="number" className={inputClass} value={form.beneficiaries} onChange={e => update("beneficiaries", e.target.value)} placeholder="e.g. 840" />
                    <p className="text-xs text-[#9CA3AF] mt-1">People directly impacted</p>
                  </div>
                </div>
                <div className={fieldClass}>
                  <label className={labelClass}>UN Sustainable Development Goal Alignment</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {sdgOptions.map(sdg => (
                      <button
                        key={sdg}
                        type="button"
                        onClick={() => toggleSdg(sdg)}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-left text-xs transition-colors ${
                          form.sdgAlignment.includes(sdg)
                            ? "border-[#14432B] bg-[#E7F5EA] text-[#14432B]"
                            : "border-[#E5E8E4] text-[#6B7280] hover:border-[#14432B]/30"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${form.sdgAlignment.includes(sdg) ? "border-[#14432B] bg-[#14432B]" : "border-[#9CA3AF]"}`}>
                          {form.sdgAlignment.includes(sdg) && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        {sdg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Documents */}
            {step === 5 && (
              <div>
                <p className="text-sm text-[#6B7280] mb-6">Upload required documents for verification. All documents are reviewed by our compliance team within 2–3 business days.</p>
                {[
                  { label: "Organization Legal Document (Akta Notaris / NIB)", required: true },
                  { label: "Project Technical Proposal (PDF)", required: true },
                  { label: "Impact Methodology Report", required: true },
                  { label: "Financial Statements (Last 2 years)", required: false },
                  { label: "Community Letter of Support", required: false },
                  { label: "Environmental Permit (AMDAL/UKL-UPL)", required: false },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border border-[#E5E8E4] rounded-2xl mb-3 hover:border-[#14432B]/30 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-[#F4F4F0] flex items-center justify-center shrink-0">
                      <Upload size={18} className="text-[#9CA3AF]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1E2A26]">{doc.label}</p>
                      <p className="text-xs text-[#9CA3AF]">{doc.required ? "Required" : "Optional"} · PDF, max 10MB</p>
                    </div>
                    <button className="px-4 py-2 rounded-xl text-xs font-medium bg-[#E7F5EA] text-[#14432B] hover:bg-[#14432B] hover:text-white transition-colors">
                      Upload
                    </button>
                  </div>
                ))}
                <div className="mt-4 p-4 rounded-2xl bg-[#FEF3C7] flex items-start gap-3">
                  <Info size={16} className="text-[#D97706] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#D97706]">
                    All documents are encrypted and stored securely. They are only accessible to GreenFund's compliance team and OJK auditors.
                  </p>
                </div>
              </div>
            )}

            {/* Step 6: Review */}
            {step === 6 && (
              <div>
                <div className="space-y-4">
                  {[
                    { section: "Organization", fields: [
                      { key: "Organization Name", val: form.orgName || "—" },
                      { key: "Type", val: form.orgType || "—" },
                      { key: "Province", val: form.province || "—" },
                    ]},
                    { section: "Project", fields: [
                      { key: "Title", val: form.title || "—" },
                      { key: "Category", val: form.category || "—" },
                      { key: "Location", val: form.location || "—" },
                      { key: "Coordinates", val: form.lat !== "-2.5" ? `${parseFloat(form.lat).toFixed(4)}°, ${parseFloat(form.lng).toFixed(4)}°` : "—" },
                    ]},
                    { section: "Funding", fields: [
                      { key: "Goal", val: form.goal ? `Rp ${Number(form.goal).toLocaleString("id-ID")}` : "—" },
                      { key: "Min Investment", val: `Rp ${Number(form.minInvestment).toLocaleString("id-ID")}` },
                      { key: "Type", val: form.fundingType || "—" },
                    ]},
                    { section: "Impact", fields: [
                      { key: "Annual Energy", val: form.energyKwh ? `${Number(form.energyKwh).toLocaleString()} kWh` : "—" },
                      { key: "CO₂ Avoided", val: form.co2 ? `${form.co2} t/yr` : "—" },
                      { key: "Beneficiaries", val: form.beneficiaries || "—" },
                    ]},
                  ].map(section => (
                    <div key={section.section} className="border border-[#E5E8E4] rounded-2xl overflow-hidden">
                      <div className="px-4 py-3 bg-[#FAFAF7] border-b border-[#E5E8E4]">
                        <h4 className="text-sm font-semibold text-[#1E2A26]">{section.section}</h4>
                      </div>
                      <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {section.fields.map(f => (
                          <div key={f.key}>
                            <div className="text-xs text-[#9CA3AF]">{f.key}</div>
                            <div className="text-sm font-medium text-[#1E2A26]">{f.val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-2xl bg-[#E7F5EA] flex items-start gap-3">
                  <Leaf size={16} className="text-[#14432B] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#14432B] leading-relaxed">
                    By submitting, you confirm that all information provided is accurate and complete, and agree to GreenFund's <a href="#" className="underline font-medium">Terms of Service</a> and <a href="#" className="underline font-medium">Project Guidelines</a>.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-[#E5E8E4]">
              {step > 1 && (
                <button
                  onClick={() => setStep(prev => (prev - 1) as Step)}
                  className="px-6 py-3 rounded-2xl border border-[#E5E8E4] text-sm font-medium text-[#6B7280] hover:bg-[#F4F4F0] transition-colors"
                >
                  Back
                </button>
              )}
              <div className="flex-1" />
              {step < 6 ? (
                <button
                  onClick={() => setStep(prev => (prev + 1) as Step)}
                  className="px-6 py-3 rounded-2xl bg-[#14432B] hover:bg-[#1a5436] text-white font-semibold text-sm transition-colors active:scale-[0.96] duration-150 flex items-center gap-2"
                >
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setSubmitted(true)}
                  className="px-8 py-3 rounded-2xl bg-[#4CAF50] hover:bg-[#66BB6A] text-white font-semibold text-sm transition-colors active:scale-[0.96] duration-150"
                >
                  Submit Project
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
