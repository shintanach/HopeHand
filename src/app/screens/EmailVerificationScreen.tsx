import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Mail, RefreshCw, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { verifyEmail, resendVerification, getCurrentUser } from "@/imports/appwrite/auth";

export default function EmailVerificationScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Ambil email user yang sedang login
  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u?.authUser?.email) setUserEmail(u.authUser.email);
    });
  }, []);

  // Jika ada userId & secret di URL (dari klik link email) — proses verifikasi otomatis
  useEffect(() => {
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");
    if (userId && secret) {
      verifyEmail(userId, secret)
        .then(() => setIsVerified(true))
        .catch(console.error);
    }
  }, [searchParams]);

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendVerification();
    } catch (e) {
      console.error(e);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-6"
      >
        {/* Illustration */}
        <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
          isVerified
            ? "bg-gradient-to-br from-green-100 to-green-200"
            : "bg-gradient-to-br from-coral/20 to-coral-light/20"
        }`}>
          {isVerified
            ? <CheckCircle className="w-16 h-16 text-green-500" />
            : <Mail className="w-16 h-16 text-coral" />}
        </div>

        {isVerified ? (
          <>
            <div className="space-y-2">
              <h1 className="text-3xl">Email Terverifikasi!</h1>
              <p className="text-foreground/70">Akunmu sudah aktif. Silakan masuk.</p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-coral text-white rounded-full hover:bg-coral/90 transition-colors"
            >
              Masuk Sekarang
            </button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <h1 className="text-3xl">Cek Email Kamu!</h1>
              <p className="text-foreground/70">
                Kami telah mengirim link verifikasi ke{" "}
                <span className="text-coral">{userEmail ?? "emailmu"}</span>. Klik link
                tersebut untuk mengaktifkan akunmu.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => { window.location.href = "mailto:"; }}
                className="w-full py-3 bg-coral text-white rounded-full hover:bg-coral/90 transition-colors"
              >
                Buka Aplikasi Email
              </button>

              <button
                onClick={handleResend}
                disabled={isResending}
                className="w-full py-3 text-coral hover:underline flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />
                {isResending ? "Mengirim..." : "Kirim Ulang Email"}
              </button>

              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 text-foreground/70 hover:text-foreground transition-colors"
              >
                Sudah verifikasi? Masuk
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
