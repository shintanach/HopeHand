import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function BantuanFAQScreen() {
  const navigate = useNavigate();

  const faqs = [
    { q: "Bagaimana cara mendaftar menjadi relawan?", a: "Pilih kegiatan aktif di halaman beranda atau explore, lalu klik tombol 'Daftar' pada kegiatan yang Anda inginkan." },
    { q: "Bagaimana cara mendonasikan barang?", a: "Anda dapat mendonasikan barang melalui pilihan menu donasi barang, melengkapi detail barang, dan memilih metode antar sendiri atau dijemput." },
    { q: "Bagaimana cara melakukan verifikasi donasi uang?", a: "Lakukan transfer ke rekening panti yang tertera pada detail kampanye, lalu isi form donasi uang beserta bukti transfernya." },
    { q: "Apakah saya bisa membatalkan pendaftaran kegiatan?", a: "Saat ini pembatalan pendaftaran kegiatan dapat dikoordinasikan langsung menghubungi kontak panti asuhan terkait." },
  ];

  return (
    <div className="min-h-screen bg-cream pb-20">
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl">Bantuan & FAQ</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        <h2 className="text-lg font-medium text-foreground mb-2">Pertanyaan Populer</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-border/50">
              <p className="font-medium text-foreground mb-2">{faq.q}</p>
              <p className="text-sm text-foreground/75 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
