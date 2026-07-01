import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Pencil, MapPin, Clock, Calendar, Users, Phone, Download, X } from "lucide-react";

const volunteers = [
  { id: 1, name: "Budi Santoso", initials: "BS", phone: "081234567890", status: "registered" },
  { id: 2, name: "Siti Aminah", initials: "SA", phone: "082345678901", status: "registered" },
  { id: 3, name: "Joko Widodo", initials: "JW", phone: "083456789012", status: "registered" },
  { id: 4, name: "Dewi Lestari", initials: "DL", phone: "084567890123", status: "hadir" },
  { id: 5, name: "Ahmad Yani", initials: "AY", phone: "085678901234", status: "hadir" },
  { id: 6, name: "Rina Kartika", initials: "RK", phone: "086789012345", status: "tidak_hadir" },
];

export default function ActivityManagementDetailScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"terdaftar" | "hadir" | "tidak_hadir">("terdaftar");
  const [volStatuses, setVolStatuses] = useState<Record<number, string>>(
    Object.fromEntries(volunteers.map((v) => [v.id, v.status]))
  );
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const updateStatus = (id: number, status: string) => {
    setVolStatuses((s) => ({ ...s, [id]: status }));
    setExpandedId(null);
    toast.success("Status diperbarui");
  };

  const hadir = Object.values(volStatuses).filter((s) => s === "hadir").length;
  const total = volunteers.length;

  const tabVolunteers = volunteers.filter((v) => {
    const s = volStatuses[v.id];
    if (activeTab === "terdaftar") return s === "registered";
    if (activeTab === "hadir") return s === "hadir";
    return s === "tidak_hadir";
  });

  const tabCounts = {
    terdaftar: volunteers.filter((v) => volStatuses[v.id] === "registered").length,
    hadir: volunteers.filter((v) => volStatuses[v.id] === "hadir").length,
    tidak_hadir: volunteers.filter((v) => volStatuses[v.id] === "tidak_hadir").length,
  };

  const markAllHadir = () => {
    const updated: Record<number, string> = {};
    volunteers.forEach((v) => { updated[v.id] = "hadir"; });
    setVolStatuses(updated);
    toast.success("Semua relawan ditandai hadir");
  };

  return (
    <div className="min-h-screen bg-cream pb-8">
      {/* Header */}
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full hover:bg-white flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-[#6D5A4F]" />
          </button>
          <h1 className="text-base font-bold text-[#6D5A4F] flex-1 mx-4 truncate">Mengajar Matematika Kelas 5</h1>
          <button
            onClick={() => navigate("/panti/tambah-kegiatan")}
            className="w-9 h-9 rounded-full hover:bg-white flex items-center justify-center"
          >
            <Pencil className="w-5 h-5 text-teal" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {/* Activity Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Mengajar</span>
          <p className="text-sm text-[#6D5A4F]/70">Kegiatan mengajar matematika untuk anak kelas 5 panti asuhan.</p>
          <div className="flex flex-wrap gap-3 text-sm text-[#6D5A4F]/60">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />15 Juli 2026</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />14:00 - 16:00</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />Aula Panti</span>
          </div>
          {/* Progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-[#6D5A4F]"><Users className="w-4 h-4 text-teal" />{hadir}/{total} relawan hadir</span>
              <span className="text-teal font-semibold">{Math.round((hadir / total) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal rounded-full transition-all" style={{ width: `${(hadir / total) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl shadow-sm p-1">
          {(["terdaftar", "hadir", "tidak_hadir"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab ? "bg-teal text-white" : "text-[#6D5A4F]/60 hover:text-[#6D5A4F]"
              }`}
            >
              {tab === "terdaftar" ? "Terdaftar" : tab === "hadir" ? "Hadir" : "Tidak Hadir"}
              <span className="ml-1 text-xs">({tabCounts[tab]})</span>
            </button>
          ))}
        </div>

        {/* Volunteer List */}
        <div className="space-y-3">
          {tabVolunteers.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-[#6D5A4F]/50 text-sm">
              Tidak ada data
            </div>
          ) : (
            tabVolunteers.map((vol) => (
              <div key={vol.id} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center text-teal font-bold text-sm shrink-0">
                    {vol.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#6D5A4F] text-sm">{vol.name}</p>
                    <p className="text-xs text-[#6D5A4F]/60">{vol.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={`tel:${vol.phone}`} className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-teal" />
                    </a>
                    {activeTab === "terdaftar" && (
                      <button
                        onClick={() => setExpandedId(expandedId === vol.id ? null : vol.id)}
                        className="text-xs text-teal border border-teal rounded-full px-3 py-1"
                      >
                        Aksi
                      </button>
                    )}
                  </div>
                </div>
                {/* Action Buttons */}
                {activeTab === "terdaftar" && expandedId === vol.id && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => updateStatus(vol.id, "hadir")}
                      className="flex-1 py-2 bg-green-100 text-green-700 rounded-full text-xs font-semibold hover:bg-green-200"
                    >
                      Hadir
                    </button>
                    <button
                      onClick={() => updateStatus(vol.id, "tidak_hadir")}
                      className="flex-1 py-2 bg-red-100 text-red-700 rounded-full text-xs font-semibold hover:bg-red-200"
                    >
                      Tidak Hadir
                    </button>
                    <button
                      onClick={() => updateStatus(vol.id, "ditolak")}
                      className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold hover:bg-gray-200"
                    >
                      Tolak
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Tab-specific actions */}
        {activeTab === "terdaftar" && tabCounts.terdaftar > 0 && (
          <button
            onClick={markAllHadir}
            className="w-full bg-teal text-white rounded-full px-6 py-3 font-semibold hover:bg-teal/90 transition-colors"
          >
            Tandai Semua Hadir
          </button>
        )}
        {activeTab === "hadir" && tabCounts.hadir > 0 && (
          <button
            onClick={() => toast.success("File daftar hadir diunduh")}
            className="w-full flex items-center justify-center gap-2 bg-white border border-teal text-teal rounded-full px-6 py-3 font-semibold hover:bg-teal/5 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Daftar Hadir
          </button>
        )}

        {/* Cancel Button */}
        <button
          onClick={() => setShowCancelDialog(true)}
          className="w-full text-red-500 text-sm font-semibold py-3 hover:text-red-700"
        >
          Batalkan Kegiatan
        </button>
      </div>

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-[#6D5A4F]">Batalkan Kegiatan</h3>
              <button onClick={() => setShowCancelDialog(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-[#6D5A4F]/70 mb-5">Yakin batalkan kegiatan ini? Seluruh relawan yang terdaftar akan diberitahu.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 py-3 border border-gray-200 rounded-full text-sm font-semibold text-[#6D5A4F] hover:bg-gray-50"
              >
                Tidak
              </button>
              <button
                onClick={() => {
                  setShowCancelDialog(false);
                  toast.error("Kegiatan dibatalkan");
                  navigate("/panti/kegiatan");
                }}
                className="flex-1 py-3 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
