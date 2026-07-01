import { useNavigate } from "react-router";
import { Bell, Users, Home, FileCheck, TrendingUp, AlertCircle, Clock } from "lucide-react";
import logoImg from "../../../imports/Removal-3.png";
import AdminBottomNav from "./AdminBottomNav";

const stats = [
  { icon: Home, label: "Total Panti", value: "42", color: "text-lavender" },
  { icon: Users, label: "Total Relawan", value: "1,234", color: "text-lavender" },
  { icon: TrendingUp, label: "Donasi Bulan Ini", value: "25.5 Jt", color: "text-lavender" },
  { icon: FileCheck, label: "Kegiatan Aktif", value: "89", color: "text-lavender" },
];

const pendingVerifications = [
  {
    id: 1,
    pantiName: "Panti Asuhan Cahaya Harapan",
    city: "Surabaya",
    submittedDate: "28 Juni 2026",
    status: "pending",
  },
  {
    id: 2,
    pantiName: "Panti Sosial Bina Anak Sejahtera",
    city: "Semarang",
    submittedDate: "27 Juni 2026",
    status: "pending",
  },
];

const recentReports = [
  {
    id: 1,
    type: "warning",
    title: "Laporan Aktivitas Mencurigakan",
    description: "User melaporkan kegiatan yang tidak sesuai",
    time: "1 jam lalu",
  },
  {
    id: 2,
    type: "info",
    title: "Permintaan Verifikasi Ulang",
    description: "Panti meminta verifikasi dokumen baru",
    time: "3 jam lalu",
  },
];

export default function HomeAdminScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Hope Hand" className="h-10 object-contain" />
              <div>
                <h2 className="text-lg font-bold" style={{ color: "#6D5A4F" }}>Admin Dashboard</h2>
                <p className="text-sm text-foreground/60">Hope Hand Platform</p>
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
      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-lavender/10 flex items-center justify-center shrink-0">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-foreground/60 leading-tight">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Verifications */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold flex items-center gap-2" style={{ color: "#6D5A4F" }}>
                <Clock className="w-5 h-5" style={{ color: "#B4A7E7" }} />
                Verifikasi Tertunda
              </h3>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                {pendingVerifications.length} pending
              </span>
            </div>

            <div className="space-y-3">
              {pendingVerifications.map((item) => (
                <div
                  key={item.id}
                  className="border border-border rounded-xl p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => navigate("/admin/verifikasi")}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#6D5A4F" }}>{item.pantiName}</p>
                      <p className="text-xs text-foreground/60">{item.city}</p>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/60 mb-3">
                    Diajukan: {item.submittedDate}
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-2 rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: "#B4A7E7" }}
                      onClick={(e) => { e.stopPropagation(); navigate("/admin/verifikasi/panti/1"); }}
                    >
                      Review
                    </button>
                    <button
                      className="px-4 py-2 border border-border rounded-full hover:bg-muted/50 transition-colors text-sm"
                      style={{ color: "#6D5A4F" }}
                      onClick={(e) => { e.stopPropagation(); navigate("/admin/verifikasi"); }}
                    >
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="w-full mt-4 py-2 text-sm font-medium hover:underline"
              style={{ color: "#B4A7E7" }}
              onClick={() => navigate("/admin/verifikasi")}
            >
              Lihat Semua Verifikasi →
            </button>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold flex items-center gap-2" style={{ color: "#6D5A4F" }}>
                <AlertCircle className="w-5 h-5" style={{ color: "#B4A7E7" }} />
                Laporan & Notifikasi
              </h3>
            </div>

            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="border border-border rounded-xl p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => navigate("/admin/verifikasi")}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        report.type === "warning" ? "bg-orange-100" : "bg-blue-100"
                      }`}
                    >
                      {report.type === "warning" ? (
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                      ) : (
                        <FileCheck className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold mb-0.5" style={{ color: "#6D5A4F" }}>{report.title}</p>
                      <p className="text-xs text-foreground/60 mb-1">{report.description}</p>
                      <p className="text-xs text-foreground/50">{report.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="w-full mt-4 py-2 text-sm font-medium hover:underline"
              style={{ color: "#B4A7E7" }}
              onClick={() => navigate("/admin/laporan")}
            >
              Lihat Semua Laporan →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="text-base font-bold mb-4" style={{ color: "#6D5A4F" }}>Aksi Cepat</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              className="p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors text-center"
              onClick={() => navigate("/admin/pengguna")}
            >
              <Users className="w-6 h-6 mx-auto mb-2" style={{ color: "#B4A7E7" }} />
              <p className="text-sm" style={{ color: "#6D5A4F" }}>Kelola User</p>
            </button>
            <button
              className="p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors text-center"
              onClick={() => navigate("/admin/verifikasi")}
            >
              <FileCheck className="w-6 h-6 mx-auto mb-2" style={{ color: "#B4A7E7" }} />
              <p className="text-sm" style={{ color: "#6D5A4F" }}>Verifikasi</p>
            </button>
            <button
              className="p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors text-center"
              onClick={() => navigate("/admin/laporan")}
            >
              <TrendingUp className="w-6 h-6 mx-auto mb-2" style={{ color: "#B4A7E7" }} />
              <p className="text-sm" style={{ color: "#6D5A4F" }}>Laporan</p>
            </button>
            <button
              className="p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors text-center"
              onClick={() => navigate("/admin/pengaturan")}
            >
              <Home className="w-6 h-6 mx-auto mb-2" style={{ color: "#B4A7E7" }} />
              <p className="text-sm" style={{ color: "#6D5A4F" }}>Pengaturan</p>
            </button>
          </div>
        </div>
      </div>

      <AdminBottomNav active="dashboard" />
    </div>
  );
}
