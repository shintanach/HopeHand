import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Upload, Plus, Minus } from "lucide-react";

const categories = ["Pakaian", "Perlengkapan Sekolah", "Makanan", "Perabot", "Kesehatan", "Lainnya"];
const satuanOptions = ["pcs", "lusin", "set", "kg", "liter"];

export default function TambahKebutuhanBarangScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    jumlah: 1,
    satuan: "pcs",
    deskripsi: "",
    urgensi: "Normal",
  });
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const set = (key: string, val: string | number) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const required = ["nama", "kategori", "deskripsi"];
    const newErrors: Record<string, boolean> = {};
    required.forEach((k) => {
      if (!form[k as keyof typeof form]) newErrors[k] = true;
    });
    if (!photoUploaded) newErrors["photo"] = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = () => {
    if (!validate()) return;
    toast.success("Kebutuhan berhasil dipublikasikan");
    navigate(-1);
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
          <h1 className="text-lg font-bold text-[#6D5A4F]">Tambah Kebutuhan</h1>
          <button onClick={handlePublish} className="text-teal font-semibold text-sm hover:text-teal/80">
            Publikasikan
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-5">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Foto Barang <span className="text-red-400">*</span>
          </label>
          <button
            onClick={() => setPhotoUploaded(true)}
            className={`w-full h-40 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed transition-colors ${
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
                <span className="text-gray-500 text-sm">Tap untuk upload foto barang</span>
              </div>
            )}
          </button>
          {errors.photo && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Nama Barang */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Nama Barang <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Sepatu Sekolah"
            value={form.nama}
            onChange={(e) => set("nama", e.target.value)}
            className={inputClass("nama")}
          />
          {errors.nama && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Kategori <span className="text-red-400">*</span>
          </label>
          <select value={form.kategori} onChange={(e) => set("kategori", e.target.value)} className={inputClass("kategori")}>
            <option value="">Pilih kategori</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.kategori && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Jumlah + Satuan */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">Jumlah Dibutuhkan</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => set("jumlah", Math.max(1, form.jumlah - 1))}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#6D5A4F] hover:bg-teal/10"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-bold text-[#6D5A4F] w-8 text-center">{form.jumlah}</span>
            <button
              onClick={() => set("jumlah", form.jumlah + 1)}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#6D5A4F] hover:bg-teal/10"
            >
              <Plus className="w-4 h-4" />
            </button>
            <select
              value={form.satuan}
              onChange={(e) => set("satuan", e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#6D5A4F] bg-white focus:outline-none focus:ring-2 focus:ring-teal"
            >
              {satuanOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Deskripsi Kondisi */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Deskripsi Kondisi <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Jelaskan kondisi barang yang dibutuhkan..."
            value={form.deskripsi}
            onChange={(e) => set("deskripsi", e.target.value)}
            className={inputClass("deskripsi")}
          />
          {errors.deskripsi && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Urgensi */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-2">Tingkat Urgensi</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="Normal"
                checked={form.urgensi === "Normal"}
                onChange={() => set("urgensi", "Normal")}
                className="accent-teal w-4 h-4"
              />
              <span className="text-sm text-[#6D5A4F]">Normal</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="Mendesak"
                checked={form.urgensi === "Mendesak"}
                onChange={() => set("urgensi", "Mendesak")}
                className="accent-red-500 w-4 h-4"
              />
              <span className="text-sm text-red-600 font-semibold">Mendesak</span>
            </label>
          </div>
        </div>

        <button
          onClick={handlePublish}
          className="w-full bg-teal text-white rounded-full px-6 py-3 font-semibold hover:bg-teal/90 transition-colors"
        >
          Publikasikan Kebutuhan
        </button>
      </div>
    </div>
  );
}
