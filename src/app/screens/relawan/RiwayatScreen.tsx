import { useState } from "react";
import { ArrowLeft, Package, Heart, Clock } from "lucide-react";
import { useNavigate } from "react-router";

const tabs = ["Kegiatan", "Donasi Barang", "Donasi Uang"];

const activities = [
  {
    id: 1,
    name: "Mengajar Matematika Kelas 5",
    pantiName: "Panti Asuhan Harapan Bangsa",
    date: "10 Juni 2026",
    status: "Selesai",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 2,
    name: "Main & Dongeng Bersama Anak",
    pantiName: "Panti Sosial Kasih Sayang",
    date: "25 Mei 2026",
    status: "Selesai",
    statusColor: "bg-green-100 text-green-800",
  },
];

const donationItems = [
  {
    id: 1,
    itemName: "Sepatu Sekolah - 5 pasang",
    pantiName: "Panti Asuhan Harapan Bangsa",
    courier: "JNE",
    resi: "JNE1234567890",
    status: "Diterima Panti",
    statusColor: "bg-green-100 text-green-800",
  },
];

const donationMoney = [
  {
    id: 1,
    campaignName: "Kampanye Renovasi Ruang Belajar",
    pantiName: "Panti Sosial Kasih Sayang",
    amount: "Rp 100.000",
    method: "QRIS",
    date: "15 Juni 2026",
    status: "Berhasil",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 2,
    campaignName: "Bantuan Sembako Bulanan",
    pantiName: "Panti Asuhan Bina Sejahtera",
    amount: "Rp 50.000",
    method: "Transfer Bank",
    date: "1 Juni 2026",
    status: "Berhasil",
    statusColor: "bg-green-100 text-green-800",
  },
];

export default function RiwayatScreen() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Kegiatan");

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl">Riwayat</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 text-sm whitespace-nowrap transition-all ${
                  selectedTab === tab
                    ? "text-coral border-b-2 border-coral"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Kegiatan Tab */}
        {selectedTab === "Kegiatan" && (
          <div className="space-y-3">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white rounded-2xl p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-foreground mb-1">{activity.name}</p>
                      <p className="text-sm text-foreground/60">
                        {activity.pantiName}
                      </p>
                      <p className="text-sm text-foreground/60 flex items-center gap-1 mt-2">
                        <Clock className="w-4 h-4" />
                        {activity.date}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${activity.statusColor}`}
                    >
                      {activity.status}
                    </span>
                  </div>
                  {activity.status === "Selesai" && (
                    <button className="w-full py-2 border border-coral text-coral rounded-full hover:bg-coral/5 transition-colors text-sm">
                      Beri Ulasan
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
                <p className="text-foreground/60 mb-4">
                  Belum ada riwayat kegiatan
                </p>
                <button className="px-6 py-2 bg-coral text-white rounded-full hover:bg-coral/90 transition-colors">
                  Mulai Sekarang
                </button>
              </div>
            )}
          </div>
        )}

        {/* Donasi Barang Tab */}
        {selectedTab === "Donasi Barang" && (
          <div className="space-y-3">
            {donationItems.length > 0 ? (
              donationItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg bg-coral/10 flex items-center justify-center shrink-0">
                      <Package className="w-8 h-8 text-coral" />
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground mb-1">{item.itemName}</p>
                      <p className="text-sm text-foreground/60 mb-2">
                        {item.pantiName}
                      </p>
                      <p className="text-sm text-foreground/60">
                        {item.courier} • {item.resi}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 h-fit rounded-full text-xs ${item.statusColor}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
                <p className="text-foreground/60 mb-4">
                  Belum ada riwayat donasi barang
                </p>
                <button className="px-6 py-2 bg-coral text-white rounded-full hover:bg-coral/90 transition-colors">
                  Mulai Sekarang
                </button>
              </div>
            )}
          </div>
        )}

        {/* Donasi Uang Tab */}
        {selectedTab === "Donasi Uang" && (
          <div className="space-y-3">
            {donationMoney.length > 0 ? (
              donationMoney.map((donation) => (
                <div
                  key={donation.id}
                  className="bg-white rounded-2xl p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-foreground mb-1">
                        {donation.campaignName}
                      </p>
                      <p className="text-sm text-foreground/60">
                        {donation.pantiName}
                      </p>
                      <p className="text-lg text-coral mt-2">
                        {donation.amount}
                      </p>
                      <p className="text-sm text-foreground/60 mt-1">
                        {donation.method} • {donation.date}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${donation.statusColor}`}
                    >
                      {donation.status}
                    </span>
                  </div>
                  {donation.status === "Berhasil" && (
                    <button className="text-sm text-coral hover:underline">
                      Unduh Bukti
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
                <p className="text-foreground/60 mb-4">
                  Belum ada riwayat donasi uang
                </p>
                <button className="px-6 py-2 bg-coral text-white rounded-full hover:bg-coral/90 transition-colors">
                  Mulai Sekarang
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
