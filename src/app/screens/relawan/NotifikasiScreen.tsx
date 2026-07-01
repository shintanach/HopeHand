import { ArrowLeft, User, Package, DollarSign } from "lucide-react";
import { useNavigate } from "react-router";

const notifications = [
  {
    id: 1,
    icon: User,
    iconBg: "bg-coral/10",
    iconColor: "text-coral",
    title: "Pendaftaran Kegiatan Diterima",
    body: "Kamu berhasil terdaftar untuk kegiatan Mengajar Matematika Kelas 5",
    time: "2 jam lalu",
    unread: true,
  },
  {
    id: 2,
    icon: Package,
    iconBg: "bg-teal/10",
    iconColor: "text-teal",
    title: "Donasi Barang Diterima",
    body: "Sepatu sekolah yang kamu kirim telah diterima oleh Panti Asuhan Harapan Bangsa",
    time: "5 jam lalu",
    unread: true,
  },
  {
    id: 3,
    icon: DollarSign,
    iconBg: "bg-lavender/10",
    iconColor: "text-lavender",
    title: "Donasi Berhasil",
    body: "Terima kasih! Donasimu sebesar Rp 100.000 telah diterima",
    time: "Kemarin",
    unread: false,
  },
  {
    id: 4,
    icon: User,
    iconBg: "bg-coral/10",
    iconColor: "text-coral",
    title: "Reminder: Kegiatan Besok",
    body: "Jangan lupa kegiatan Main & Dongeng Bersama Anak besok jam 09:00",
    time: "2 hari lalu",
    unread: false,
  },
];

export default function NotifikasiScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl">Notifikasi</h1>
            </div>
            <button className="text-sm text-coral hover:underline">
              Tandai semua dibaca
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`rounded-2xl p-4 cursor-pointer hover:shadow-md transition-shadow ${
                  notif.unread
                    ? "bg-white border-l-4 border-coral"
                    : "bg-cream/50"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-12 h-12 rounded-full ${notif.iconBg} flex items-center justify-center shrink-0`}
                  >
                    <notif.icon className={`w-6 h-6 ${notif.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground mb-1">{notif.title}</p>
                    <p className="text-sm text-foreground/70 line-clamp-2">
                      {notif.body}
                    </p>
                    <p className="text-xs text-foreground/50 mt-2">
                      {notif.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-foreground/20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <p className="text-foreground/60">Belum ada notifikasi</p>
          </div>
        )}
      </div>
    </div>
  );
}
