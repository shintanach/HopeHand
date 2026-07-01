import { useState } from "react";
import { useNavigate } from "react-router";
import AdminBottomNav from "./AdminBottomNav";

type OuterTab = "panti" | "kampanye";
type InnerTab = "menunggu" | "disetujui" | "ditolak";

const pantiMenunggu = [
  { id: 1, name: "Panti Asuhan Cahaya Harapan", pengelola: "Ahmad Wijaya", date: "28 Juni 2026", city: "Surabaya" },
  { id: 2, name: "Panti Sosial Bina Anak Sejahtera", pengelola: "Siti Rahayu", date: "27 Juni 2026", city: "Semarang" },
];
const pantiDisetujui = [
  { id: 3, name: "Rumah Asuh Sejahtera", pengelola: "Budi Santoso", date: "20 Juni 2026", city: "Jakarta" },
];
const pantiDitolak = [
  { id: 4, name: "Panti Asuh Mandiri", pengelola: "Dewi Lestari", date: "15 Juni 2026", city: "Bandung" },
];

const kampanyeMenunggu = [
  { id: 1, title: "Bantu Seragam Sekolah Anak Yatim", pantiName: "Panti Asuhan Cahaya Harapan", target: "Rp 50.000.000", date: "28 Juni 2026" },
  { id: 2, title: "Perbaikan Gedung Panti Bersama", pantiName: "Rumah Asuh Bahagia", target: "Rp 120.000.000", date: "27 Juni 2026" },
  { id: 3, title: "Beasiswa Anak Berprestasi 2026", pantiName: "Panti Sosial Bina Anak", target: "Rp 30.000.000", date: "25 Juni 2026" },
];
const kampanyeDisetujui = [
  { id: 4, title: "Renovasi Kamar Tidur Anak", pantiName: "Panti Asuhan Harapan Baru", target: "Rp 80.000.000", date: "18 Juni 2026" },
];
const kampanyeDitolak = [
  { id: 5, title: "Dana Operasional Bulanan", pantiName: "Yayasan Cinta Kasih", target: "Rp 15.000.000", date: "10 Juni 2026" },
];

function StatusBadge({ status }: { status: "disetujui" | "ditolak" }) {
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{
        backgroundColor: status === "disetujui" ? "#D1FAE5" : "#FEE2E2",
        color: status === "disetujui" ? "#065F46" : "#991B1B",
      }}
    >
      {status === "disetujui" ? "Disetujui" : "Ditolak"}
    </span>
  );
}

export default function VerifikasiScreen() {
  const navigate = useNavigate();
  const [outerTab, setOuterTab] = useState<OuterTab>("panti");
  const [innerTab, setInnerTab] = useState<InnerTab>("menunggu");

  const pantiPending = pantiMenunggu.length;
  const kampanyePending = kampanyeMenunggu.length;

  const pantiData = innerTab === "menunggu" ? pantiMenunggu : innerTab === "disetujui" ? pantiDisetujui : pantiDitolak;
  const kampanyeData = innerTab === "menunggu" ? kampanyeMenunggu : innerTab === "disetujui" ? kampanyeDisetujui : kampanyeDitolak;

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-border/50">
        <div className="px-5 py-4">
          <h1 className="text-xl font-bold" style={{ color: "#6D5A4F" }}>Verifikasi</h1>
        </div>

        {/* Outer Tabs */}
        <div className="flex px-5 gap-3 pb-3">
          <button
            onClick={() => { setOuterTab("panti"); setInnerTab("menunggu"); }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: outerTab === "panti" ? "#B4A7E7" : "#F5EDE8",
              color: outerTab === "panti" ? "white" : "#6D5A4F",
            }}
          >
            Panti
            {pantiPending > 0 && (
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: outerTab === "panti" ? "rgba(255,255,255,0.3)" : "#B4A7E7", color: outerTab === "panti" ? "white" : "white" }}
              >
                {pantiPending}
              </span>
            )}
          </button>
          <button
            onClick={() => { setOuterTab("kampanye"); setInnerTab("menunggu"); }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: outerTab === "kampanye" ? "#B4A7E7" : "#F5EDE8",
              color: outerTab === "kampanye" ? "white" : "#6D5A4F",
            }}
          >
            Kampanye
            {kampanyePending > 0 && (
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: outerTab === "kampanye" ? "rgba(255,255,255,0.3)" : "#B4A7E7", color: "white" }}
              >
                {kampanyePending}
              </span>
            )}
          </button>
        </div>

        {/* Inner Tabs */}
        <div className="flex px-5 gap-1 pb-3 border-b border-border/30">
          {(["menunggu", "disetujui", "ditolak"] as InnerTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setInnerTab(tab)}
              className="flex-1 py-1.5 text-xs rounded-lg font-medium capitalize transition-all"
              style={{
                backgroundColor: innerTab === tab ? "#EDE9F8" : "transparent",
                color: innerTab === tab ? "#B4A7E7" : "#9CA3AF",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 space-y-3">
        {outerTab === "panti" && (
          <>
            {pantiData.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">Tidak ada data</div>
            )}
            {pantiData.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#6D5A4F" }}>{item.name}</p>
                    <p className="text-xs text-gray-500">Pengelola: {item.pengelola}</p>
                  </div>
                  {innerTab !== "menunggu" && <StatusBadge status={innerTab as "disetujui" | "ditolak"} />}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span>📍 {item.city}</span>
                  <span>•</span>
                  <span>🗓 {item.date}</span>
                </div>
                {innerTab === "menunggu" && (
                  <button
                    onClick={() => navigate(`/admin/verifikasi/panti/${item.id}`)}
                    className="w-full py-2 rounded-full text-sm font-semibold"
                    style={{ backgroundColor: "#EDE9F8", color: "#B4A7E7" }}
                  >
                    Lihat Detail
                  </button>
                )}
              </div>
            ))}
          </>
        )}

        {outerTab === "kampanye" && (
          <>
            {kampanyeData.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">Tidak ada data</div>
            )}
            {kampanyeData.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-bold text-sm flex-1 mr-2" style={{ color: "#6D5A4F" }}>{item.title}</p>
                  {innerTab !== "menunggu" && <StatusBadge status={innerTab as "disetujui" | "ditolak"} />}
                </div>
                <p className="text-xs text-gray-500 mb-1">{item.pantiName}</p>
                <p className="text-sm font-bold mb-1" style={{ color: "#B4A7E7" }}>{item.target}</p>
                <p className="text-xs text-gray-400 mb-3">🗓 {item.date}</p>
                {innerTab === "menunggu" && (
                  <button
                    onClick={() => navigate(`/admin/verifikasi/kampanye/${item.id}`)}
                    className="w-full py-2 rounded-full text-sm font-semibold"
                    style={{ backgroundColor: "#EDE9F8", color: "#B4A7E7" }}
                  >
                    Lihat Detail
                  </button>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      <AdminBottomNav active="verifikasi" />
    </div>
  );
}
