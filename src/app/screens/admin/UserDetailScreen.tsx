import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Mail, Phone, MapPin, MessageSquare, ShieldOff, Ban } from "lucide-react";
import { toast } from "sonner";

type SuspendDuration = "7hari" | "30hari" | "permanen";

export default function UserDetailScreen() {
  const navigate = useNavigate();

  // Message sheet
  const [showMessageSheet, setShowMessageSheet] = useState(false);
  const [message, setMessage] = useState("");

  // Suspend dialog
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [suspendDuration, setSuspendDuration] = useState<SuspendDuration>("7hari");
  const [suspendNotes, setSuspendNotes] = useState("");

  // Ban dialog
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [banNotes, setBanNotes] = useState("");
  const [banNotesError, setBanNotesError] = useState(false);

  function handleSendMessage() {
    setShowMessageSheet(false);
    setMessage("");
    toast.success("Pesan terkirim");
  }

  function handleSuspend() {
    setShowSuspendDialog(false);
    setSuspendNotes("");
    toast.success("Akun berhasil di-suspend");
  }

  function handleBanAttempt() {
    if (!banNotes.trim()) {
      setBanNotesError(true);
      return;
    }
    setBanNotesError(false);
    setShowBanDialog(false);
    setBanNotes("");
    toast.error("Akun berhasil di-ban");
  }

  return (
    <div className="min-h-screen bg-cream pb-8">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-border/50 px-5 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" style={{ color: "#6D5A4F" }} />
        </button>
        <h1 className="text-lg font-bold" style={{ color: "#6D5A4F" }}>Detail Pengguna</h1>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-white mb-3"
            style={{ backgroundColor: "#B4A7E7" }}
          >
            BS
          </div>
          <p className="font-bold text-lg mb-2" style={{ color: "#6D5A4F" }}>Budi Santoso</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: "#FFECE8", color: "#C05621" }}>Relawan</span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}>Aktif</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Bergabung Januari 2025</p>
        </div>

        {/* Info Rows */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <p className="font-bold text-sm mb-1" style={{ color: "#6D5A4F" }}>Informasi Akun</p>
          {[
            { icon: Mail, label: "Email", value: "budi.santoso@email.com" },
            { icon: Phone, label: "No. HP", value: "+62 812-3456-7890" },
            { icon: MapPin, label: "Kota", value: "Surabaya, Jawa Timur" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#EDE9F8" }}>
                <row.icon className="w-4 h-4" style={{ color: "#B4A7E7" }} />
              </div>
              <div>
                <p className="text-xs text-gray-400">{row.label}</p>
                <p className="text-sm font-medium" style={{ color: "#6D5A4F" }}>{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Stats */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold text-sm mb-3" style={{ color: "#6D5A4F" }}>Ringkasan Aktivitas</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Kegiatan", value: "24" },
              { label: "Donasi Barang", value: "12 item" },
              { label: "Donasi Uang", value: "Rp 1,5 Jt" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: "#F5EDE8" }}>
                <p className="font-bold text-base" style={{ color: "#B4A7E7" }}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => setShowMessageSheet(true)}
            className="w-full py-3 rounded-full text-sm font-semibold border-2 flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
            style={{ borderColor: "#B4A7E7", color: "#B4A7E7", backgroundColor: "white" }}
          >
            <MessageSquare className="w-4 h-4" />
            Kirim Pesan
          </button>
          <button
            onClick={() => setShowSuspendDialog(true)}
            className="w-full py-3 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#F59E0B" }}
          >
            <ShieldOff className="w-4 h-4" />
            Suspend Akun
          </button>
          <button
            onClick={() => setShowBanDialog(true)}
            className="w-full py-3 rounded-full text-sm font-semibold border-2 flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
            style={{ borderColor: "#EF4444", color: "#EF4444", backgroundColor: "white" }}
          >
            <Ban className="w-4 h-4" />
            Ban Akun
          </button>
        </div>
      </div>

      {/* Message Bottom Sheet */}
      {showMessageSheet && (
        <div
          className="fixed inset-0 bg-black/40 z-40 flex items-end justify-center"
          onClick={() => setShowMessageSheet(false)}
        >
          <div
            className="bg-white rounded-t-2xl w-full max-w-lg p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <p className="font-bold text-base mb-4" style={{ color: "#6D5A4F" }}>Kirim Pesan ke Budi Santoso</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan..."
              rows={4}
              className="w-full rounded-xl p-3 text-sm resize-none outline-none mb-4"
              style={{ backgroundColor: "#F5EDE8", color: "#6D5A4F" }}
            />
            <button
              onClick={handleSendMessage}
              className="w-full py-3 rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: "#B4A7E7" }}
            >
              Kirim
            </button>
          </div>
        </div>
      )}

      {/* Suspend Dialog */}
      {showSuspendDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="font-bold text-base mb-4 text-center" style={{ color: "#6D5A4F" }}>Suspend Akun</p>
            <p className="text-xs text-gray-500 mb-3">Durasi Suspend</p>
            <div className="space-y-2 mb-4">
              {([
                { id: "7hari" as SuspendDuration, label: "7 Hari" },
                { id: "30hari" as SuspendDuration, label: "30 Hari" },
                { id: "permanen" as SuspendDuration, label: "Permanen" },
              ]).map((opt) => (
                <label key={opt.id} className="flex items-center gap-3 cursor-pointer">
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: suspendDuration === opt.id ? "#B4A7E7" : "#D1D5DB" }}
                  >
                    {suspendDuration === opt.id && (
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#B4A7E7" }} />
                    )}
                  </div>
                  <input type="radio" className="sr-only" checked={suspendDuration === opt.id} onChange={() => setSuspendDuration(opt.id)} />
                  <span className="text-sm" style={{ color: "#6D5A4F" }}>{opt.label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mb-1">Catatan (opsional)</p>
            <textarea
              value={suspendNotes}
              onChange={(e) => setSuspendNotes(e.target.value)}
              placeholder="Alasan suspend..."
              rows={2}
              className="w-full rounded-xl p-3 text-sm resize-none outline-none mb-4"
              style={{ backgroundColor: "#F5EDE8", color: "#6D5A4F" }}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowSuspendDialog(false)} className="flex-1 py-2.5 rounded-full text-sm border border-border" style={{ color: "#6D5A4F" }}>Batal</button>
              <button onClick={handleSuspend} className="flex-1 py-2.5 rounded-full text-sm font-bold text-white" style={{ backgroundColor: "#F59E0B" }}>Ya, Suspend</button>
            </div>
          </div>
        </div>
      )}

      {/* Ban Dialog */}
      {showBanDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="font-bold text-base mb-2 text-center" style={{ color: "#6D5A4F" }}>Ban Akun</p>
            <p className="text-sm text-center text-gray-500 mb-4">Akun akan diblokir permanen. Tindakan ini tidak dapat dibatalkan.</p>
            <p className="text-xs text-gray-500 mb-1">Alasan Ban <span className="text-red-500">*</span></p>
            <textarea
              value={banNotes}
              onChange={(e) => { setBanNotes(e.target.value); if (e.target.value.trim()) setBanNotesError(false); }}
              placeholder="Alasan ban wajib diisi..."
              rows={2}
              className="w-full rounded-xl p-3 text-sm resize-none outline-none mb-1 transition-colors"
              style={{
                backgroundColor: "#F5EDE8",
                color: "#6D5A4F",
                border: banNotesError ? "1.5px solid #EF4444" : "1.5px solid transparent",
              }}
            />
            {banNotesError && <p className="text-xs text-red-500 mb-3">Alasan ban wajib diisi</p>}
            <div className="flex gap-3 mt-3">
              <button onClick={() => { setShowBanDialog(false); setBanNotesError(false); setBanNotes(""); }} className="flex-1 py-2.5 rounded-full text-sm border border-border" style={{ color: "#6D5A4F" }}>Batal</button>
              <button onClick={handleBanAttempt} className="flex-1 py-2.5 rounded-full text-sm font-bold text-white" style={{ backgroundColor: "#EF4444" }}>Ya, Ban</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
