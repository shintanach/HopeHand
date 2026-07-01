import { useNavigate } from "react-router";
import { ArrowLeft, User, Clock, Package, DollarSign, Home, Bell, HelpCircle, FileText, LogOut, Award, Lock } from "lucide-react";

const badges = [
  { id: 1, name: "Relawan Pemula", icon: "🌱", unlocked: true },
  { id: 2, name: "Donatur Setia", icon: "⭐", unlocked: true },
  { id: 3, name: "Pahlawan Panti", icon: "🏆", unlocked: false },
  { id: 4, name: "Volunteer Ahli", icon: "💪", unlocked: false },
];

const menuItems = [
  { icon: Home, label: "Panti Favoritku", path: "#" },
  { icon: Bell, label: "Pengaturan Notifikasi", path: "#" },
  { icon: HelpCircle, label: "Bantuan & FAQ", path: "#" },
  { icon: FileText, label: "Syarat & Ketentuan", path: "#" },
];

export default function ProfilScreen() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm("Yakin ingin keluar?")) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl">Profil</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-coral to-coral-light rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>
            <h2 className="text-2xl mb-1">Budi Santoso</h2>
            <p className="text-white/90 flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Jakarta
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-coral/10 flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 text-coral" />
            </div>
            <p className="text-2xl text-coral mb-1">24</p>
            <p className="text-xs text-foreground/60">Jam Relawan</p>
          </div>

          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-coral/10 flex items-center justify-center mb-2">
              <Package className="w-6 h-6 text-coral" />
            </div>
            <p className="text-2xl text-coral mb-1">5</p>
            <p className="text-xs text-foreground/60">Donasi Barang</p>
          </div>

          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-coral/10 flex items-center justify-center mb-2">
              <DollarSign className="w-6 h-6 text-coral" />
            </div>
            <p className="text-2xl text-coral mb-1">350K</p>
            <p className="text-xs text-foreground/60">Total Donasi</p>
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-coral" />
            Pencapaianmu
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 ${
                    badge.unlocked
                      ? "bg-gradient-to-br from-coral/20 to-coral-light/20"
                      : "bg-muted opacity-50"
                  }`}
                >
                  {badge.unlocked ? badge.icon : <Lock className="w-6 h-6 text-foreground/30" />}
                </div>
                <p className={`text-xs ${badge.unlocked ? "text-foreground" : "text-foreground/40"}`}>
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Menu List */}
        <div className="bg-white rounded-2xl overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
            >
              <item.icon className="w-5 h-5 text-foreground/60" />
              <span className="flex-1 text-left text-foreground">
                {item.label}
              </span>
              <svg
                className="w-5 h-5 text-foreground/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white text-destructive rounded-2xl hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}
