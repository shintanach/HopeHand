import { useEffect } from "react";
import { useNavigate } from "react-router";
import { clickTrackerDB } from "@/imports/appwrite/database";
import logoImg from "../../imports/Removal-3.png";

/**
 * Halaman yang dipanggil ketika seseorang klik link share dari admin.
 * - Catat klik ke database (1 klik per session)
 * - Redirect ke halaman utama /login
 */
export default function TrackRedirectScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const track = async () => {
      await clickTrackerDB.trackClick();
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    };
    void track();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-6">
      <div className="flex flex-col items-center gap-6">
        <img src={logoImg} alt="Hope Hand" className="w-32 h-32 object-contain" />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Hope Hand</h1>
          <p className="text-foreground/60">Satu Langkah, Seribu Harapan</p>
        </div>
        <div className="w-10 h-10 border-4 border-coral border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-foreground/50">Mengalihkan...</p>
      </div>
    </div>
  );
}
