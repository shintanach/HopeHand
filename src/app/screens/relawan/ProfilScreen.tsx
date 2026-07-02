import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, User, Clock, Package, DollarSign, Home, Bell, HelpCircle, FileText, LogOut, Award, Lock, Edit2, X, AlertTriangle, Camera } from "lucide-react";
import { getCurrentUser, logout } from "@/imports/appwrite/auth";
import { databases } from "@/imports/appwrite/client";
import { DB_ID, COLLECTIONS } from "@/imports/appwrite/config";
import { donasiBarangDB, donasiUangDB, kegiatanDB } from "@/imports/appwrite/database";
import { uploadFotoProfil, getViewUrl, getPreviewUrl } from "@/imports/appwrite/storage";
import { INDONESIAN_REGIONS } from "@/imports/regions";
import { Permission, Role, AppwriteException } from "appwrite";

export default function ProfilScreen() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("Memuat...");
  const [userLocation, setUserLocation] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const [userId, setUserId] = useState<string>("");      // auth ID
  const [userDocId, setUserDocId] = useState<string>(""); // dokumen $id

  // Stats dari database
  const [jamRelawan, setJamRelawan] = useState<number>(0);
  const [donasiBarangCount, setDonasiBarangCount] = useState<number>(0);
  const [totalDonasiUang, setTotalDonasiUang] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);

  // States untuk Edit Modal Popup
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editNama, setEditNama] = useState<string>("");
  const [editTelepon, setEditTelepon] = useState<string>("");
  const [editLokasi, setEditLokasi] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  // State untuk foto profil
  const [currentFotoId, setCurrentFotoId] = useState<string | null>(null);
  const [editFotoFile, setEditFotoFile] = useState<File | null>(null);
  const [editFotoPreview, setEditFotoPreview] = useState<string | null>(null);
  const editFotoRef = useRef<HTMLInputElement>(null);

  // State untuk Logout Modal Popup
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  const loadProfileData = () => {
    getCurrentUser().then(async (data) => {
      if (data) {
        setUserName(data.userDoc?.nama || data.authUser.name || "Pengguna");
        setUserLocation(data.userDoc?.alamat || "");
        setUserPhone(data.userDoc?.telepon || "");
        const uid = data.authUser.$id;
        setUserId(uid);
        setUserDocId(data.userDoc?.$id || uid); // simpan document $id
        setCurrentFotoId(data.userDoc?.fotoProfil || null);

        // Siapkan field edit
        setEditNama(data.userDoc?.nama || data.authUser.name || "");
        setEditTelepon(data.userDoc?.telepon || "");
        setEditLokasi(data.userDoc?.alamat || "");
        setEditFotoPreview(null);
        setEditFotoFile(null);

        try {
          // 1. Ambil data donasi barang
          const barangRes = await donasiBarangDB.listByDonatur(uid);
          const validBarang = barangRes.documents.filter(d => d.status === "diterima");
          setDonasiBarangCount(validBarang.length);

          // 2. Ambil data donasi uang
          const uangRes = await donasiUangDB.listByDonatur(uid);
          const validUang = uangRes.documents.filter(d => d.status === "terkonfirmasi");
          const totalUang = validUang.reduce((sum, item) => sum + (item.jumlah || 0), 0);
          setTotalDonasiUang(totalUang);

          // 3. Ambil jam relawan dari kegiatan terdaftar
          const kegiatanRes = await kegiatanDB.listUpcoming([]);
          const joinedKegiatan = kegiatanRes.value?.documents?.filter(k => (k.relawanTerdaftar ?? []).includes(uid)) || [];
          
          let totalJam = 0;
          joinedKegiatan.forEach((k) => {
            try {
              const [h1, m1] = k.waktuMulai.split(":").map(Number);
              const [h2, m2] = k.waktuSelesai.split(":").map(Number);
              const diffMs = (h2 * 60 + m2) - (h1 * 60 + m1);
              if (diffMs > 0) {
                totalJam += Math.round(diffMs / 60);
              } else {
                totalJam += 2; // fallback 2 jam
              }
            } catch {
              totalJam += 2; // fallback
            }
          });
          setJamRelawan(totalJam);
        } catch (e) {
          console.error("Gagal memuat stats profil:", e);
        } finally {
          setLoadingStats(false);
        }
      }
    });
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Gagal logout:", err);
    } finally {
      setLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Payload hanya berisi field data (bukan field sistem Appwrite)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: Record<string, any> = {
        nama: editNama,
        telepon: editTelepon || null,
        alamat: editLokasi || null,
      };

      // Upload foto baru jika ada
      if (editFotoFile) {
        const uploadRes = await uploadFotoProfil(editFotoFile);
        payload.fotoProfil = uploadRes.$id;
        setCurrentFotoId(uploadRes.$id);
        console.log("[ProfilScreen] Foto uploaded, fileId:", uploadRes.$id);
        console.log("[ProfilScreen] Preview URL:", getViewUrl(uploadRes.$id).toString());
      } else if (currentFotoId) {
        payload.fotoProfil = currentFotoId;
      }

      // Update dokumen dengan permission eksplisit agar user bisa update dokumennya sendiri
      await databases.updateDocument(
        DB_ID,
        COLLECTIONS.USERS,
        userDocId || userId, // gunakan document $id
        payload,
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ]
      );

      setUserName(editNama);
      setUserLocation(editLokasi);
      setUserPhone(editTelepon);
      setEditFotoFile(null);
      setEditFotoPreview(null);
      setShowEditModal(false);
    } catch (err: unknown) {
      if (err instanceof AppwriteException) {
        alert(`Gagal update profil:\n[${err.code}] ${err.type}\n${err.message}`);
      } else {
        alert(`Gagal update profil: ${String(err)}`);
      }
      console.error("Error update profil:", err);
    } finally {
      setSaving(false);
    }
  };

  // Dinamis badge berdasarkan stats
  const badges = [
    { id: 1, name: "Relawan Pemula", icon: "🌱", unlocked: jamRelawan > 0 },
    { id: 2, name: "Donatur Setia", icon: "⭐", unlocked: (donasiBarangCount > 0 || totalDonasiUang > 0) },
    { id: 3, name: "Pahlawan Panti", icon: "🏆", unlocked: jamRelawan >= 10 },
    { id: 4, name: "Volunteer Ahli", icon: "💪", unlocked: jamRelawan >= 20 },
  ];

  const menuItems = [
    { icon: Home, label: "Panti Favoritku", path: "/relawan/favorit" },
    { icon: Bell, label: "Pengaturan Notifikasi", path: "/relawan/pengaturan-notifikasi" },
    { icon: HelpCircle, label: "Bantuan & FAQ", path: "/relawan/bantuan-faq" },
    { icon: FileText, label: "Syarat & Ketentuan", path: "/relawan/syarat-ketentuan" },
  ];

  const formatDonasiUang = (nominal: number) => {
    if (nominal >= 1000000) {
      return (nominal / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (nominal >= 1000) {
      return (nominal / 1000).toFixed(0) + "K";
    }
    return nominal.toString();
  };

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl">Profil</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-coral to-coral-light rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                {currentFotoId ? (
                  <img
                    src={getPreviewUrl(currentFotoId, 200).toString()}
                    alt="Foto Profil"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              
              {/* Button Edit Pensil */}
              <button 
                onClick={() => setShowEditModal(true)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
                title="Edit Profil"
              >
                <Edit2 className="w-5 h-5 text-white" />
              </button>
            </div>
            <h2 className="text-2xl mb-1">{userName}</h2>
            <p className="text-white/95 text-sm mb-1">{userPhone || "No. HP belum ditambahkan"}</p>
            <p className="text-white/90 flex items-center gap-1 text-xs">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {userLocation || "Domisili belum ditentukan"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-coral/10 flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 text-coral" />
            </div>
            <p className="text-2xl font-bold text-coral mb-1">
              {loadingStats ? "..." : jamRelawan}
            </p>
            <p className="text-xs text-foreground/60">Jam Relawan</p>
          </div>

          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-coral/10 flex items-center justify-center mb-2">
              <Package className="w-6 h-6 text-coral" />
            </div>
            <p className="text-2xl font-bold text-coral mb-1">
              {loadingStats ? "..." : donasiBarangCount}
            </p>
            <p className="text-xs text-foreground/60">Donasi Barang</p>
          </div>

          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-coral/10 flex items-center justify-center mb-2">
              <DollarSign className="w-6 h-6 text-coral" />
            </div>
            <p className="text-2xl font-bold text-coral mb-1">
              {loadingStats ? "..." : formatDonasiUang(totalDonasiUang)}
            </p>
            <p className="text-xs text-foreground/60">Total Donasi</p>
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-coral" />
            Pencapaianmu
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 transition-all ${
                    badge.unlocked
                      ? "bg-gradient-to-br from-coral/20 to-coral-light/20 scale-100"
                      : "bg-muted opacity-40 grayscale scale-95"
                  }`}
                >
                  {badge.unlocked ? badge.icon : <Lock className="w-6 h-6 text-foreground/30" />}
                </div>
                <p className={`text-xs ${badge.unlocked ? "text-foreground font-medium" : "text-foreground/40"}`}>
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Menu List */}
        <div className="bg-white rounded-2xl overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
            >
              <item.icon className="w-5 h-5 text-foreground/60" />
              <span className="flex-1 text-left text-foreground">
                {item.label}
              </span>
              <svg
                className="w-5 h-5 text-foreground/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white text-destructive rounded-2xl hover:bg-destructive/5 transition-colors border border-border/50 font-medium"
        >
          <LogOut className="w-5 h-5" />
          Keluar Akun
        </button>
      </div>

      {/* Edit Profil Modal Popup */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleUp">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Edit Profil</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1.5 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-foreground/60" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveChanges} className="p-6 space-y-4">
              {/* Foto Profil Picker */}
              <div className="flex justify-center">
                <input
                  type="file"
                  ref={editFotoRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEditFotoFile(file);
                      setEditFotoPreview(URL.createObjectURL(file));
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => editFotoRef.current?.click()}
                  className="relative w-20 h-20 rounded-full overflow-hidden group border-2 border-dashed border-coral bg-coral/10 hover:bg-coral/20 transition-colors flex items-center justify-center"
                >
                  {editFotoPreview ? (
                    <img src={editFotoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : currentFotoId ? (
                    <img
                    src={getViewUrl(currentFotoId).toString()}
                    alt="Foto Profil"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  ) : (
                    <User className="w-8 h-8 text-coral" />
                  )}
                  {/* Overlay kamera */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </button>
              </div>
              <p className="text-xs text-center text-foreground/50 -mt-2">Ketuk untuk ganti foto</p>

              <div>
                <label className="block text-sm mb-1.5 text-foreground/75 font-medium">Nama Lengkap</label>
                <input 
                  type="text"
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1.5 text-foreground/75 font-medium">Nomor HP</label>
                <input 
                  type="text"
                  value={editTelepon}
                  onChange={(e) => setEditTelepon(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50"
                  placeholder="e.g. +62812345678"
                />
              </div>

              <div>
                <label className="block text-sm mb-1.5 text-foreground/75 font-medium">Lokasi / Domisili</label>
                <select
                  value={editLokasi}
                  onChange={(e) => setEditLokasi(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50 text-sm"
                  required
                >
                  <option value="">Pilih Kota/Kabupaten</option>
                  {INDONESIAN_REGIONS.map((prov) => (
                    <optgroup key={prov.name} label={prov.name}>
                      {prov.cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 border border-border text-foreground/70 hover:bg-muted rounded-xl transition-colors font-medium text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-coral text-white hover:bg-coral/90 disabled:opacity-50 rounded-xl transition-colors font-medium text-sm"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Logout Confirmation Modal Popup */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            
            <h3 className="text-lg font-bold text-foreground mb-2">Konfirmasi Keluar</h3>
            <p className="text-sm text-foreground/60 mb-6 leading-relaxed">
              Apakah Anda yakin ingin keluar dari akun Anda sekarang? Sesi Anda akan berakhir.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 border border-border text-foreground/70 hover:bg-muted rounded-xl transition-colors font-medium text-sm"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={loggingOut}
                className="flex-1 py-2.5 bg-destructive text-white hover:bg-destructive/90 disabled:opacity-50 rounded-xl transition-colors font-medium text-sm"
              >
                {loggingOut ? "Keluar..." : "Keluar Akun"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
