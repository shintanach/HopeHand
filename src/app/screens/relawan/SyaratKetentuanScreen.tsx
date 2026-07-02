import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function SyaratKetentuanScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream pb-20">
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl">Syarat & Ketentuan</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl p-6 space-y-4 text-foreground/80 text-sm leading-relaxed">
          <h2 className="text-base font-semibold text-foreground">1. Ketentuan Umum</h2>
          <p>Dengan menggunakan platform Hope Hand, Anda setuju untuk mematuhi seluruh syarat dan ketentuan penggunaan layanan yang kami sediakan.</p>

          <h2 className="text-base font-semibold text-foreground">2. Tanggung Jawab Relawan</h2>
          <p>Setiap relawan bertanggung jawab penuh atas keakuratan informasi profil, serta kesediaan untuk mematuhi komitmen pada kegiatan sosial yang diikuti.</p>

          <h2 className="text-base font-semibold text-foreground">3. Validitas Donasi</h2>
          <p>Semua donasi barang harus dalam kondisi layak guna. Donasi berupa uang wajib ditransfer ke rekening panti asuhan resmi, dan bukti transfer diunggah secara jujur tanpa rekayasa.</p>

          <h2 className="text-base font-semibold text-foreground">4. Hak Platform</h2>
          <p>Hope Hand berhak membatalkan akun relawan maupun panti asuhan yang terbukti melakukan penyalahgunaan, penipuan, atau pelanggaran etika sosial.</p>
        </div>
      </div>
    </div>
  );
}
