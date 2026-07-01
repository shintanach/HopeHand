import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Home, Calendar, Package, BarChart3, User, Plus, Download } from "lucide-react";

const campaigns = [
  {
    id: 1,
    title: "Renovasi Ruang Belajar",
    collected: 12500000,
    target: 30000000,
    daysLeft: 18,
    status: "Aktif",
  },
  {
    id: 2,
    title: "Beasiswa Pendidikan 2026",
    collected: 5000000,
    target: 15000000,
    daysLeft: 30,
    status: "Menunggu Persetujuan",
  },
  {
    id: 3,
    title: "Perbaikan Fasilitas Kamar",
    collected: 8000000,
    target: 8000000,
    daysLeft: 0,
    status: "Selesai",
  },
  {
    id: 4,
    title: "Pengadaan Komputer",
    collected: 0,
    target: 20000000,
    daysLeft: 0,
    status: "Ditolak",
  },
];

const transactions = [
  { id: 1, donor: "Ahmad Wijaya", nominal: 500000, metode: "Transfer Bank", tanggal: "12 Jul 2026", status: "Berhasil" },
  { id: 2, donor: "Dewi Lestari", nominal: 200000, metode: "QRIS", tanggal: "10 Jul 2026", status: "Berhasil" },
  { id: 3, donor: "Hendra Kusuma", nominal: 1000000, metode: "Transfer Bank", tanggal: "9 Jul 2026", status: "Berhasil" },
  { id: 4, donor: "Fitri Handayani", nominal: 150000, metode: "OVO", tanggal: "7 Jul 2026", status: "Berhasil" },
];

const statusStyle: Record<string, string> = {
  "Aktif": "bg-green-100 text-green-700",
  "Menunggu Persetujuan": "bg-yellow-100 text-yellow-700",
  "Ditolak": "bg-red-100 text-red-700",
  "Selesai": "bg-gray-100 text-gray-600",
};

const formatRp = (n: number) =>
  "Rp " + n.toLocaleString("id-ID");

export default function ManajemenKampanyeScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"kampanye" | "riwayat">("kampanye");

  const totalDana = transactions.reduce((a, t) => a + t.nominal, 0);

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#6D5A4F]">Donasi Uang</h1>
          {activeTab === "riwayat" && (
            <button
              onClick={() => toast.success("File berhasil diunduh")}
              className="flex items-center gap-1 text-teal text-sm font-semibold"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl shadow-sm p-1">
          <button
            onClick={() => setActiveTab("kampanye")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "kampanye" ? "bg-teal text-white" : "text-[#6D5A4F]/60"
            }`}
          >
            Kampanye
          </button>
          <button
            onClick={() => setActiveTab("riwayat")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "riwayat" ? "bg-teal text-white" : "text-[#6D5A4F]/60"
            }`}
          >
            Riwayat Dana
          </button>
        </div>

        {activeTab === "kampanye" && (
          <div className="space-y-4">
            {campaigns.map((c) => {
              const progress = Math.min((c.collected / c.target) * 100, 100);
              return (
                <div key={c.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Photo placeholder */}
                  <div className="h-28 bg-gradient-to-r from-teal to-teal/60 flex items-end px-4 pb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[c.status]}`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-[#6D5A4F]">{c.title}</h3>
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#6D5A4F]/60">
                        <span>Terkumpul: <span className="font-semibold text-teal">{formatRp(c.collected)}</span></span>
                        <span>Target: {formatRp(c.target)}</span>
                      </div>
                    </div>
                    {c.daysLeft > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          {c.daysLeft} hari lagi
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "riwayat" && (
          <div className="space-y-4">
            {/* Total Summary */}
            <div className="bg-teal rounded-2xl p-5 text-white">
              <p className="text-white/80 text-sm mb-1">Total Dana Terkumpul</p>
              <p className="text-3xl font-bold">{formatRp(totalDana)}</p>
              <p className="text-white/70 text-xs mt-1">{transactions.length} transaksi</p>
            </div>

            {/* Transactions */}
            <div className="space-y-3">
              {transactions.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                    <span className="text-teal font-bold text-sm">{t.donor[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#6D5A4F] text-sm">{t.donor}</p>
                    <p className="text-xs text-[#6D5A4F]/60">{t.metode} · {t.tanggal}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-teal text-sm">{formatRp(t.nominal)}</p>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">{t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      {activeTab === "kampanye" && (
        <button
          onClick={() => navigate("/panti/buat-kampanye")}
          className="fixed bottom-24 right-6 w-14 h-14 bg-teal text-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal/90 z-10"
        >
          <Plus className="w-7 h-7" />
        </button>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-around">
          <button onClick={() => navigate("/panti/home")} className="flex flex-col items-center gap-1 text-[#6D5A4F]/60">
            <Home className="w-6 h-6" />
            <span className="text-xs">Beranda</span>
          </button>
          <button onClick={() => navigate("/panti/kegiatan")} className="flex flex-col items-center gap-1 text-[#6D5A4F]/60">
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Kegiatan</span>
          </button>
          <button onClick={() => navigate("/panti/donasi")} className="flex flex-col items-center gap-1 text-teal">
            <Package className="w-6 h-6 fill-teal/20" />
            <span className="text-xs font-semibold">Donasi</span>
          </button>
          <button onClick={() => navigate("/panti/laporan")} className="flex flex-col items-center gap-1 text-[#6D5A4F]/60">
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Laporan</span>
          </button>
          <button onClick={() => navigate("/panti/profil")} className="flex flex-col items-center gap-1 text-[#6D5A4F]/60">
            <User className="w-6 h-6" />
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
