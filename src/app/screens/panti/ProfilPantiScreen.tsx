import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Home, Calendar, Package, BarChart3, User,
  Camera, Pencil, MapPin, CheckCircle, Bell, HelpCircle, LogOut,
  Plus, X, ChevronDown
} from "lucide-react";

const photoGrid = [
  { id: 1, label: "Kegiatan Mengajar" },
  { id: 2, label: "Donasi Buku" },
  { id: 3, label: "Bermain Bersama" },
  { id: 4, label: "Olahraga Pagi" },
];

const banks = ["BCA", "Mandiri", "BNI", "BRI", "CIMB Niaga"];

export default function ProfilPantiScreen() {
  const navigate = useNavigate();
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);
  const [showAddRekening, setShowAddRekening] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [rekeningForm, setRekeningForm] = useState({ bank: "", nomor: "", nama: "" });

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gradient-to-br from-teal to-teal/50">
        <button
          onClick={() => toast.info("Ganti foto sampul")}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
        </button>
        {/* Edit button */}
        <button
          onClick={() => navigate("/panti/edit-profil")}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
        >
          <Pencil className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto px-6">
        {/* Avatar */}
        <div className="relative -mt-10 mb-4 flex items-end justify-between">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-teal flex items-center justify-center border-4 border-white shadow">
              <Home className="w-9 h-9 text-white" />
            </div>
            <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center border border-gray-200">
              <Camera className="w-3.5 h-3.5 text-[#6D5A4F]" />
            </button>
          </div>
        </div>

        <div className="mb-5">
          <h1 className="text-2xl font-bold text-[#6D5A4F]">Panti Asuhan Harapan Bangsa</h1>
          <div className="flex items-center gap-1 text-sm text-[#6D5A4F]/70 mt-1">
            <MapPin className="w-4 h-4" />
            <span>Jakarta Selatan</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <CheckCircle className="w-4 h-4 text-teal" />
            <span className="text-sm text-teal font-semibold">Terverifikasi</span>
          </div>
          <p className="text-sm text-[#6D5A4F]/70 mt-3 leading-relaxed">
            Panti Asuhan Harapan Bangsa adalah lembaga sosial yang berdiri sejak 1995, mendedikasikan diri untuk memberikan tempat tinggal dan pendidikan bagi anak-anak kurang mampu di Jakarta Selatan.
          </p>
        </div>

        {/* Dokumentasi Kegiatan */}
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#6D5A4F] mb-3">Dokumentasi Kegiatan</h2>
          <div className="grid grid-cols-2 gap-3">
            {photoGrid.map((p) => (
              <button
                key={p.id}
                onClick={() => setFullscreenPhoto(p.label)}
                className="aspect-video bg-gradient-to-br from-teal/70 to-teal/30 rounded-2xl flex items-center justify-center hover:from-teal/90 hover:to-teal/50 transition-colors"
              >
                <span className="text-white text-xs font-semibold text-center px-2">{p.label}</span>
              </button>
            ))}
            <button className="aspect-video border-2 border-dashed border-teal/40 rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-teal/5 transition-colors">
              <Plus className="w-6 h-6 text-teal/60" />
              <span className="text-xs text-teal/60 font-medium">Tambah Foto</span>
            </button>
          </div>
        </div>

        {/* Rekening Terverifikasi */}
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#6D5A4F] mb-3">Rekening Terverifikasi</h2>
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6D5A4F]/60 mb-1">BCA</p>
                <p className="font-bold text-[#6D5A4F]">1234 **** **** 5678</p>
              </div>
              <div className="flex items-center gap-1 bg-teal/10 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4 text-teal" />
                <span className="text-xs text-teal font-semibold">Terverifikasi</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAddRekening(true)}
            className="w-full border border-teal text-teal rounded-full px-6 py-3 text-sm font-semibold hover:bg-teal/5 transition-colors"
          >
            + Tambah Rekening
          </button>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-5">
          <button className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 border-b border-gray-100">
            <Bell className="w-5 h-5 text-[#6D5A4F]/60" />
            <span className="text-sm text-[#6D5A4F]">Pengaturan Notifikasi</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 border-b border-gray-100">
            <HelpCircle className="w-5 h-5 text-[#6D5A4F]/60" />
            <span className="text-sm text-[#6D5A4F]">Bantuan</span>
          </button>
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full flex items-center gap-3 px-4 py-4 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            <span className="text-sm text-red-500 font-semibold">Logout</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Photo Modal */}
      {fullscreenPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-6">
          <div className="relative w-full max-w-sm">
            <div className="aspect-video bg-gradient-to-br from-teal/80 to-teal/40 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">{fullscreenPhoto}</span>
            </div>
            <button
              onClick={() => setFullscreenPhoto(null)}
              className="absolute -top-3 -right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      )}

      {/* Add Rekening Bottom Sheet */}
      {showAddRekening && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[#6D5A4F]">Tambah Rekening</h3>
              <button onClick={() => setShowAddRekening(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="relative">
              <select
                value={rekeningForm.bank}
                onChange={(e) => setRekeningForm((f) => ({ ...f, bank: e.target.value }))}
                className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#6D5A4F] bg-white focus:outline-none focus:ring-2 focus:ring-teal pr-10"
              >
                <option value="">Pilih Bank</option>
                {banks.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D5A4F]/60 pointer-events-none" />
            </div>
            <input
              type="text"
              placeholder="Nomor Rekening"
              value={rekeningForm.nomor}
              onChange={(e) => setRekeningForm((f) => ({ ...f, nomor: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#6D5A4F] bg-white focus:outline-none focus:ring-2 focus:ring-teal"
            />
            <input
              type="text"
              placeholder="Nama Pemilik Rekening"
              value={rekeningForm.nama}
              onChange={(e) => setRekeningForm((f) => ({ ...f, nama: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#6D5A4F] bg-white focus:outline-none focus:ring-2 focus:ring-teal"
            />
            <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-teal/5 transition-colors">
              <span className="text-gray-400 text-sm">Upload Buku Tabungan</span>
            </div>
            <button
              onClick={() => {
                setShowAddRekening(false);
                toast.success("Rekening diajukan untuk verifikasi");
              }}
              className="w-full bg-teal text-white rounded-full px-6 py-3 font-semibold hover:bg-teal/90 transition-colors"
            >
              Simpan & Ajukan Verifikasi
            </button>
          </div>
        </div>
      )}

      {/* Logout Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-bold text-[#6D5A4F] mb-2">Konfirmasi Logout</h3>
            <p className="text-sm text-[#6D5A4F]/70 mb-5">Apakah Anda yakin ingin keluar dari akun ini?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="flex-1 py-3 border border-gray-200 rounded-full text-sm font-semibold text-[#6D5A4F] hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex-1 py-3 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
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
          <button onClick={() => navigate("/panti/donasi")} className="flex flex-col items-center gap-1 text-[#6D5A4F]/60">
            <Package className="w-6 h-6" />
            <span className="text-xs">Donasi</span>
          </button>
          <button onClick={() => navigate("/panti/laporan")} className="flex flex-col items-center gap-1 text-[#6D5A4F]/60">
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Laporan</span>
          </button>
          <button onClick={() => navigate("/panti/profil")} className="flex flex-col items-center gap-1 text-teal">
            <User className="w-6 h-6 fill-teal/20" />
            <span className="text-xs font-semibold">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
