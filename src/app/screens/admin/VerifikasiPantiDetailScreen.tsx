import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ZoomIn, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function VerifikasiPantiDetailScreen() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [notesError, setNotesError] = useState(false);
  const [showSetujuiDialog, setShowSetujuiDialog] = useState(false);
  const [showTolakDialog, setShowTolakDialog] = useState(false);

  const pantiName = "Panti Asuhan Cahaya Harapan";

  function handleSetujui() {
    setShowSetujuiDialog(false);
    navigate("/admin/verifikasi");
    toast.success("Panti berhasil diverifikasi");
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
    toast.error("Pendaftaran ditolak");
  }

  return (
    <div className="min-h-screen bg-cream pb-28">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-border/50 px-5 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" style={{ color: "#6D5A4F" }} />
        </button>
        <h1 className="text-lg font-bold" style={{ color: "#6D5A4F" }}>Verifikasi Panti</h1>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Panti Info Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#EDE9F8" }}
            >
              <Building2 className="w-8 h-8" style={{ color: "#B4A7E7" }} />
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: "#6D5A4F" }}>{pantiName}</p>
              <p className="text-sm text-gray-500">Pengelola: Ahmad Wijaya</p>
            </div>
          </div>

          <div className="space-y-2 text-sm" style={{ color: "#6D5A4F" }}>
            <div className="flex gap-2">
              <span className="text-gray-400 w-20 shrink-0">Kota</span>
              <span className="font-medium">Surabaya, Jawa Timur</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400 w-20 shrink-0">Alamat</span>
              <span className="font-medium">Jl. Raya Darmo No. 45, Surabaya 60241</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400 w-20 shrink-0">Telepon</span>
              <span className="font-medium">+62 812-3456-7890</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400 w-20 shrink-0">Email</span>
              <span className="font-medium">cahayaharapan@gmail.com</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400 w-20 shrink-0">Deskripsi</span>
              <span className="font-medium flex-1">Panti asuhan yang berdiri sejak 2005 menampung 45 anak yatim piatu dari berbagai daerah di Jawa Timur.</span>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold mb-3" style={{ color: "#6D5A4F" }}>Dokumen Pendukung</p>
          <div className="space-y-3">
            {[
              { label: "Foto KTP Pengelola" },
              { label: "Surat Izin Panti" },
            ].map((doc) => (
              <div key={doc.label}>
                <p className="text-xs text-gray-500 mb-1">{doc.label}</p>
                <div
                  className="w-full h-32 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "#F5EDE8" }}
                >
                  <ZoomIn className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-400">Tap untuk memperbesar</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold mb-2" style={{ color: "#6D5A4F" }}>Informasi Bank</p>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#F5EDE8" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#6ECDB1" }}>B</div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#6D5A4F" }}>BCA - 1234567890</p>
              <p className="text-xs text-gray-500">Ahmad Wijaya</p>
            </div>
          </div>
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

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border/50 px-5 py-4 flex gap-3 z-10">
        <button
          onClick={() => setShowSetujuiDialog(true)}
          className="flex-1 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#10B981", color: "white" }}
        >
          <span>✓</span> Setujui
        </button>
        <button
          onClick={handleTolakAttempt}
          className="flex-1 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 border-2 transition-opacity hover:opacity-90"
          style={{ borderColor: "#EF4444", color: "#EF4444", backgroundColor: "white" }}
        >
          <span>✗</span> Tolak
        </button>
      </div>

      {/* Setujui Dialog */}
      {showSetujuiDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="font-bold text-base mb-2 text-center" style={{ color: "#6D5A4F" }}>Setujui Pendaftaran?</p>
            <p className="text-sm text-center text-gray-500 mb-5">Setujui pendaftaran <span className="font-semibold">{pantiName}</span>?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSetujuiDialog(false)}
                className="flex-1 py-2.5 rounded-full text-sm border border-border"
                style={{ color: "#6D5A4F" }}
              >
                Batal
              </button>
              <button
                onClick={handleSetujui}
                className="flex-1 py-2.5 rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: "#10B981" }}
              >
                Ya, Setujui
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tolak Dialog */}
      {showTolakDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="font-bold text-base mb-2 text-center" style={{ color: "#6D5A4F" }}>Tolak Pendaftaran?</p>
            <p className="text-sm text-center text-gray-500 mb-5">Pendaftaran <span className="font-semibold">{pantiName}</span> akan ditolak. Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTolakDialog(false)}
                className="flex-1 py-2.5 rounded-full text-sm border border-border"
                style={{ color: "#6D5A4F" }}
              >
                Batal
              </button>
              <button
                onClick={handleTolakConfirm}
                className="flex-1 py-2.5 rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: "#EF4444" }}
              >
                Ya, Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
