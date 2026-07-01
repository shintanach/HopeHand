import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function VerifikasiKampanyeDetailScreen() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [notesError, setNotesError] = useState(false);
  const [showSetujuiDialog, setShowSetujuiDialog] = useState(false);
  const [showTolakDialog, setShowTolakDialog] = useState(false);

  const campaignTitle = "Bantu Seragam Sekolah Anak Yatim";
  const pantiName = "Panti Asuhan Cahaya Harapan";

  function handleSetujui() {
    setShowSetujuiDialog(false);
    navigate("/admin/verifikasi");
    toast.success("Kampanye berhasil diverifikasi");
  }

  function handleTolakAttempt() {
    if (!notes.trim()) {
      setNotesError(true);
      return;
    }
    setNotesError(false);
    setShowTolakDialog(true);
  }

  function handleTolakConfirm() {
    setShowTolakDialog(false);
    navigate("/admin/verifikasi");
    toast.error("Kampanye ditolak");
  }

  return (
    <div className="min-h-screen bg-cream pb-28">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-border/50 px-5 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" style={{ color: "#6D5A4F" }} />
        </button>
        <h1 className="text-lg font-bold" style={{ color: "#6D5A4F" }}>Verifikasi Kampanye</h1>
      </div>

      {/* Campaign Photo Placeholder */}
      <div
        className="w-full h-48 flex items-end px-5 pb-5"
        style={{ background: "linear-gradient(135deg, #6ECDB1 0%, #4A9E8A 100%)" }}
      >
        <div>
          <p className="text-white font-bold text-xl leading-snug drop-shadow">{campaignTitle}</p>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Campaign Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium" style={{ color: "#6D5A4F" }}>{pantiName}</span>
            <span
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}
            >
              <CheckCircle className="w-3 h-3" />
              Terverifikasi
            </span>
          </div>

          <div className="space-y-2 text-sm" style={{ color: "#6D5A4F" }}>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Target Dana</span>
              <span className="font-bold text-base" style={{ color: "#B4A7E7" }}>Rp 50.000.000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Tenggat Waktu</span>
              <span className="font-semibold">31 Agustus 2026</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Diajukan</span>
              <span className="font-semibold">28 Juni 2026</span>
            </div>
          </div>
        </div>

        {/* Rekening Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold mb-3" style={{ color: "#6D5A4F" }}>Rekening Penerima</p>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#F5EDE8" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#6ECDB1" }}>B</div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "#6D5A4F" }}>BCA - 1234567890</p>
              <p className="text-xs text-gray-500">Ahmad Wijaya</p>
            </div>
            <span
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}
            >
              <CheckCircle className="w-3 h-3" />
              Terverifikasi
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold mb-2" style={{ color: "#6D5A4F" }}>Deskripsi Kampanye</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Kampanye ini bertujuan membantu anak-anak yatim piatu di Panti Asuhan Cahaya Harapan mendapatkan seragam sekolah yang layak untuk tahun ajaran 2026/2027. Sebanyak 45 anak membutuhkan seragam baru karena seragam lama sudah tidak layak pakai. Dana akan digunakan untuk pembelian seragam SD, SMP, dan SMA sesuai jenjang pendidikan masing-masing anak.
          </p>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold mb-2" style={{ color: "#6D5A4F" }}>Catatan Admin</p>
          <textarea
            value={notes}
            onChange={(e) => { setNotes(e.target.value); if (e.target.value.trim()) setNotesError(false); }}
            placeholder="Alasan penolakan, permintaan dokumen tambahan, dll."
            rows={3}
            className="w-full rounded-xl p-3 text-sm resize-none outline-none transition-colors"
            style={{
              backgroundColor: "#F5EDE8",
              color: "#6D5A4F",
              border: notesError ? "1.5px solid #EF4444" : "1.5px solid transparent",
            }}
          />
          {notesError && <p className="text-xs text-red-500 mt-1">Catatan wajib diisi sebelum menolak</p>}
        </div>
      </div>

      {/* Sticky Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border/50 px-5 py-4 flex gap-3 z-10">
        <button
          onClick={() => setShowSetujuiDialog(true)}
          className="flex-1 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#10B981", color: "white" }}
        >
          <span>✓</span> Setujui Kampanye
        </button>
        <button
          onClick={handleTolakAttempt}
          className="flex-1 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 border-2 hover:opacity-90 transition-opacity"
          style={{ borderColor: "#EF4444", color: "#EF4444", backgroundColor: "white" }}
        >
          <span>✗</span> Tolak
        </button>
      </div>

      {/* Setujui Dialog */}
      {showSetujuiDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="font-bold text-base mb-2 text-center" style={{ color: "#6D5A4F" }}>Setujui Kampanye?</p>
            <p className="text-sm text-center text-gray-500 mb-5">Kampanye <span className="font-semibold">"{campaignTitle}"</span> akan dipublikasikan.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowSetujuiDialog(false)} className="flex-1 py-2.5 rounded-full text-sm border border-border" style={{ color: "#6D5A4F" }}>Batal</button>
              <button onClick={handleSetujui} className="flex-1 py-2.5 rounded-full text-sm font-bold text-white" style={{ backgroundColor: "#10B981" }}>Ya, Setujui</button>
            </div>
          </div>
        </div>
      )}

      {/* Tolak Dialog */}
      {showTolakDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="font-bold text-base mb-2 text-center" style={{ color: "#6D5A4F" }}>Tolak Kampanye?</p>
            <p className="text-sm text-center text-gray-500 mb-5">Kampanye <span className="font-semibold">"{campaignTitle}"</span> akan ditolak.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowTolakDialog(false)} className="flex-1 py-2.5 rounded-full text-sm border border-border" style={{ color: "#6D5A4F" }}>Batal</button>
              <button onClick={handleTolakConfirm} className="flex-1 py-2.5 rounded-full text-sm font-bold text-white" style={{ backgroundColor: "#EF4444" }}>Ya, Tolak</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
