import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AdminBottomNav from "./AdminBottomNav";
import { pantiDB, kampanyeDB } from "@/imports/appwrite/database";

type OuterTab = "panti" | "kampanye";
type InnerTab = "menunggu" | "disetujui" | "ditolak";

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
  const [loading, setLoading] = useState(true);

  const [pantis, setPantis] = useState<any[]>([]);
  const [kampanyes, setKampanyes] = useState<any[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pantiRes, kampRes] = await Promise.all([
        pantiDB.listAll(),
        kampanyeDB.listAll(),
      ]);

      setPantis(pantiRes.documents);
      setKampanyes(kampRes.documents);
    } catch (err) {
      console.error("Gagal memuat data verifikasi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getPantiData = () => {
    if (innerTab === "menunggu") return pantis.filter(p => p.status === "pending");
    if (innerTab === "disetujui") return pantis.filter(p => p.status === "terverifikasi");
    return pantis.filter(p => p.status === "ditolak");
  };

  const getKampanyeData = () => {
    if (innerTab === "menunggu") return kampanyes.filter(k => k.status === "menunggu");
    if (innerTab === "disetujui") return kampanyes.filter(k => k.status === "aktif" || k.status === "selesai");
    return kampanyes.filter(k => k.status === "ditolak");
  };

  const pantiPending = pantis.filter(p => p.status === "pending").length;
  const kampanyePending = kampanyes.filter(k => k.status === "menunggu").length;

  const pantiData = getPantiData().map(p => ({
    id: p.$id,
    name: p.namaPanti,
    pengelola: p.namaKetua,
    date: new Date(p.$createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    city: p.kota || "Kota tidak diketahui",
  }));

  const kampanyeData = getKampanyeData().map(k => {
    const pantiObj = pantis.find(p => p.$id === k.pantiId);
    return {
      id: k.$id,
      title: k.judul,
      pantiName: pantiObj ? pantiObj.namaPanti : "Panti tidak ditemukan",
      target: k.targetDana ? `Rp ${k.targetDana.toLocaleString("id-ID")}` : "Rp 0",
      date: new Date(k.$createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    };
  });

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
                style={{ backgroundColor: outerTab === "panti" ? "rgba(255,255,255,0.3)" : "#B4A7E7", color: "white" }}
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
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading data...</div>
        ) : (
          <>
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
          </>
        )}
      </div>

      <AdminBottomNav active="verifikasi" />
    </div>
  );
}
