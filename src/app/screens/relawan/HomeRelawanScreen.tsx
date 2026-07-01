import { useNavigate } from "react-router";
import { Bell, User, Heart, Package, DollarSign, Calendar, MapPin, Clock, Bookmark, Home } from "lucide-react";
import logoImg from "../../../imports/Removal-3.png";

// Mock data
const urgentNeeds = [
  {
    id: 1,
    pantiName: "Panti Asuhan Harapan Bangsa",
    itemName: "Sepatu Sekolah Ukuran 36-40",
    progress: 65,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
  },
  {
    id: 2,
    pantiName: "Panti Sosial Kasih Sayang",
    itemName: "Kampanye Renovasi Ruang Belajar",
    progress: 42,
    image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400",
  },
  {
    id: 3,
    pantiName: "Panti Asuhan Bina Sejahtera",
    itemName: "Buku Pelajaran SD Kelas 4-6",
    progress: 78,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
  },
];

const upcomingActivities = [
  {
    id: 1,
    category: "Mengajar",
    title: "Mengajar Matematika Kelas 5",
    pantiName: "Panti Asuhan Harapan Bangsa",
    date: "15 Juli 2026",
    time: "14:00 - 16:00",
    location: "Jakarta Selatan",
    slotsLeft: 3,
    categoryColor: "bg-coral/10 text-coral",
  },
  {
    id: 2,
    category: "Bermain",
    title: "Main & Dongeng Bersama Anak",
    pantiName: "Panti Sosial Kasih Sayang",
    date: "18 Juli 2026",
    time: "09:00 - 12:00",
    location: "Bandung",
    slotsLeft: 5,
    categoryColor: "bg-teal/10 text-teal",
  },
  {
    id: 3,
    category: "Keterampilan",
    title: "Workshop Kerajinan Tangan",
    pantiName: "Panti Asuhan Bina Sejahtera",
    date: "20 Juli 2026",
    time: "13:00 - 15:00",
    location: "Jakarta Timur",
    slotsLeft: 0,
    categoryColor: "bg-lavender/10 text-lavender",
  },
];

export default function HomeRelawanScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/relawan/profil")} className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center">
            <User className="w-6 h-6 text-coral" />
          </button>
          
          <img src={logoImg} alt="Hope Hand" className="h-10 object-contain" />
          
          <button 
            onClick={() => navigate("/relawan/notifikasi")}
            className="relative w-10 h-10 rounded-full hover:bg-white transition-colors flex items-center justify-center"
          >
            <Bell className="w-6 h-6 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-8">
        {/* Greeting Card */}
        <div className="bg-gradient-to-r from-coral to-coral-light rounded-2xl p-6 text-white">
          <h2 className="text-2xl mb-1">Halo, Budi 👋</h2>
          <p className="text-white/90">Mau berbuat baik hari ini?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          <button className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 mx-auto rounded-full bg-coral/10 group-hover:bg-coral/20 transition-colors flex items-center justify-center mb-3">
              <User className="w-6 h-6 text-coral" />
            </div>
            <p className="text-sm text-center text-foreground">Volunteer</p>
          </button>

          <button className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 mx-auto rounded-full bg-coral/10 group-hover:bg-coral/20 transition-colors flex items-center justify-center mb-3">
              <Package className="w-6 h-6 text-coral" />
            </div>
            <p className="text-sm text-center text-foreground">Donasi Barang</p>
          </button>

          <button className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 mx-auto rounded-full bg-coral/10 group-hover:bg-coral/20 transition-colors flex items-center justify-center mb-3">
              <DollarSign className="w-6 h-6 text-coral" />
            </div>
            <p className="text-sm text-center text-foreground">Donasi Uang</p>
          </button>
        </div>

        {/* Kebutuhan Mendesak */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">Kebutuhan Mendesak</h3>
            <button className="text-coral hover:underline text-sm">
              Lihat Semua
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {urgentNeeds.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden min-w-[280px] hover:shadow-lg transition-shadow"
              >
                <img
                  src={item.image}
                  alt={item.itemName}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 space-y-3">
                  <p className="text-sm text-foreground/60">{item.pantiName}</p>
                  <p className="text-foreground line-clamp-2">
                    {item.itemName}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-coral rounded-full transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-foreground/60">
                      {item.progress}% terpenuhi
                    </p>
                  </div>

                  <button className="w-full py-2 bg-coral text-white rounded-full hover:bg-coral/90 transition-colors text-sm">
                    Bantu Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jadwal Kegiatan Terdekat */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">Jadwal Kegiatan Terdekat</h3>
            <button className="text-coral hover:underline text-sm">
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {upcomingActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-2xl p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs ${activity.categoryColor}`}
                    >
                      {activity.category}
                    </span>
                    <p className="text-foreground">{activity.title}</p>
                    <p className="text-sm text-foreground/60">
                      {activity.pantiName}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm text-foreground/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {activity.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {activity.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {activity.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {activity.slotsLeft > 0 ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          {activity.slotsLeft} slot tersisa
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-muted text-foreground/60 rounded-full text-xs">
                          Penuh
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    disabled={activity.slotsLeft === 0}
                    className={`px-6 py-2 h-fit rounded-full text-sm transition-colors ${
                      activity.slotsLeft > 0
                        ? "bg-coral text-white hover:bg-coral/90"
                        : "bg-muted text-foreground/40 cursor-not-allowed"
                    }`}
                  >
                    {activity.slotsLeft > 0 ? "Daftar" : "Penuh"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panti yang Kamu Ikuti */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">Panti yang Kamu Ikuti</h3>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                className="flex flex-col items-center gap-2 min-w-[80px]"
              >
                <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center">
                  <Home className="w-8 h-8 text-coral" />
                </div>
                <p className="text-xs text-center text-foreground/70">
                  Panti {i}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-coral">
            <Heart className="w-6 h-6 fill-coral" />
            <span className="text-xs">Beranda</span>
          </button>
          
          <button 
            onClick={() => navigate("/relawan/explore")}
            className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground"
          >
            <Bookmark className="w-6 h-6" />
            <span className="text-xs">Explore</span>
          </button>
          
          <button 
            onClick={() => navigate("/relawan/riwayat")}
            className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground"
          >
            <Clock className="w-6 h-6" />
            <span className="text-xs">Riwayat</span>
          </button>
          
          <button 
            onClick={() => navigate("/relawan/profil")}
            className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
