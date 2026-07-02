import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Bell, Users, Home, FileCheck, TrendingUp, AlertCircle, Clock, Link, Copy, Check } from "lucide-react";
import logoImg from "../../../imports/Removal-3.png";
import AdminBottomNav from "./AdminBottomNav";
import { pantiDB, userDB, donasiUangDB, kegiatanDB, kampanyeDB, clickTrackerDB } from "@/imports/appwrite/database";
import { Query } from "appwrite";

function formatTimeAgo(dateStr: string) {
  try {
    const diffMs = new Date().getTime() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} hari lalu`;
  } catch {
    return dateStr;
  }
}

export default function HomeAdminScreen() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { icon: Home, label: "Total Panti", value: "...", color: "text-lavender" },
    { icon: Users, label: "Total Relawan", value: "...", color: "text-lavender" },
    { icon: TrendingUp, label: "Donasi Bulan Ini", value: "...", color: "text-lavender" },
    { icon: FileCheck, label: "Kegiatan Aktif", value: "...", color: "text-lavender" },
  ]);
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareClickCount, setShareClickCount] = useState<number | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const shareLink = `${window.location.origin}/r`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pantis, relawans, donations, kegiatans, pendingPantis, pendingKampanyes, clickCount] = await Promise.all([
          pantiDB.listAll(),
          userDB.listAll([Query.equal("role", "relawan")]),
          donasiUangDB.listAll([Query.equal("status", "terkonfirmasi")]),
          kegiatanDB.listAll(),
          pantiDB.listPending(),
          kampanyeDB.listPending(),
          clickTrackerDB.getClickCount(),
        ]);
        setShareClickCount(clickCount);

        const totalPantiCount = pantis.total;
        const totalRelawanCount = relawans.total;

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const donasiBulanIniSum = donations.documents
          .filter((d) => {
            const date = new Date(d.$createdAt);
            return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
          })
          .reduce((sum, d) => sum + (d.jumlah || 0), 0);

        const activeKegiatanCount = kegiatans.documents.filter(
          (k) => k.status === "upcoming" || k.status === "ongoing"
        ).length;

        setStats([
          { icon: Home, label: "Total Panti", value: String(totalPantiCount), color: "text-lavender" },
          { icon: Users, label: "Total Relawan", value: String(totalRelawanCount), color: "text-lavender" },
          {
            icon: TrendingUp,
            label: "Donasi Bulan Ini",
            value:
              donasiBulanIniSum >= 1000000
                ? `Rp ${(donasiBulanIniSum / 1000000).toFixed(1)} Jt`
                : `Rp ${donasiBulanIniSum.toLocaleString("id-ID")}`,
            color: "text-lavender",
          },
          { icon: FileCheck, label: "Kegiatan Aktif", value: String(activeKegiatanCount), color: "text-lavender" },
        ]);

        const mappedPending = pendingPantis.documents.slice(0, 5).map((p) => ({
          id: p.$id,
          pantiName: p.namaPanti,
          city: p.kota || "Kota tidak diketahui",
          submittedDate: new Date(p.$createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          status: "pending",
        }));
        setPendingVerifications(mappedPending);

        const reportsList: any[] = [];
        pendingPantis.documents.forEach((p) => {
          reportsList.push({
            id: `p-${p.$id}`,
            type: "warning",
            title: "Pendaftaran Panti Baru",
            description: `${p.namaPanti} meminta verifikasi pendaftaran.`,
            time: formatTimeAgo(p.$createdAt),
          });
        });
        pendingKampanyes.documents.forEach((k) => {
          reportsList.push({
            id: `k-${k.$id}`,
            type: "info",
            title: "Verifikasi Kampanye Baru",
            description: `Kampanye "${k.judul}" diajukan untuk ditinjau.`,
            time: formatTimeAgo(k.$createdAt),
          });
        });
        setRecentReports(reportsList.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
              {loading ? (
                <div className="text-center py-12 text-gray-400 text-sm">Loading data...</div>
              ) : pendingVerifications.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">Tidak ada verifikasi tertunda</div>
              ) : (
                pendingVerifications.map((item) => (
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
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/admin/verifikasi/panti/" + item.id);
                        }}
                      >
                        Review
                      </button>
                      <button
                        className="px-4 py-2 border border-border rounded-full hover:bg-muted/50 transition-colors text-sm"
                        style={{ color: "#6D5A4F" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/admin/verifikasi");
                        }}
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                ))
              )}
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
              {loading ? (
                <div className="text-center py-12 text-gray-400 text-sm">Loading data...</div>
              ) : recentReports.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">Tidak ada laporan atau notifikasi terbaru</div>
              ) : (
                recentReports.map((report) => (
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
                ))
              )}
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

        {/* Share Link Statistics */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold flex items-center gap-2" style={{ color: "#6D5A4F" }}>
              <Link className="w-5 h-5" style={{ color: "#B4A7E7" }} />
              Statistik Link Undangan
            </h3>
            <div className="flex items-center gap-2 bg-lavender/10 px-4 py-2 rounded-full">
              <span className="text-2xl font-bold" style={{ color: "#B4A7E7" }}>
                {shareClickCount === null ? "..." : shareClickCount}
              </span>
              <span className="text-xs text-foreground/60">klik</span>
            </div>
          </div>
          <p className="text-sm text-foreground/60 mb-4">
            Jumlah total pengunjung yang masuk melalui link undangan. Setiap klik unik dihitung per sesi browser.
          </p>
          <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-3">
            <code className="flex-1 text-xs text-foreground/70 break-all">{shareLink}</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
              }}
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white"
              style={{ color: "#B4A7E7" }}
              title="Salin link"
            >
              {linkCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {linkCopied && (
            <p className="text-xs text-green-600 mt-2 text-center font-medium">✓ Link berhasil disalin!</p>
          )}
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
