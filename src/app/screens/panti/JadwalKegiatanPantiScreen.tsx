import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Home,
  Calendar,
  Package,
  BarChart3,
  User,
  LayoutList,
  Plus,
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const activities = [
  {
    id: 1,
    title: "Mengajar Matematika Kelas 5",
    category: "Mengajar",
    date: "2026-07-15",
    timeStart: "14:00",
    timeEnd: "16:00",
    location: "Aula Panti",
    registered: 7,
    quota: 10,
    status: "Aktif",
  },
  {
    id: 2,
    title: "Main & Dongeng Bersama Anak",
    category: "Bermain",
    date: "2026-07-18",
    timeStart: "09:00",
    timeEnd: "12:00",
    location: "Halaman Panti",
    registered: 15,
    quota: 15,
    status: "Penuh",
  },
  {
    id: 3,
    title: "Workshop Kerajinan Tangan",
    category: "Keterampilan",
    date: "2026-07-20",
    timeStart: "13:00",
    timeEnd: "15:00",
    location: "Ruang Kelas",
    registered: 8,
    quota: 10,
    status: "Aktif",
  },
  {
    id: 4,
    title: "Senam Pagi Bersama",
    category: "Olahraga",
    date: "2026-07-22",
    timeStart: "07:00",
    timeEnd: "08:30",
    location: "Lapangan",
    registered: 12,
    quota: 12,
    status: "Selesai",
  },
  {
    id: 5,
    title: "Belajar Menggambar",
    category: "Keterampilan",
    date: "2026-07-25",
    timeStart: "15:00",
    timeEnd: "17:00",
    location: "Aula Panti",
    registered: 3,
    quota: 10,
    status: "Dibatalkan",
  },
];

const activityDates = activities.map((a) => a.date);

const statusStyle: Record<string, string> = {
  Aktif: "bg-green-100 text-green-700",
  Penuh: "bg-yellow-100 text-yellow-700",
  Selesai: "bg-gray-100 text-gray-600",
  Dibatalkan: "bg-red-100 text-red-700",
};

const categoryStyle: Record<string, string> = {
  Mengajar: "bg-blue-100 text-blue-700",
  Bermain: "bg-teal/10 text-teal",
  Keterampilan: "bg-purple-100 text-purple-700",
  Olahraga: "bg-orange-100 text-orange-700",
  Lainnya: "bg-gray-100 text-gray-600",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function JadwalKegiatanPantiScreen() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const monthName = new Date(calYear, calMonth, 1).toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const filteredActivities = selectedDate
    ? activities.filter((a) => a.date === selectedDate)
    : activities;

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#6D5A4F]">Jadwal Kegiatan</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("calendar")}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                viewMode === "calendar"
                  ? "bg-teal text-white"
                  : "bg-white text-[#6D5A4F]"
              }`}
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                viewMode === "list"
                  ? "bg-teal text-white"
                  : "bg-white text-[#6D5A4F]"
              }`}
            >
              <LayoutList className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {viewMode === "calendar" && (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <ChevronLeft className="w-5 h-5 text-[#6D5A4F]" />
              </button>
              <span className="font-bold text-[#6D5A4F] capitalize">{monthName}</span>
              <button onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-[#6D5A4F]" />
              </button>
            </div>
            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs text-[#6D5A4F]/60 font-semibold py-1">
                  {d}
                </div>
              ))}
            </div>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const hasActivity = activityDates.includes(dateStr);
                const isSelected = selectedDate === dateStr;
                return (
                  <button
                    key={day}
                    onClick={() =>
                      setSelectedDate(isSelected ? null : dateStr)
                    }
                    className={`relative flex flex-col items-center justify-center rounded-full w-9 h-9 mx-auto text-sm transition-colors ${
                      isSelected
                        ? "bg-teal text-white"
                        : "hover:bg-teal/10 text-[#6D5A4F]"
                    }`}
                  >
                    {day}
                    {hasActivity && (
                      <span
                        className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                          isSelected ? "bg-white" : "bg-teal"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Activity List */}
        {(viewMode === "list" || selectedDate) && (
          <div className="space-y-3">
            {selectedDate && (
              <p className="text-sm text-[#6D5A4F]/60">
                {filteredActivities.length === 0
                  ? "Tidak ada kegiatan pada tanggal ini"
                  : `${filteredActivities.length} kegiatan`}
              </p>
            )}
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/panti/kegiatan/1`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      categoryStyle[activity.category] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {activity.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[activity.status]}`}
                  >
                    {activity.status}
                  </span>
                </div>
                <h3 className="font-bold text-[#6D5A4F] mb-2">{activity.title}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-[#6D5A4F]/60 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(activity.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {activity.timeStart} - {activity.timeEnd}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {activity.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal" />
                  <span className="text-sm text-[#6D5A4F]">
                    {activity.registered}/{activity.quota} relawan
                  </span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden ml-2">
                    <div
                      className="h-full bg-teal rounded-full"
                      style={{ width: `${(activity.registered / activity.quota) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => navigate("/panti/tambah-kegiatan")}
        className="fixed bottom-24 right-6 w-14 h-14 bg-teal text-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal/90 transition-colors z-10"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-around">
          <button onClick={() => navigate("/panti/home")} className="flex flex-col items-center gap-1 text-[#6D5A4F]/60 hover:text-[#6D5A4F]">
            <Home className="w-6 h-6" />
            <span className="text-xs">Beranda</span>
          </button>
          <button onClick={() => navigate("/panti/kegiatan")} className="flex flex-col items-center gap-1 text-teal">
            <Calendar className="w-6 h-6 fill-teal/20" />
            <span className="text-xs font-semibold">Kegiatan</span>
          </button>
          <button onClick={() => navigate("/panti/donasi")} className="flex flex-col items-center gap-1 text-[#6D5A4F]/60 hover:text-[#6D5A4F]">
            <Package className="w-6 h-6" />
            <span className="text-xs">Donasi</span>
          </button>
          <button onClick={() => navigate("/panti/laporan")} className="flex flex-col items-center gap-1 text-[#6D5A4F]/60 hover:text-[#6D5A4F]">
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Laporan</span>
          </button>
          <button onClick={() => navigate("/panti/profil")} className="flex flex-col items-center gap-1 text-[#6D5A4F]/60 hover:text-[#6D5A4F]">
            <User className="w-6 h-6" />
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
