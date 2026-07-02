import { useState, useEffect } from "react";
import { ArrowLeft, Package, Heart, Clock, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router";
import { getCurrentUser } from "@/imports/appwrite/auth";
import { kegiatanDB, donasiBarangDB, donasiUangDB } from "@/imports/appwrite/database";
import type { KegiatanDocument, DonasiBarangDocument, DonasiUangDocument } from "@/imports/appwrite/types";

const tabs = ["Kegiatan", "Donasi Barang", "Donasi Uang"];

const statusColor = (status: string) => {
  if (status === "selesai" || status === "diterima" || status === "terkonfirmasi") return "bg-green-100 text-green-800";
  if (status === "ditolak") return "bg-red-100 text-red-800";
  if (status === "upcoming" || status === "menunggu" || status === "dikonfirmasi") return "bg-yellow-100 text-yellow-800";
  return "bg-muted text-foreground/60";
};

const labelStatus: Record<string, string> = {
  upcoming: "Mendatang", ongoing: "Berlangsung", selesai: "Selesai", dibatalkan: "Dibatalkan",
  menunggu: "Menunggu", dikonfirmasi: "Dikonfirmasi", diterima: "Diterima", ditolak: "Ditolak",
  menunggu_konfirmasi: "Menunggu Konfirmasi", terkonfirmasi: "Terkonfirmasi",
};

const formatRp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const formatDate = (d: string) => { try { return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }); } catch { return d; } };

export default function RiwayatScreen() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Kegiatan");
  const [userId, setUserId] = useState("");
  const [kegiatan, setKegiatan] = useState<KegiatanDocument[]>([]);
  const [donasiBarang, setDonasiBarang] = useState<DonasiBarangDocument[]>([]);
  const [donasiUang, setDonasiUang] = useState<DonasiUangDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const userData = await getCurrentUser();
        if (!userData) return;
        const uid = userData.authUser.$id;
        setUserId(uid);

        const [kegRes, barRes, uangRes] = await Promise.allSettled([
          kegiatanDB.listUpcoming([]),
          donasiBarangDB.listByDonatur(uid),
          donasiUangDB.listByDonatur(uid),
        ]);
        if (kegRes.status === "fulfilled") {
          // Filter kegiatan yang relawanTerdaftar includes userId
          setKegiatan(kegRes.value.documents.filter(k => (k.relawanTerdaftar ?? []).includes(uid)));
        }
        if (barRes.status === "fulfilled") setDonasiBarang(barRes.value.documents);
        if (uangRes.status === "fulfilled") setDonasiUang(uangRes.value.documents);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const EmptyState = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
    <div className="text-center py-12">
      <Icon className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
      <p className="text-foreground/60 mb-4">{text}</p>
      <button onClick={() => navigate("/relawan/explore")} className="px-6 py-2 bg-coral text-white rounded-full hover:bg-coral/90 transition-colors">
        Mulai Sekarang
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream pb-20">
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors"><ArrowLeft className="w-6 h-6" /></button>
            <h1 className="text-2xl">Riwayat</h1>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setSelectedTab(tab)} className={`px-4 py-2 text-sm whitespace-nowrap transition-all ${selectedTab === tab ? "text-coral border-b-2 border-coral" : "text-foreground/60 hover:text-foreground"}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />)}</div>
        ) : (
          <>
            {selectedTab === "Kegiatan" && (
              <div className="space-y-3">
                {kegiatan.length === 0 ? <EmptyState icon={Clock} text="Belum ada riwayat kegiatan" /> : kegiatan.map((k) => (
                  <div key={k.$id} className="bg-white rounded-2xl p-4 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-foreground mb-1">{k.judul}</p>
                        <p className="text-sm text-foreground/60 flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(k.tanggal)}</p>
                        <p className="text-sm text-foreground/60 flex items-center gap-1 mt-1"><MapPin className="w-4 h-4" />{k.lokasi}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${statusColor(k.status)}`}>{labelStatus[k.status] ?? k.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === "Donasi Barang" && (
              <div className="space-y-3">
                {donasiBarang.length === 0 ? <EmptyState icon={Package} text="Belum ada riwayat donasi barang" /> : donasiBarang.map((item) => (
                  <div key={item.$id} className="bg-white rounded-2xl p-4 hover:shadow-lg transition-shadow">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-coral/10 flex items-center justify-center shrink-0">
                        <Package className="w-8 h-8 text-coral" />
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground mb-1">{item.namaBarang} — {item.jumlah} {item.satuan}</p>
                        <p className="text-sm text-foreground/60">{item.kondisi === "baru" ? "Barang Baru" : "Bekas Layak"} · {item.metodePengiriman === "antar_sendiri" ? "Antar Sendiri" : "Dijemput"}</p>
                        <p className="text-xs text-foreground/50 mt-1">{formatDate(item.$createdAt)}</p>
                      </div>
                      <span className={`px-3 py-1 h-fit rounded-full text-xs ${statusColor(item.status)}`}>{labelStatus[item.status] ?? item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === "Donasi Uang" && (
              <div className="space-y-3">
                {donasiUang.length === 0 ? <EmptyState icon={Heart} text="Belum ada riwayat donasi uang" /> : donasiUang.map((d) => (
                  <div key={d.$id} className="bg-white rounded-2xl p-4 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-foreground mb-1">{formatRp(d.jumlah)}</p>
                        {d.pesan && <p className="text-sm text-foreground/60 italic">{d.pesan}</p>}
                        <p className="text-sm text-foreground/60 mt-1">{formatDate(d.tanggalTransfer || d.$createdAt)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${statusColor(d.status)}`}>{labelStatus[d.status] ?? d.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
