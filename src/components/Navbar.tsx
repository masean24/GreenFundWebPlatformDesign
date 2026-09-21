import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Bell } from "lucide-react";
import { GreenFundMark, GreenFundWordmark } from "./GreenFundLogo";
import { useApp } from "../context/AppContext";
import { useT } from "../i18n/LanguageContext";

const roleDashboard: Record<string, string> = {
  supporter: "/dashboard/supporter",
  owner: "/dashboard/owner",
  admin: "/admin",
};

function NotificationDot({ color }: { color: string }) {
  const dots: Record<string, string> = {
    info: "bg-[#60A5FA]",
    success: "bg-[#4CAF50]",
    warning: "bg-[#F59E0B]",
  };
  return <span className={`w-2 h-2 rounded-full shrink-0 ${dots[color] ?? dots.info}`} />;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, logout, notifications, markNotifRead, markAllRead } = useApp();
  const { lang, setLang, t } = useT();
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);

  const visibleNotifs = notifications.filter(
    n => n.forRole === "all" || n.forRole === (user?.role ?? null)
  );
  const unread = visibleNotifs.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/92 backdrop-blur-md border-b border-[#E5E8E4]" style={{ boxShadow: "0 1px 3px oklch(0 0 0 / 0.04)" }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="transition-transform duration-150 group-hover:scale-95">
            <GreenFundMark size={32} />
          </div>
          <GreenFundWordmark size="md" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/explore" className="px-4 py-2 rounded-xl text-sm font-medium text-[#6B7280] hover:text-[#1E2A26] hover:bg-[#F4F4F0] transition-colors">
            {t("nav.explore")}
          </Link>
          <Link to="/impact" className="px-4 py-2 rounded-xl text-sm font-medium text-[#6B7280] hover:text-[#1E2A26] hover:bg-[#F4F4F0] transition-colors">
            {t("nav.impact")}
          </Link>
          <Link to="/map" className="px-4 py-2 rounded-xl text-sm font-medium text-[#6B7280] hover:text-[#1E2A26] hover:bg-[#F4F4F0] transition-colors">
            {t("nav.map")}
          </Link>

          {/* Dashboard dropdown */}
          <div className="relative group">
            <button className="px-4 py-2 rounded-xl text-sm font-medium text-[#6B7280] hover:text-[#1E2A26] hover:bg-[#F4F4F0] transition-colors flex items-center gap-1">
              {t("nav.dashboards")} <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-2xl shadow-elevated border border-[#E5E8E4] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-[opacity,visibility] duration-150 py-2">
              <Link to="/dashboard/supporter" className="block px-4 py-2.5 text-sm text-[#1E2A26] hover:bg-[#F4F4F0] transition-colors">{t("nav.supporter_dash")}</Link>
              <Link to="/dashboard/owner" className="block px-4 py-2.5 text-sm text-[#1E2A26] hover:bg-[#F4F4F0] transition-colors">{t("nav.owner_dash")}</Link>
              <Link to="/admin" className="block px-4 py-2.5 text-sm text-[#1E2A26] hover:bg-[#F4F4F0] transition-colors">{t("nav.admin")}</Link>
            </div>
          </div>
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Language toggle */}
          <div className="flex items-center rounded-xl border border-[#E5E8E4] overflow-hidden text-xs font-semibold">
            <button
              onClick={() => setLang("id")}
              className={`px-2.5 py-1.5 transition-colors ${lang === "id" ? "bg-[#14432B] text-white" : "text-[#9CA3AF] hover:bg-[#F4F4F0]"}`}
            >
              ID
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1.5 transition-colors ${lang === "en" ? "bg-[#14432B] text-white" : "text-[#9CA3AF] hover:bg-[#F4F4F0]"}`}
            >
              EN
            </button>
          </div>

          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(v => !v)}
              className="relative p-2 rounded-xl text-[#6B7280] hover:text-[#1E2A26] hover:bg-[#F4F4F0] transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-elevated border border-[#E5E8E4] z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F4F0]">
                  <span className="text-sm font-semibold text-[#1E2A26]">{t("notif.title")}</span>
                  {unread > 0 && (
                    <button onClick={markAllRead} className="text-xs text-[#14432B] hover:underline font-medium">
                      {t("notif.mark_all")}
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {visibleNotifs.length === 0 ? (
                    <p className="text-xs text-[#9CA3AF] text-center py-6">{t("notif.empty")}</p>
                  ) : (
                    visibleNotifs.map(n => (
                      <button
                        key={n.id}
                        onClick={() => markNotifRead(n.id)}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#FAFAF7] transition-colors border-b border-[#F0F4F0] last:border-0 ${!n.read ? "bg-[#F7FBF8]" : ""}`}
                      >
                        <NotificationDot color={n.type} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold text-[#1E2A26] leading-tight ${!n.read ? "" : "opacity-70"}`}>{n.title}</p>
                          <p className="text-[11px] text-[#6B7280] mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-[#9CA3AF] mt-1">{n.time}</p>
                        </div>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#14432B] shrink-0 mt-1" />}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={roleDashboard[user.role!] || "/"}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-[#1E2A26] hover:bg-[#F4F4F0] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#14432B] flex items-center justify-center text-[10px] font-bold text-white">
                  {user.avatar}
                </div>
                <span className="max-w-[120px] truncate">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#1E2A26] hover:bg-[#F4F4F0] transition-colors"
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-[#1E2A26] hover:text-[#14432B] transition-colors">
                {t("nav.login")}
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#14432B] hover:bg-[#1a5436] transition-colors active:scale-[0.96] duration-150"
              >
                {t("nav.signup")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile: bell + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setNotifOpen(v => !v)}
              className="relative p-2 rounded-xl text-[#6B7280] hover:bg-[#F4F4F0] transition-colors"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#EF4444] text-white text-[8px] font-bold flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-elevated border border-[#E5E8E4] z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F4F0]">
                  <span className="text-sm font-semibold">{t("notif.title")}</span>
                  {unread > 0 && <button onClick={markAllRead} className="text-xs text-[#14432B]">{t("notif.mark_all")}</button>}
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {visibleNotifs.slice(0, 5).map(n => (
                    <button key={n.id} onClick={() => { markNotifRead(n.id); setNotifOpen(false); }}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#FAFAF7] border-b border-[#F0F4F0] last:border-0 ${!n.read ? "bg-[#F7FBF8]" : ""}`}>
                      <NotificationDot color={n.type} />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[#1E2A26] leading-tight">{n.title}</p>
                        <p className="text-[11px] text-[#6B7280] mt-0.5 line-clamp-1">{n.message}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className="p-2 rounded-xl hover:bg-[#F4F4F0] transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E5E8E4] px-6 py-4 flex flex-col gap-2">
          <Link to="/explore" className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#1E2A26] hover:bg-[#F4F4F0]" onClick={() => setMenuOpen(false)}>{t("nav.explore")}</Link>
          <Link to="/impact" className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#1E2A26] hover:bg-[#F4F4F0]" onClick={() => setMenuOpen(false)}>{t("nav.impact")}</Link>
          <Link to="/map" className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#1E2A26] hover:bg-[#F4F4F0]" onClick={() => setMenuOpen(false)}>{t("nav.map")}</Link>
          <Link to="/dashboard/supporter" className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#1E2A26] hover:bg-[#F4F4F0]" onClick={() => setMenuOpen(false)}>{t("nav.supporter_dash")}</Link>
          <Link to="/dashboard/owner" className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#1E2A26] hover:bg-[#F4F4F0]" onClick={() => setMenuOpen(false)}>{t("nav.owner_dash")}</Link>
          <Link to="/admin" className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#1E2A26] hover:bg-[#F4F4F0]" onClick={() => setMenuOpen(false)}>{t("nav.admin")}</Link>

          {/* Language toggle mobile */}
          <div className="flex items-center gap-2 px-4 py-2">
            <span className="text-xs text-[#9CA3AF]">Language:</span>
            <button onClick={() => setLang("id")} className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${lang === "id" ? "bg-[#14432B] text-white" : "bg-[#F4F4F0] text-[#6B7280]"}`}>ID</button>
            <button onClick={() => setLang("en")} className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${lang === "en" ? "bg-[#14432B] text-white" : "bg-[#F4F4F0] text-[#6B7280]"}`}>EN</button>
          </div>

          <div className="flex gap-3 mt-2">
            {user ? (
              <button onClick={handleLogout} className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-medium border border-[#E5E8E4] text-[#6B7280]">
                {t("nav.logout")}
              </button>
            ) : (
              <>
                <Link to="/login" className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-medium border border-[#E5E8E4] hover:bg-[#F4F4F0]" onClick={() => setMenuOpen(false)}>{t("nav.login")}</Link>
                <Link to="/signup" className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#14432B]" onClick={() => setMenuOpen(false)}>{t("nav.signup")}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
