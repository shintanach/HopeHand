import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, ChevronDown } from "lucide-react";

const kotaOptions = [
  "Jakarta Selatan", "Jakarta Utara", "Jakarta Barat", "Jakarta Timur", "Jakarta Pusat",
  "Bandung", "Surabaya", "Yogyakarta", "Semarang", "Medan", "Makassar", "Palembang"
];

export default function EditProfilPantiScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: "Panti Asuhan Harapan Bangsa",
    alamat: "Jl. Kebayoran Baru No. 12, RT 03/RW 05",
    kota: "Jakarta Selatan",
    deskripsi: "Panti Asuhan Harapan Bangsa adalah lembaga sosial yang berdiri sejak 1995, mendedikasikan diri untuk memberikan tempat tinggal dan pendidikan bagi anak-anak kurang mampu di Jakarta Selatan.",
    noHp: "021-7654321",
    email: "harapanbangsa@gmail.com",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const set = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const required = ["nama", "alamat", "kota", "deskripsi", "noHp", "email"];
    const newErrors: Record<string, boolean> = {};
    required.forEach((k) => {
      if (!form[k as keyof typeof form]) newErrors[k] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    toast.success("Profil panti berhasil diperbarui");
    navigate("/panti/profil");
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
          <h1 className="text-lg font-bold text-[#6D5A4F]">Edit Profil Panti</h1>
          <button onClick={handleSave} className="text-teal font-semibold text-sm hover:text-teal/80">
            Simpan
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-5">
        {/* Nama Panti */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Nama Panti <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.nama}
            onChange={(e) => set("nama", e.target.value)}
            className={inputClass("nama")}
          />
          {errors.nama && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Alamat */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Alamat <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={2}
            value={form.alamat}
            onChange={(e) => set("alamat", e.target.value)}
            className={inputClass("alamat")}
          />
          {errors.alamat && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Kota */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Kota <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              value={form.kota}
              onChange={(e) => set("kota", e.target.value)}
              className={`${inputClass("kota")} appearance-none pr-10`}
            >
              {kotaOptions.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D5A4F]/60 pointer-events-none" />
          </div>
          {errors.kota && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Deskripsi <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={4}
            value={form.deskripsi}
            onChange={(e) => set("deskripsi", e.target.value)}
            className={inputClass("deskripsi")}
          />
          {errors.deskripsi && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* No HP */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            No. HP Panti <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            value={form.noHp}
            onChange={(e) => set("noHp", e.target.value)}
            className={inputClass("noHp")}
          />
          {errors.noHp && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-[#6D5A4F] mb-1">
            Email Panti <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputClass("email")}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">Wajib diisi</p>}
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-teal text-white rounded-full px-6 py-3 font-semibold hover:bg-teal/90 transition-colors"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}
