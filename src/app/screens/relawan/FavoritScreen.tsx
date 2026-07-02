import { useNavigate } from "react-router";
import { ArrowLeft, Heart } from "lucide-react";

export default function FavoritScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream pb-20">
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl">Panti Favoritku</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-coral/10 flex items-center justify-center mb-4">
          <Heart className="w-10 h-10 text-coral" />
        </div>
        <h2 className="text-xl font-medium text-foreground mb-2">Belum ada panti favorit</h2>
        <p className="text-foreground/60 text-sm max-w-sm mx-auto">
          Panti asuhan yang Anda tandai sebagai favorit akan muncul di sini untuk memudahkan akses.
        </p>
      </div>
    </div>
  );
}
