import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Camera, Upload, Eye, EyeOff, Check, AlertCircle, X } from "lucide-react";
import { registerPanti, getAuthErrorMessage } from "../../imports/appwrite/auth";
import { uploadDokumenPanti } from "../../imports/appwrite/storage";

export default function RegisterPantiScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File state
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [suratFile, setSuratFile] = useState<File | null>(null);
  const [pantiFotoFile, setPantiFotoFile] = useState<File | null>(null);
  const [pantiFotoPreview, setPantiFotoPreview] = useState<string | null>(null);

  const ktpInputRef = useRef<HTMLInputElement>(null);
  const suratInputRef = useRef<HTMLInputElement>(null);
  const pantiFotoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    managerName: "",
    pantiName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleFotoPantiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPantiFotoFile(file);
      setPantiFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveFotoPanti = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPantiFotoFile(null);
    setPantiFotoPreview(null);
    if (pantiFotoInputRef.current) pantiFotoInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }
    // Validate required fields
    if (!formData.managerName || !formData.pantiName || !formData.email || !formData.phone || !formData.address || !formData.password || !formData.confirmPassword) {
      setError("Semua bidang wajib diisi.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Upload dokumen ke Appwrite Storage
      let dokumenKTPId: string | undefined;
      let dokumenSuratIzinId: string | undefined;
      let fotoPantiId: string | undefined;

      if (ktpFile) {
        const ktpResult = await uploadDokumenPanti(ktpFile);
        dokumenKTPId = ktpResult.$id;
      }
      if (suratFile) {
        const suratResult = await uploadDokumenPanti(suratFile);
        dokumenSuratIzinId = suratResult.$id;
      }
      if (pantiFotoFile) {
        const pantiFotoResult = await uploadDokumenPanti(pantiFotoFile);
        fotoPantiId = pantiFotoResult.$id;
      }

      // Register panti
      await registerPanti({
        email: formData.email,
        password: formData.password,
        namaPanti: formData.pantiName,
        namaKetua: formData.managerName,
        alamat: formData.address,
        kota: "",
        provinsi: "",
        telepon: `+62${formData.phone}`,
        deskripsi: "",
        jumlahAnak: 0,
        dokumenKTP: dokumenKTPId,
        dokumenSuratIzin: dokumenSuratIzinId,
        fotoPanti: fotoPantiId,
      });

      navigate("/pending-verification");
    } catch (err) {
      setError(err instanceof Error ? err.message : getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl">Daftar Pengelola Panti</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Panti Logo Upload */}
          <div className="flex justify-center">
            <input 
              type="file"
              ref={pantiFotoInputRef}
              onChange={handleFotoPantiChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => pantiFotoInputRef.current?.click()}
              className="relative w-32 h-32 rounded-full bg-teal/10 border-2 border-dashed border-teal flex items-center justify-center hover:bg-teal/20 transition-colors overflow-hidden group"
            >
              {pantiFotoPreview ? (
                <>
                  <img src={pantiFotoPreview} alt="Preview Logo Panti" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={handleRemoveFotoPanti}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </>
              ) : (
                <>
                  <Camera className="w-8 h-8 text-teal animate-pulse" />
                  <div className="absolute bottom-2 bg-white/85 px-2 py-0.5 rounded-full text-[10px] text-foreground/60">
                    Logo Panti
                  </div>
                </>
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-foreground/70">
                Nama Pengelola
              </label>
              <input
                type="text"
                value={formData.managerName}
                onChange={(e) =>
                  setFormData({ ...formData, managerName: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground/70">
                Nama Panti
              </label>
              <input
                type="text"
                value={formData.pantiName}
                onChange={(e) =>
                  setFormData({ ...formData, pantiName: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground/70">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground/70">
                Nomor HP
              </label>
              <div className="flex gap-2">
                <div className="px-4 py-3 bg-muted border border-border rounded-xl text-foreground/60">
                  +62
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="flex-1 px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground/70">
                Alamat Panti
              </label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/50 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground/70">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-12 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground/70">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-12 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg">Dokumen Legalitas</h3>

            {/* KTP Upload */}
            {/* Hidden file input */}
            <input
              ref={ktpInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setKtpFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => ktpInputRef.current?.click()}
              className={`w-full p-6 border-2 border-dashed rounded-xl transition-all ${
                ktpFile
                  ? "border-teal bg-teal/5"
                  : "border-border hover:border-teal/50"
              }`}
            >
              <div className="flex items-center gap-4">
                {ktpFile ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-teal flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-foreground">Foto KTP Pengelola</p>
                      <p className="text-sm text-foreground/60">{ktpFile.name}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Upload className="w-6 h-6 text-foreground/60" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-foreground">Upload Foto KTP Pengelola</p>
                      <p className="text-sm text-foreground/60">Format: JPG, PNG (Max 5MB)</p>
                    </div>
                  </>
                )}
              </div>
            </button>

            {/* Surat Izin Upload */}
            <input
              ref={suratInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => setSuratFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => suratInputRef.current?.click()}
              className={`w-full p-6 border-2 border-dashed rounded-xl transition-all ${
                suratFile
                  ? "border-teal bg-teal/5"
                  : "border-border hover:border-teal/50"
              }`}
            >
              <div className="flex items-center gap-4">
                {suratFile ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-teal flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-foreground">Surat Izin Panti</p>
                      <p className="text-sm text-foreground/60">{suratFile.name}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Upload className="w-6 h-6 text-foreground/60" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-foreground">Upload Surat Izin Panti</p>
                      <p className="text-sm text-foreground/60">Format: PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 accent-teal"
              required
            />
            <label htmlFor="terms" className="text-sm text-foreground/70">
              Saya menyetujui{" "}
              <button type="button" className="text-teal hover:underline">
                Syarat & Ketentuan
              </button>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!agreedToTerms || !ktpFile || !suratFile || isLoading}
            className="w-full py-3 bg-teal text-white rounded-full hover:bg-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Mengajukan..." : "Ajukan Pendaftaran"}
          </button>
        </form>
      </div>
    </div>
  );
}
