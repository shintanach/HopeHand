import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Upload, Plus, Minus } from "lucide-react";

const categories = ["Mengajar", "Bermain", "Keterampilan", "Olahraga", "Lainnya"];

export default function TambahKegiatanScreen() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
    kategori: "",
    tanggal: "",
    waktuMulai: "",
    waktuSelesai: "",
    kuota: 1,
    lokasi: "",
    persyaratan: "",
  });
  const [bannerUploaded, setBannerUploaded] = useState(false);
  const [persyaratanOn, setPersyaratanOn] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const set = (key: string, val: string | number) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const required = ["nama", "deskripsi", "kategori", "tanggal", "waktuMulai", "waktuSelesai", "lokasi"];
    const newErrors: Record<string, boolean> = {};
    required.forEach((k) => {
      if (!form[k as keyof typeof form]) newErrors[k] = true;
    });
    if (!bannerUploaded) newErrors["banner"] = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = () => {
    if (!validate()) return;
    toast.success("Kegiatan berhasil dipublikasikan");
    navigate("/panti/kegiatan");
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
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full hover:bg-white flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#6D5A4F]" />
          </button>
          <h1 className="text-lg font-bold text-[#6D5A4F]">Buat Kegiatan Baru</h1>
          <button
            onClick={handlePublish}
            className="text-teal font-semibold text-sm hover:text-teal/80"
          >
            Publikasikan
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-5">
        {/* Nama Kegiatan */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Nama Kegiatan <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Mengajar Matematika Kelas 5"
            value={form.nama}
            onChange={(e) => set("nama", e.target.value)}
            className={inputClass("nama")}
          />
          {errors.nama && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Deskripsi <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Jelaskan detail kegiatan..."
            value={form.deskripsi}
            onChange={(e) => set("deskripsi", e.target.value)}
            className={inputClass("deskripsi")}
          />
          {errors.deskripsi && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Kategori <span className="text-red-400">*</span>
          </label>
          <select
            value={form.kategori}
            onChange={(e) => set("kategori", e.target.value)}
            className={inputClass("kategori")}
          >
            <option value="">Pilih kategori</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.kategori && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Tanggal */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Tanggal <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            value={form.tanggal}
            onChange={(e) => set("tanggal", e.target.value)}
            className={inputClass("tanggal")}
          />
          {errors.tanggal && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Waktu */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
              Waktu Mulai <span className="text-red-400">*</span>
            </label>
            <input
              type="time"
              value={form.waktuMulai}
              onChange={(e) => set("waktuMulai", e.target.value)}
              className={inputClass("waktuMulai")}
            />
            {errors.waktuMulai && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
              Waktu Selesai <span className="text-red-400">*</span>
            </label>
            <input
              type="time"
              value={form.waktuSelesai}
              onChange={(e) => set("waktuSelesai", e.target.value)}
              className={inputClass("waktuSelesai")}
            />
            {errors.waktuSelesai && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
          </div>
        </div>

        {/* Kuota */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Kuota Relawan
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => set("kuota", Math.max(1, form.kuota - 1))}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#6D5A4F] hover:bg-teal/10"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-bold text-[#6D5A4F] w-8 text-center">{form.kuota}</span>
            <button
              onClick={() => set("kuota", form.kuota + 1)}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#6D5A4F] hover:bg-teal/10"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lokasi */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Lokasi <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Aula Panti Lt. 2"
            value={form.lokasi}
            onChange={(e) => set("lokasi", e.target.value)}
            className={inputClass("lokasi")}
          />
          {errors.lokasi && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Banner */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Banner Foto <span className="text-red-400">*</span>
          </label>
          <button
            onClick={() => setBannerUploaded(true)}
            className={`w-full h-40 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed transition-colors ${
              bannerUploaded
                ? "bg-teal/20 border-teal"
                : errors.banner
                ? "border-red-400 bg-red-50"
                : "border-gray-300 bg-white hover:bg-teal/5"
            }`}
          >
            {bannerUploaded ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-teal/30 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-teal" />
                </div>
                <span className="text-teal font-semibold text-sm">Banner berhasil diunggah</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-gray-500 text-sm">Tap untuk upload foto</span>
              </div>
            )}
          </button>
          {errors.banner && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Persyaratan Khusus Toggle */}
        <div>
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm p-4">
            <span className="text-sm font-semibold text-[#6D5A4F]">Persyaratan Khusus</span>
            <button
              onClick={() => setPersyaratanOn((v) => !v)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                persyaratanOn ? "bg-teal" : "bg-gray-200"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${
                  persyaratanOn ? "left-6" : "left-0.5"
                }`}
              />
            </button>
          </div>
          {persyaratanOn && (
            <textarea
              rows={3}
              placeholder="Tuliskan persyaratan khusus untuk relawan..."
              value={form.persyaratan}
              onChange={(e) => set("persyaratan", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#6D5A4F] bg-white focus:outline-none focus:ring-2 focus:ring-teal mt-3"
            />
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handlePublish}
          className="w-full bg-teal text-white rounded-full px-6 py-3 font-semibold hover:bg-teal/90 transition-colors"
        >
          Publikasikan Kegiatan
        </button>
      </div>
    </div>
  );
}
