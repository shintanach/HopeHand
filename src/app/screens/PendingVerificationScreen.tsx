import { useNavigate } from "react-router";
import { FileText, Clock, CheckCircle, Mail } from "lucide-react";
import { motion } from "motion/react";

export default function PendingVerificationScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-8"
      >
        {/* Illustration */}
        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-teal/20 to-teal/10 flex items-center justify-center">
          <FileText className="w-16 h-16 text-teal" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl">Pendaftaran Sedang Diverifikasi</h1>
          <p className="text-foreground/70">
            Tim kami akan memverifikasi dokumen pantumu dalam 1-3 hari kerja.
            Kamu akan mendapat notifikasi email setelah disetujui.
          </p>
        </div>

        {/* Status Stepper */}
        <div className="space-y-4">
          {/* Step 1 - Completed */}
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-full bg-teal flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-foreground">Dokumen Dikirim</p>
              <p className="text-sm text-foreground/60">Berhasil diterima</p>
            </div>
          </div>

          {/* Connector */}
          <div className="ml-6 w-0.5 h-8 bg-teal/30" />

          {/* Step 2 - Active */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 rounded-full bg-teal/20 border-2 border-teal flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-teal" />
            </div>
            <div>
              <p className="text-foreground">Sedang Diverifikasi</p>
              <p className="text-sm text-foreground/60">
                Proses verifikasi berlangsung
              </p>
            </div>
          </motion.div>

          {/* Connector */}
          <div className="ml-6 w-0.5 h-8 bg-border" />

          {/* Step 3 - Pending */}
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 text-foreground/30" />
            </div>
            <div>
              <p className="text-foreground/50">Akun Aktif</p>
              <p className="text-sm text-foreground/40">Menunggu persetujuan</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => {
              window.location.href = "mailto:admin@hopehand.id";
            }}
            className="w-full py-3 bg-teal text-white rounded-full hover:bg-teal/90 transition-colors flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Hubungi Admin
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 text-foreground/70 hover:text-foreground transition-colors"
          >
            Kembali ke Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
