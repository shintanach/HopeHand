import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";

export default function BuatKampanyeScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    target: "",
    tenggat: "",
  });
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const set = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const required = ["judul", "deskripsi", "target", "tenggat"];
    const newErrors: Record<string, boolean> = {};
    required.forEach((k) => {
      if (!form[k as keyof typeof form]) newErrors[k] = true;
    });
    if (!photoUploaded) newErrors["photo"] = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    toast.success("Kampanye diajukan, menunggu persetujuan admin");
    navigate("/panti/kampanye");
  };

  const inputClass = (key: string) =>
    `w-full border rounded-xl px-4 py-3 text-sm text-[#6D5A4F] bg-white focus:outline-none focus:ring-2 focus:ring-teal transition ${
      errors[key] ? "border-red-400 ring-1 ring-red-400" : "border-gray-200"
    }`;

  return (
    <div className="min-h-screen bg-cream pb-8">
      {/* Header */}
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full hover:bg-white flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-[#6D5A4F]" />
          </button>
          <h1 className="text-lg font-bold text-[#6D5A4F]">Buat Kampanye</h1>
          <button onClick={handleSubmit} className="text-teal font-semibold text-sm hover:text-teal/80">
            Ajukan
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-5">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Foto Kampanye <span className="text-red-400">*</span>
          </label>
          <button
            onClick={() => setPhotoUploaded(true)}
            className={`w-full h-44 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed transition-colors ${
              photoUploaded
                ? "bg-teal/20 border-teal"
                : errors.photo
                ? "border-red-400 bg-red-50"
                : "border-gray-300 bg-white hover:bg-teal/5"
            }`}
          >
            {photoUploaded ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-teal/30 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-teal" />
                </div>
                <span className="text-teal font-semibold text-sm">Foto berhasil diunggah</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-gray-500 text-sm">Tap untuk upload foto kampanye</span>
              </div>
            )}
          </button>
          {errors.photo && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Judul */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Judul Kampanye <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Renovasi Ruang Belajar"
            value={form.judul}
            onChange={(e) => set("judul", e.target.value)}
            className={inputClass("judul")}
          />
          {errors.judul && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Deskripsi Kebutuhan <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Jelaskan kebutuhan dan tujuan kampanye..."
            value={form.deskripsi}
            onChange={(e) => set("deskripsi", e.target.value)}
            className={inputClass("deskripsi")}
          />
          {errors.deskripsi && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Target Dana */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Target Dana <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#6D5A4F]/60 font-semibold">Rp</span>
            <input
              type="number"
              placeholder="0"
              value={form.target}
              onChange={(e) => set("target", e.target.value)}
              className={`${inputClass("target")} pl-12`}
            />
          </div>
          {errors.target && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Tenggat */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Tenggat Waktu <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            value={form.tenggat}
            onChange={(e) => set("tenggat", e.target.value)}
            className={inputClass("tenggat")}
          />
          {errors.tenggat && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Rekening Info */}
        <div className="bg-teal/10 border border-teal/30 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-teal" />
          </div>
          <div>
            <p className="text-xs text-[#6D5A4F]/60 mb-0.5">Rekening Terdaftar</p>
            <p className="text-sm font-bold text-[#6D5A4F]">BCA – 1234567890</p>
            <div className="flex items-center gap-1 mt-0.5">
              <CheckCircle className="w-3.5 h-3.5 text-teal" />
              <span className="text-xs text-teal font-medium">Terverifikasi</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-teal text-white rounded-full px-6 py-3 font-semibold hover:bg-teal/90 transition-colors"
        >
          Ajukan Kampanye
        </button>
      </div>
    </div>
  );
}
