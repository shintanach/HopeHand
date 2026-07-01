import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Camera, Eye, EyeOff, AlertCircle } from "lucide-react";
import { registerRelawan, getAuthErrorMessage } from "@/imports/appwrite/auth";

export default function RegisterRelawanScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await registerRelawan({
        nama: formData.fullName,
        email: formData.email,
        password: formData.password,
        telepon: `+62${formData.phone}`,
        alamat: formData.city,
      });
      navigate("/email-verification");
    } catch (err) {
      setError(getAuthErrorMessage(err));
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
          <h1 className="text-2xl">Buat Akun</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo Upload */}
          <div className="flex justify-center">
            <button
              type="button"
              className="relative w-32 h-32 rounded-full bg-coral/10 border-2 border-dashed border-coral flex items-center justify-center hover:bg-coral/20 transition-colors"
            >
              <Camera className="w-8 h-8 text-coral" />
              <div className="absolute -bottom-2 bg-white px-3 py-1 rounded-full text-xs text-foreground/60">
                Opsional
              </div>
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
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50"
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
                className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50"
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
                  className="flex-1 px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground/70">
                Kota/Domisili
              </label>
              <select
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50"
                required
              >
                <option value="">Pilih Kota</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Bandung">Bandung</option>
                <option value="Surabaya">Surabaya</option>
                <option value="Yogyakarta">Yogyakarta</option>
                <option value="Semarang">Semarang</option>
              </select>
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
                  className="w-full px-4 py-3 pr-12 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50"
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
                  className="w-full px-4 py-3 pr-12 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50"
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

          {/* Terms & Conditions */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 accent-coral"
              required
            />
            <label htmlFor="terms" className="text-sm text-foreground/70">
              Saya menyetujui{" "}
              <button type="button" className="text-coral hover:underline">
                Syarat & Ketentuan
              </button>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!agreedToTerms || isLoading}
            className="w-full py-3 bg-coral text-white rounded-full hover:bg-coral/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Mendaftarkan..." : "Daftar Sekarang"}
          </button>
        </form>
      </div>
    </div>
  );
}
