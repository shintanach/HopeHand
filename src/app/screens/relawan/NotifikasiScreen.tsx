import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Bell, Calendar, Heart, MessageSquare } from "lucide-react";
import { getCurrentUser } from "@/imports/appwrite/auth";
import { notifikasiDB } from "@/imports/appwrite/database";
import type { NotifikasiDocument } from "@/imports/appwrite/types";

export default function NotifikasiScreen() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotifikasiDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const userData = await getCurrentUser();
        if (!userData) return;
        const uid = userData.authUser.$id;
        
        const res = await notifikasiDB.listByUser(uid);
        setNotifications(res.documents);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "kegiatan":
        return <Calendar className="w-6 h-6 text-coral" />;
      case "donasi":
        return <Heart className="w-6 h-6 text-teal" />;
      default:
        return <MessageSquare className="w-6 h-6 text-foreground/60" />;
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-20">
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl">Notifikasi</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <Bell className="w-12 h-12 mx-auto text-foreground/20 mb-3" />
            <p className="text-foreground/60 text-sm">Belum ada notifikasi saat ini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.$id} className={`bg-white rounded-2xl p-4 hover:shadow-lg transition-shadow flex gap-4 items-start ${!notif.sudahDibaca ? "border-l-4 border-coral" : ""}`}>
                <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center shrink-0">
                  {getIcon(notif.tipe || "")}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-foreground">{notif.judul}</p>
                  <p className="text-sm text-foreground/75">{notif.pesan}</p>
                  <p className="text-xs text-foreground/50">{formatDate(notif.$createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
