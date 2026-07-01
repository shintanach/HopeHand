import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Upload, X, Package, User, Truck, Calendar } from "lucide-react";

const donationInfo = {
  item: "Sepatu Sekolah",
  qty: "5 pasang",
  donor: "Budi Santoso",
  kurir: "JNE",
  resi: "JNE1234567890",
  estimatedArrival: "13 Juli 2026",
};

export default function KonfirmasiPenerimaanBarangScreen() {
  const navigate = useNavigate();
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [note, setNote] = useState("");
  const [shake, setShake] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  const handleConfirm = () => {
    if (!photoUploaded) {
      setPhotoError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    toast.success("Penerimaan berhasil dikonfirmasi");
    navigate("/panti/donasi");
  };

  return (
    <div className="min-h-screen bg-cream pb-8">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .shake { animation: shake 0.5s ease; }
      `}</style>

      {/* Header */}
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full hover:bg-white flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-[#6D5A4F]" />
          </button>
          <h1 className="text-lg font-bold text-[#6D5A4F]">Konfirmasi Penerimaan</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-5">
        {/* Donation Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-[#6D5A4F]">Ringkasan Donasi</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-teal" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#6D5A4F]">{donationInfo.item}</p>
                <p className="text-xs text-[#6D5A4F]/60">{donationInfo.qty}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
                <User className="w-5 h-5 text-teal" />
              </div>
              <div>
                <p className="text-xs text-[#6D5A4F]/60">Pengirim</p>
                <p className="text-sm font-semibold text-[#6D5A4F]">{donationInfo.donor}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-teal" />
              </div>
              <div>
                <p className="text-xs text-[#6D5A4F]/60">Ekspedisi · No. Resi</p>
                <p className="text-sm font-semibold text-[#6D5A4F]">{donationInfo.kurir} · {donationInfo.resi}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-teal" />
              </div>
              <div>
                <p className="text-xs text-[#6D5A4F]/60">Estimasi Tiba</p>
                <p className="text-sm font-semibold text-[#6D5A4F]">{donationInfo.estimatedArrival}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Bukti */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Upload Bukti Penerimaan <span className="text-red-400">*</span>
          </label>
          <div className={shake ? "shake" : ""}>
            <div
              className={`w-full h-44 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed transition-colors relative ${
                photoUploaded
                  ? "bg-teal/20 border-teal"
                  : photoError
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 bg-white hover:bg-teal/5"
              }`}
            >
              {photoUploaded ? (
                <>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-teal/30 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-teal" />
                    </div>
                    <span className="text-teal font-semibold text-sm">Foto bukti diunggah</span>
                    <span className="text-xs text-teal/70">bukti_penerimaan.jpg</span>
                  </div>
                  <button
                    onClick={() => { setPhotoUploaded(false); setPhotoError(false); }}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:bg-red-50"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setPhotoUploaded(true); setPhotoError(false); }}
                  className="flex flex-col items-center gap-2 w-full h-full justify-center"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-500 text-sm">Tap untuk upload foto bukti</span>
                </button>
              )}
            </div>
          </div>
          {photoError && !photoUploaded && (
            <p className="text-red-500 text-xs mt-1">Foto bukti wajib diunggah</p>
          )}
        </div>

        {/* Catatan */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">Catatan Kondisi (opsional)</label>
          <textarea
            rows={3}
            placeholder="Contoh: Barang diterima dalam kondisi baik"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#6D5A4F] bg-white focus:outline-none focus:ring-2 focus:ring-teal transition"
          />
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full bg-teal text-white rounded-full px-6 py-3 font-semibold hover:bg-teal/90 transition-colors"
        >
          Konfirmasi Diterima
        </button>
      </div>
    </div>
  );
}
