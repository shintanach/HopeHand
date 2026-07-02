import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, Users, Heart, Calendar, LogOut, Settings, Award } from "lucide-react";
import logoImg from "../../../imports/Removal-3.png";
import { getCurrentUser, logout } from "@/imports/appwrite/auth";
import { kampanyeDB, kegiatanDB, pantiDB } from "@/imports/appwrite/database";
import { getPreviewUrl } from "@/imports/appwrite/storage";
import type { KampanyeDocument, KegiatanDocument, PantiDocument } from "@/imports/appwrite/types";

export default function HomePantiScreen() {
  const navigate = useNavigate();
  const [pantiName, setPantiName] = useState("...");
  const [pantiDoc, setPantiDoc] = useState<PantiDocument | null>(null);
  const [kampanye, setKampanye] = useState<KampanyeDocument[]>([]);
  const [kegiatan, setKegiatan] = useState<KegiatanDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const userData = await getCurrentUser();
        if (!userData || userData.userDoc?.role !== "panti") {
          navigate("/login");
          return;
        }
        
        setPantiName(userData.userDoc?.nama || "Panti Asuhan");
        
        // Dapatkan document panti milik user ini
        const pantiRes = await pantiDB.getByUserId(userData.authUser.$id);
        const myPanti = pantiRes.documents[0];
        if (myPanti) {
          setPantiDoc(myPanti);
          
          const [kampRes, kegRes] = await Promise.allSettled([
            kampanyeDB.listAktif([]),
            kegiatanDB.listUpcoming([]),
          ]);
          
          if (kampRes.status === "fulfilled") {
            setKampanye(kampRes.value.documents.filter(k => k.pantiId === myPanti.$id));
          }
          if (kegRes.status === "fulfilled") {
            setKegiatan(kegRes.value.documents.filter(k => k.pantiId === myPanti.$id));
          }
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-20">
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-teal" />
            </div>
            <div>
              <p className="text-xs text-foreground/50">Dashboard Pengelola</p>
              <p className="text-sm font-medium text-foreground line-clamp-1">{pantiName}</p>
            </div>
          </div>
          <img src={logoImg} alt="Hope Hand" className="h-10 object-contain" />
          <button onClick={handleLogout} className="w-10 h-10 rounded-full hover:bg-red-50 transition-colors flex items-center justify-center" title="Keluar">
            <LogOut className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-8">
        {/* Detail Panti Overview */}
        {pantiDoc && (
          <div className="bg-white rounded-2xl p-6 border border-border/50 flex gap-6 items-center">
            {pantiDoc.fotoPanti ? (
              <img src={getPreviewUrl(pantiDoc.fotoPanti, 200).toString()} alt={pantiDoc.namaPanti} className="w-20 h-20 rounded-xl object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-teal/10 flex items-center justify-center">
                <Users className="w-10 h-10 text-teal" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-foreground">{pantiDoc.namaPanti}</h2>
              <p className="text-sm text-foreground/60">{pantiDoc.kota}, {pantiDoc.provinsi}</p>
              <p className="text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full w-fit mt-2">Terverifikasi</p>
            </div>
          </div>
        )}

        {/* Cepat Aksi */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => navigate("/panti/buat-kampanye")} className="bg-white rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all text-left flex flex-col justify-between h-32 group">
            <div className="w-10 h-10 rounded-full bg-coral/10 group-hover:bg-coral/20 flex items-center justify-center transition-colors">
              <Plus className="w-6 h-6 text-coral" />
            </div>
            <div>
              <p className="font-medium text-foreground">Galang Dana</p>
              <p className="text-xs text-foreground/50">Mulai kampanye baru</p>
            </div>
          </button>

          <button onClick={() => navigate("/panti/buat-kegiatan")} className="bg-white rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all text-left flex flex-col justify-between h-32 group">
            <div className="w-10 h-10 rounded-full bg-teal/10 group-hover:bg-teal/20 flex items-center justify-center transition-colors">
              <Plus className="w-6 h-6 text-teal" />
            </div>
            <div>
              <p className="font-medium text-foreground">Buka Kegiatan</p>
              <p className="text-xs text-foreground/50">Undang relawan mengajar/membantu</p>
            </div>
          </button>
        </div>

        {/* Kampanye Milik Panti */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Kampanye Saya</h3>
          {loading ? (
            <div className="grid grid-cols-2 gap-4">{[1, 2].map(i => <div key={i} className="bg-white rounded-2xl h-48 animate-pulse" />)}</div>
          ) : kampanye.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-border">
              <Heart className="w-12 h-12 mx-auto text-foreground/20 mb-3" />
              <p className="text-foreground/60 text-sm mb-4">Belum ada kampanye aktif</p>
              <button onClick={() => navigate("/panti/buat-kampanye")} className="px-4 py-2 bg-coral text-white rounded-full text-sm hover:bg-coral/90 transition-colors">Buat Kampanye</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kampanye.map((item) => {
                const progress = item.targetDana > 0 ? Math.min(100, Math.round((item.terkumpul / item.targetDana) * 100)) : 0;
                return (
                  <div key={item.$id} className="bg-white rounded-2xl p-4 border border-border/50 hover:shadow-md transition-shadow">
                    <p className="font-medium text-foreground line-clamp-1">{item.judul}</p>
                    <div className="mt-4 space-y-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-coral rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-foreground/60">
                        <span>{progress}% Terkumpul</span>
                        <span>Target: Rp {item.targetDana.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Kegiatan Milik Panti */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Kegiatan Saya</h3>
          {loading ? (
            <div className="space-y-3">{[1, 2].map(i => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />)}</div>
          ) : kegiatan.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-border">
              <Calendar className="w-12 h-12 mx-auto text-foreground/20 mb-3" />
              <p className="text-foreground/60 text-sm mb-4">Belum ada jadwal kegiatan</p>
              <button onClick={() => navigate("/panti/buat-kegiatan")} className="px-4 py-2 bg-teal text-white rounded-full text-sm hover:bg-teal/90 transition-colors">Buat Kegiatan</button>
            </div>
          ) : (
            <div className="space-y-3">
              {kegiatan.map((act) => (
                <div key={act.$id} className="bg-white rounded-2xl p-4 border border-border/50 hover:shadow-md transition-shadow flex justify-between items-center">
                  <div>
                    <p className="font-medium text-foreground">{act.judul}</p>
                    <p className="text-xs text-foreground/50 mt-1">{formatDate(act.tanggal)} · {act.waktuMulai} - {act.waktuSelesai}</p>
                  </div>
                  <div className="bg-teal/10 text-teal px-3 py-1 rounded-full text-xs">
                    {(act.relawanTerdaftar ?? []).length} Relawan
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
