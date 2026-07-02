import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Bell, User, Heart, Package, DollarSign, Calendar, MapPin, Clock, Bookmark } from "lucide-react";
import logoImg from "../../../imports/Removal-3.png";
import { getCurrentUser } from "@/imports/appwrite/auth";
import { kampanyeDB, kegiatanDB } from "@/imports/appwrite/database";
import { getPreviewUrl } from "@/imports/appwrite/storage";
import type { KampanyeDocument, KegiatanDocument } from "@/imports/appwrite/types";

export default function HomeRelawanScreen() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("...");
  const [userId, setUserId] = useState("");
  const [kampanye, setKampanye] = useState<KampanyeDocument[]>([]);
  const [kegiatan, setKegiatan] = useState<KegiatanDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const userData = await getCurrentUser();
        console.log("[HomeRelawan Debug] Loaded User Data:", userData);
        if (userData) {
          const role = userData.userDoc?.role;
          console.log("[HomeRelawan Debug] Detected Role:", role);
          if (role === "admin") {
            console.log("[HomeRelawan Debug] Redirecting admin to /admin/home");
            navigate("/admin/home", { replace: true });
            return;
          }
          if (role === "panti") {
            console.log("[HomeRelawan Debug] Redirecting panti to /panti/home");
            navigate("/panti/home", { replace: true });
            return;
          }
          setUserName(userData.userDoc?.nama || userData.authUser.name || "Kawan");
          setUserId(userData.authUser.$id);
        } else {
          console.log("[HomeRelawan Debug] No user data, redirecting to /login");
          navigate("/login", { replace: true });
          return;
        }
        const [kampanyeRes, kegiatanRes] = await Promise.allSettled([
          kampanyeDB.listAktif([]),
          kegiatanDB.listUpcoming([]),
        ]);
        if (kampanyeRes.status === "fulfilled") setKampanye(kampanyeRes.value.documents.slice(0, 5));
        if (kegiatanRes.status === "fulfilled") setKegiatan(kegiatanRes.value.documents.slice(0, 5));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const firstName = userName.split(" ")[0];
  const slotsLeft = (k: KegiatanDocument) => (k.kapasitasRelawan ?? 999) - (k.relawanTerdaftar?.length ?? 0);
  const formatDate = (dateStr: string) => {
    try { return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }); }
    catch { return dateStr; }
  };

  return (
    <div className="min-h-screen bg-cream pb-20">
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/relawan/profil")} className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center">
            <User className="w-6 h-6 text-coral" />
          </button>
          <img src={logoImg} alt="Hope Hand" className="h-10 object-contain" />
          <button onClick={() => navigate("/relawan/notifikasi")} className="relative w-10 h-10 rounded-full hover:bg-white transition-colors flex items-center justify-center">
            <Bell className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-8">
        <div className="bg-gradient-to-r from-coral to-coral-light rounded-2xl p-6 text-white">
          <h2 className="text-2xl mb-1">Halo, {firstName} {"\uD83D\uDC4B"}</h2>
          <p className="text-white/90">Mau berbuat baik hari ini?</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: User, label: "Volunteer" },
            { icon: Package, label: "Donasi Barang" },
            { icon: DollarSign, label: "Donasi Uang" },
          ].map(({ icon: Icon, label }) => (
            <button key={label} onClick={() => navigate("/relawan/explore")} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 mx-auto rounded-full bg-coral/10 group-hover:bg-coral/20 transition-colors flex items-center justify-center mb-3">
                <Icon className="w-6 h-6 text-coral" />
              </div>
              <p className="text-sm text-center text-foreground">{label}</p>
            </button>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">Kampanye Aktif</h3>
            <button onClick={() => navigate("/relawan/explore")} className="text-coral hover:underline text-sm">Lihat Semua</button>
          </div>
          {loading ? (
            <div className="flex gap-4 -mx-6 px-6">{[1,2].map(i => <div key={i} className="bg-white rounded-2xl min-w-[280px] h-64 animate-pulse" />)}</div>
          ) : kampanye.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <Heart className="w-12 h-12 mx-auto text-foreground/20 mb-3" />
              <p className="text-foreground/60 text-sm">Belum ada kampanye aktif saat ini</p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
              {kampanye.map((item) => {
                const progress = item.targetDana > 0 ? Math.min(100, Math.round((item.terkumpul / item.targetDana) * 100)) : 0;
                return (
                  <div key={item.$id} className="bg-white rounded-2xl overflow-hidden min-w-[280px] hover:shadow-lg transition-shadow">
                    {item.fotoKampanye ? (
                      <img src={getPreviewUrl(item.fotoKampanye, 400).toString()} alt={item.judul} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-coral/20 to-coral-light/20 flex items-center justify-center">
                        <Heart className="w-12 h-12 text-coral/40" />
                      </div>
                    )}
                    <div className="p-4 space-y-3">
                      <p className="text-foreground line-clamp-2">{item.judul}</p>
                      <div className="space-y-1">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-coral rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-xs text-foreground/60">{progress}% terpenuhi</p>
                      </div>
                      <button className="w-full py-2 bg-coral text-white rounded-full hover:bg-coral/90 transition-colors text-sm">Bantu Sekarang</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">Jadwal Kegiatan Terdekat</h3>
            <button onClick={() => navigate("/relawan/explore")} className="text-coral hover:underline text-sm">Lihat Semua</button>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2].map(i => <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />)}</div>
          ) : kegiatan.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto text-foreground/20 mb-3" />
              <p className="text-foreground/60 text-sm">Belum ada kegiatan mendatang</p>
            </div>
          ) : (
            <div className="space-y-3">
              {kegiatan.map((activity) => {
                const slots = slotsLeft(activity);
                const isFull = activity.kapasitasRelawan != null && slots <= 0;
                const sudahDaftar = userId ? (activity.relawanTerdaftar ?? []).includes(userId) : false;
                return (
                  <div key={activity.$id} className="bg-white rounded-2xl p-4 hover:shadow-lg transition-shadow">
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <p className="text-foreground">{activity.judul}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-foreground/60">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(activity.tanggal)}</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{activity.waktuMulai} - {activity.waktuSelesai}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{activity.lokasi}</span>
                        </div>
                        {activity.kapasitasRelawan != null && (
                          isFull
                            ? <span className="px-2 py-1 bg-muted text-foreground/60 rounded-full text-xs">Penuh</span>
                            : <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">{slots} slot tersisa</span>
                        )}
                      </div>
                      <button disabled={isFull || sudahDaftar} className={`px-4 py-2 h-fit rounded-full text-sm transition-colors ${sudahDaftar ? "bg-teal/10 text-teal cursor-default" : isFull ? "bg-muted text-foreground/40 cursor-not-allowed" : "bg-coral text-white hover:bg-coral/90"}`}>
                        {sudahDaftar ? "Terdaftar" : isFull ? "Penuh" : "Daftar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-coral"><Heart className="w-6 h-6 fill-coral" /><span className="text-xs">Beranda</span></button>
          <button onClick={() => navigate("/relawan/explore")} className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground"><Bookmark className="w-6 h-6" /><span className="text-xs">Explore</span></button>
          <button onClick={() => navigate("/relawan/riwayat")} className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground"><Clock className="w-6 h-6" /><span className="text-xs">Riwayat</span></button>
          <button onClick={() => navigate("/relawan/profil")} className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground"><User className="w-6 h-6" /><span className="text-xs">Profil</span></button>
        </div>
      </div>
    </div>
  );
}
