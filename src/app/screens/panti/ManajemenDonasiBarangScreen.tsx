import { useState } from "react";
import { useNavigate } from "react-router";
import { Home, Calendar, Package, BarChart3, User, Plus } from "lucide-react";

const kebutuhanItems = [
  { id: 1, emoji: "👟", name: "Sepatu Sekolah", qty: "10 pasang", status: "Tersedia", urgent: true },
  { id: 2, emoji: "📚", name: "Buku Pelajaran SD", qty: "20 buah", status: "Diproses", urgent: false },
  { id: 3, emoji: "👕", name: "Seragam Sekolah", qty: "15 stel", status: "Tersedia", urgent: true },
  { id: 4, emoji: "🎒", name: "Tas Sekolah", qty: "12 buah", status: "Terpenuhi", urgent: false },
  { id: 5, emoji: "✏️", name: "Alat Tulis", qty: "30 set", status: "Tersedia", urgent: false },
  { id: 6, emoji: "🛏️", name: "Bantal & Guling", qty: "8 set", status: "Diproses", urgent: true },
];

const donasiMasuk = [
  { id: 1, donor: "Budi Santoso", item: "Sepatu Sekolah - 5 pasang", kurir: "JNE", resi: "JNE1234567", date: "12 Jul 2026", status: "Perlu Konfirmasi" },
  { id: 2, donor: "Siti Rahayu", item: "Buku SD - 10 buah", kurir: "SiCepat", resi: "SC9876543", date: "10 Jul 2026", status: "Dalam Pengiriman" },
  { id: 3, donor: "Ahmad Fauzi", item: "Tas Sekolah - 6 buah", kurir: "GoSend", resi: "GS1122334", date: "8 Jul 2026", status: "Diterima" },
];

const statusBadge: Record<string, string> = {
  "Dalam Pengiriman": "bg-blue-100 text-blue-700",
  "Perlu Konfirmasi": "bg-yellow-100 text-yellow-700",
  "Diterima": "bg-green-100 text-green-700",
};

const kebutuhanStatusBadge: Record<string, string> = {
  "Tersedia": "bg-green-100 text-green-700",
  "Diproses": "bg-blue-100 text-blue-700",
  "Terpenuhi": "bg-gray-100 text-gray-600",
};

const filters = ["Semua", "Tersedia", "Diproses", "Terpenuhi"];

export default function ManajemenDonasiBarangScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"kebutuhan" | "donasi">("kebutuhan");
  const [activeFilter, setActiveFilter] = useState("Semua");

  const filteredItems =
    activeFilter === "Semua"
      ? kebutuhanItems
      : kebutuhanItems.filter((i) => i.status === activeFilter);

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-xl font-bold text-[#6D5A4F]">Donasi Barang</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl shadow-sm p-1">
          <button
            onClick={() => setActiveTab("kebutuhan")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "kebutuhan" ? "bg-teal text-white" : "text-[#6D5A4F]/60"
            }`}
          >
            Kebutuhan
          </button>
          <button
            onClick={() => setActiveTab("donasi")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "donasi" ? "bg-teal text-white" : "text-[#6D5A4F]/60"
            }`}
          >
            Donasi Masuk
          </button>
        </div>

        {activeTab === "kebutuhan" && (
          <>
            {/* Filter chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    activeFilter === f
                      ? "bg-teal text-white"
                      : "bg-white text-[#6D5A4F] border border-gray-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* 2-col grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate("/panti/donasi/konfirmasi")}
                  className="bg-white rounded-2xl shadow-sm p-4 text-left hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl mb-3">{item.emoji}</div>
                  <p className="font-bold text-[#6D5A4F] text-sm mb-1">{item.name}</p>
                  <p className="text-xs text-[#6D5A4F]/60 mb-3">{item.qty}</p>
                  <div className="flex flex-wrap gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${kebutuhanStatusBadge[item.status]}`}>
                      {item.status}
                    </span>
                    {item.urgent && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                        Mendesak
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {activeTab === "donasi" && (
          <div className="space-y-3">
            {donasiMasuk.map((d) => (
              <div key={d.id} className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-[#6D5A4F] text-sm">{d.donor}</p>
                    <p className="text-xs text-[#6D5A4F]/70 mt-0.5">{d.item}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge[d.status]}`}>
                    {d.status}
                  </span>
                </div>
                <div className="text-xs text-[#6D5A4F]/60 space-y-1">
                  <p>Kurir: {d.kurir} · Resi: {d.resi}</p>
                  <p>{d.date}</p>
                </div>
                {d.status === "Perlu Konfirmasi" && (
                  <button
                    onClick={() => navigate("/panti/donasi/konfirmasi")}
                    className="w-full bg-teal text-white rounded-full py-2 text-sm font-semibold hover:bg-teal/90 transition-colors"
                  >
                    Konfirmasi Terima
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => navigate("/panti/tambah-kebutuhan")}
        className="fixed bottom-24 right-6 w-14 h-14 bg-teal text-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal/90 z-10"
      >
        <Plus className="w-7 h-7" />
      </button>

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
