import { useNavigate } from "react-router";
import { Bell, Users, Package, DollarSign, Calendar, Home, BarChart3, CheckCircle, User } from "lucide-react";
import logoImg from "../../../imports/Removal-3.png";

const stats = [
  { icon: Users, label: "Relawan Bulan Ini", value: "24", color: "text-teal" },
  { icon: Package, label: "Donasi Barang Masuk", value: "15", color: "text-teal" },
  { icon: DollarSign, label: "Dana Terkumpul", value: "2.5 Jt", color: "text-teal" },
];

const recentActivity = [
  {
    id: 1,
    type: "volunteer",
    name: "Budi Santoso",
    action: "mendaftar kegiatan Mengajar Matematika Kelas 5",
    time: "2 jam lalu",
  },
  {
    id: 2,
    type: "donation",
    name: "Siti Nurhaliza",
    action: "mengirim donasi Sepatu Sekolah - 5 pasang",
    time: "3 jam lalu",
  },
  {
    id: 3,
    type: "money",
    name: "Ahmad Wijaya",
    action: "berdonasi Rp 100.000 untuk Kampanye Renovasi",
    time: "5 jam lalu",
  },
  {
    id: 4,
    type: "volunteer",
    name: "Dewi Lestari",
    action: "mendaftar kegiatan Main & Dongeng Bersama Anak",
    time: "Kemarin",
  },
];

export default function HomePantiScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal/20 flex items-center justify-center">
                <Home className="w-6 h-6 text-teal" />
              </div>
              <div>
                <h2 className="text-lg">Panti Asuhan Harapan Bangsa</h2>
                <div className="flex items-center gap-1 text-sm text-teal">
                  <CheckCircle className="w-4 h-4" />
                  <span>Terverifikasi</span>
                </div>
              </div>
            </div>
            <button className="relative w-10 h-10 rounded-full hover:bg-white transition-colors flex items-center justify-center">
              <Bell className="w-6 h-6 text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 hover:shadow-lg transition-shadow"
            >
              <div
                className={`w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center mb-3 mx-auto`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className={`text-2xl text-center ${stat.color} mb-1`}>
                {stat.value}
              </p>
              <p className="text-xs text-center text-foreground/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Alert Card */}
        <div className="bg-orange-50 border-l-4 border-orange-400 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 text-orange-600">⚡</div>
            <div className="flex-1">
              <p className="text-foreground mb-1">
                Ada kebutuhan mendesak belum terpenuhi
              </p>
              <button className="text-sm text-orange-600 hover:underline">
                Lihat Sekarang →
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="text-lg mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                  {activity.type === "volunteer" && (
                    <Users className="w-5 h-5 text-teal" />
                  )}
                  {activity.type === "donation" && (
                    <Package className="w-5 h-5 text-teal" />
                  )}
                  {activity.type === "money" && (
                    <DollarSign className="w-5 h-5 text-teal" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{activity.name}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-foreground/60 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-around">
          <button onClick={() => navigate("/panti/home")} className="flex flex-col items-center gap-1 text-teal">
            <Home className="w-6 h-6 fill-teal" />
            <span className="text-xs font-semibold">Beranda</span>
          </button>

          <button onClick={() => navigate("/panti/kegiatan")} className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground">
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Kegiatan</span>
          </button>

          <button onClick={() => navigate("/panti/donasi")} className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground">
            <Package className="w-6 h-6" />
            <span className="text-xs">Donasi</span>
          </button>

          <button onClick={() => navigate("/panti/laporan")} className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground">
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Laporan</span>
          </button>

          <button onClick={() => navigate("/panti/profil")} className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground">
            <User className="w-6 h-6" />
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
