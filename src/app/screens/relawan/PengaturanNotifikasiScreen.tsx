import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Bell } from "lucide-react";

export default function PengaturanNotifikasiScreen() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    kegiatanBaru: true,
    statusDonasi: true,
    pengingatKegiatan: true,
    emailMarketing: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-cream pb-20">
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl">Pengaturan Notifikasi</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        <div className="bg-white rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Kegiatan Relawan Baru</p>
              <p className="text-xs text-foreground/50">Dapatkan notifikasi saat panti asuhan membuka kegiatan baru</p>
            </div>
            <button onClick={() => toggle("kegiatanBaru")} className={`w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${settings.kegiatanBaru ? "bg-coral" : "bg-muted"}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 transform ${settings.kegiatanBaru ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Pembaruan Status Donasi</p>
              <p className="text-xs text-foreground/50">Kabar mengenai status donasi barang atau uang Anda</p>
            </div>
            <button onClick={() => toggle("statusDonasi")} className={`w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${settings.statusDonasi ? "bg-coral" : "bg-muted"}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 transform ${settings.statusDonasi ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Pengingat Jadwal Kegiatan</p>
              <p className="text-xs text-foreground/50">Pengingat untuk kegiatan yang Anda ikuti sebelum dimulai</p>
            </div>
            <button onClick={() => toggle("pengingatKegiatan")} className={`w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${settings.pengingatKegiatan ? "bg-coral" : "bg-muted"}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 transform ${settings.pengingatKegiatan ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Berita & Buletin</p>
              <p className="text-xs text-foreground/50">Info rilis fitur baru, kabar panti, dan newsletter</p>
            </div>
            <button onClick={() => toggle("emailMarketing")} className={`w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${settings.emailMarketing ? "bg-coral" : "bg-muted"}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 transform ${settings.emailMarketing ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
