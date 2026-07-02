import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, ZoomIn, Building2 } from "lucide-react";
import { toast } from "sonner";
import { pantiDB } from "@/imports/appwrite/database";
import { getPreviewUrl } from "@/imports/appwrite/storage";
import type { PantiDocument } from "@/imports/appwrite/types";

export default function VerifikasiPantiDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [notes, setNotes] = useState("");
  const [notesError, setNotesError] = useState(false);
  const [showSetujuiDialog, setShowSetujuiDialog] = useState(false);
  const [showTolakDialog, setShowTolakDialog] = useState(false);
  const [panti, setPanti] = useState<PantiDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadPanti = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await pantiDB.getById(id);
        setPanti(data);
      } catch (err) {
        console.error("Gagal mengambil detail panti:", err);
        toast.error("Gagal memuat data panti");
        navigate("/admin/verifikasi");
      } finally {
        setLoading(false);
      }
    };
    loadPanti();
  }, [id, navigate]);

  async function handleSetujui() {
    if (!id || isSubmitting) return;
    try {
      setIsSubmitting(true);
      setShowSetujuiDialog(false);
      await pantiDB.verify(id);
      toast.success("Panti berhasil diverifikasi! Pengelola kini dapat login.");
      setTimeout(() => navigate("/admin/verifikasi"), 1200);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyetujui pendaftaran. Coba lagi.");
      setIsSubmitting(false);
    }
  }

  function handleTolakAttempt() {
    if (!notes.trim()) {
      setNotesError(true);
      return;
    }
    setNotesError(false);
    setShowTolakDialog(true);
  }

  async function handleTolakConfirm() {
    if (!id || isSubmitting) return;
    try {
      setIsSubmitting(true);
      setShowTolakDialog(false);
      await pantiDB.reject(id, notes);
      toast.error("Pendaftaran ditolak");
      setTimeout(() => navigate("/admin/verifikasi"), 1200);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menolak pendaftaran");
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <p className="text-gray-500 text-sm">Memuat data panti...</p>
      </div>
    );
  }

  if (!panti) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <p className="text-red-500 text-sm">Panti tidak ditemukan</p>
      </div>
    );
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
              <p className="font-bold text-base" style={{ color: "#6D5A4F" }}>{panti.namaPanti}</p>
              <p className="text-sm text-gray-500">Pengelola: {panti.namaKetua}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm" style={{ color: "#6D5A4F" }}>
            <div className="flex gap-2">
              <span className="text-gray-400 w-20 shrink-0">Kota</span>
              <span className="font-medium">{panti.kota || "-"}, {panti.provinsi || "-"}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400 w-20 shrink-0">Alamat</span>
              <span className="font-medium">{panti.alamat}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400 w-20 shrink-0">Telepon</span>
              <span className="font-medium">{panti.telepon}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400 w-20 shrink-0">Email</span>
              <span className="font-medium">{panti.email}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400 w-20 shrink-0">Deskripsi</span>
              <span className="font-medium flex-1">{panti.deskripsi || "-"}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400 w-20 shrink-0">Status</span>
              <span className="font-bold capitalize">{panti.status}</span>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold mb-3" style={{ color: "#6D5A4F" }}>Dokumen Pendukung</p>
          <div className="space-y-4">
            {[
              { label: "Foto KTP Pengelola", fileId: panti.dokumenKTP },
              { label: "Surat Izin Panti", fileId: panti.dokumenSuratIzin },
              { label: "Foto Panti", fileId: panti.fotoPanti },
            ].map((doc) => (
              <div key={doc.label}>
                <p className="text-xs text-gray-500 mb-1">{doc.label}</p>
                {doc.fileId ? (
                  <div className="relative rounded-xl overflow-hidden border border-border group">
                    <img
                      src={getPreviewUrl(doc.fileId, 400).toString()}
                      alt={doc.label}
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(getPreviewUrl(doc.fileId).toString(), "_blank")}
                    />
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-md pointer-events-none flex items-center gap-1">
                      <ZoomIn className="w-3 h-3" /> Tap untuk memperbesar
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full h-20 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "#F5EDE8" }}
                  >
                    <span className="text-xs text-gray-400">Tidak ada dokumen</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bank Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold mb-2" style={{ color: "#6D5A4F" }}>Informasi Bank</p>
          {panti.noRekening ? (
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#F5EDE8" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#6ECDB1" }}>
                {panti.namaBank?.charAt(0) || "B"}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#6D5A4F" }}>{panti.namaBank} - {panti.noRekening}</p>
                <p className="text-xs text-gray-500">{panti.atasNamaRekening}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-xs text-gray-400">
              Informasi bank belum diisi
            </div>
          )}
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
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: "#10B981", color: "white" }}
        >
          {isSubmitting ? "Memproses..." : <><span>✓</span> Setujui</>}
        </button>
        <button
          onClick={handleTolakAttempt}
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 border-2 transition-opacity hover:opacity-90 disabled:opacity-60"
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
            <p className="text-sm text-center text-gray-500 mb-5">Setujui pendaftaran <span className="font-semibold">{panti.namaPanti}</span>?</p>
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
            <p className="text-sm text-center text-gray-500 mb-5">Pendaftaran <span className="font-semibold">{panti.namaPanti}</span> akan ditolak. Tindakan ini tidak dapat dibatalkan.</p>
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
