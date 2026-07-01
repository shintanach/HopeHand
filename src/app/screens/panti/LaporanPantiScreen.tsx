import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Home, Calendar, Package, BarChart3, User,
  Download, Share2, X, Upload, ChevronDown
} from "lucide-react";

const periods = ["Bulan ini", "3 Bulan", "6 Bulan", "Custom range"];

const summaryCards = [
  { label: "Total Kegiatan", value: "12", icon: Calendar },
  { label: "Total Relawan", value: "87", icon: User },
  { label: "Donasi Barang", value: "34", icon: Package },
  { label: "Total Dana", value: "Rp 25 Jt", icon: BarChart3 },
];

const kegiatanData = [
  { month: "April 2026", count: 3, bar: 60 },
  { month: "Mei 2026", count: 4, bar: 80 },
  { month: "Juni 2026", count: 5, bar: 100 },
];

const donasiBarangData = [
  { month: "April 2026", count: 8, bar: 40 },
  { month: "Mei 2026", count: 12, bar: 60 },
  { month: "Juni 2026", count: 14, bar: 70 },
];

const donasiUangData = [
  { month: "April 2026", amount: "Rp 7 Jt", bar: 50 },
  { month: "Mei 2026", amount: "Rp 9 Jt", bar: 65 },
  { month: "Juni 2026", amount: "Rp 9 Jt", bar: 65 },
];

export default function LaporanPantiScreen() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("Bulan ini");
  const [activeTab, setActiveTab] = useState<"kegiatan" | "barang" | "uang">("kegiatan");
  const [generating, setGenerating] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [publishOn, setPublishOn] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  const generateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowReport(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-xl font-bold text-[#6D5A4F]">Laporan</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-5">
        {/* Period Filter */}
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#6D5A4F] focus:outline-none focus:ring-2 focus:ring-teal pr-10"
          >
            {periods.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D5A4F]/60 pointer-events-none" />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          {summaryCards.map((c) => (
            <div key={c.label} className="bg-white rounded-2xl shadow-sm p-4">
              <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center mb-3">
                <c.icon className="w-5 h-5 text-teal" />
              </div>
              <p className="text-2xl font-bold text-teal">{c.value}</p>
              <p className="text-xs text-[#6D5A4F]/60 mt-1">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl shadow-sm p-1">
          {(["kegiatan", "barang", "uang"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === tab ? "bg-teal text-white" : "text-[#6D5A4F]/60"
              }`}
            >
              {tab === "kegiatan" ? "Kegiatan" : tab === "barang" ? "Donasi Barang" : "Donasi Uang"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-3">
          {activeTab === "kegiatan" &&
            kegiatanData.map((d) => (
              <div key={d.month} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#6D5A4F]">{d.month}</span>
                  <span className="text-sm text-teal font-bold">{d.count} kegiatan</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal rounded-full" style={{ width: `${d.bar}%` }} />
                </div>
              </div>
            ))}
          {activeTab === "barang" &&
            donasiBarangData.map((d) => (
              <div key={d.month} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#6D5A4F]">{d.month}</span>
                  <span className="text-sm text-teal font-bold">{d.count} item</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal rounded-full" style={{ width: `${d.bar}%` }} />
                </div>
              </div>
            ))}
          {activeTab === "uang" &&
            donasiUangData.map((d) => (
              <div key={d.month} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#6D5A4F]">{d.month}</span>
                  <span className="text-sm text-teal font-bold">{d.amount}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal rounded-full" style={{ width: `${d.bar}%` }} />
                </div>
              </div>
            ))}
        </div>

        {/* Action Buttons */}
        <button
          onClick={generateReport}
          disabled={generating}
          className="w-full bg-teal text-white rounded-full px-6 py-3 font-semibold hover:bg-teal/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {generating ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Membuat Laporan...</>
          ) : "Buat Laporan Otomatis"}
        </button>

        <button
          onClick={() => setShowDocs(true)}
          className="w-full bg-white border border-teal text-teal rounded-full px-6 py-3 font-semibold hover:bg-teal/5 transition-colors flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload Dokumentasi
        </button>

        {showDocs && (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`rounded-2xl aspect-square flex items-center justify-center text-white text-sm font-semibold ${i % 2 === 0 ? "bg-teal" : "bg-teal/60"}`}>
                Foto {i}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#6D5A4F] text-lg">Preview Laporan</h3>
              <button onClick={() => setShowReport(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="bg-teal/10 rounded-2xl p-4 space-y-2">
              <p className="text-sm font-semibold text-[#6D5A4F]">Ringkasan {period}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-[#6D5A4F]/60">Kegiatan</span><br /><span className="font-bold text-teal">12</span></div>
                <div><span className="text-[#6D5A4F]/60">Relawan</span><br /><span className="font-bold text-teal">87</span></div>
                <div><span className="text-[#6D5A4F]/60">Donasi Barang</span><br /><span className="font-bold text-teal">34 item</span></div>
                <div><span className="text-[#6D5A4F]/60">Total Dana</span><br /><span className="font-bold text-teal">Rp 25 Jt</span></div>
              </div>
            </div>
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3">
              <span className="text-sm text-[#6D5A4F] font-medium">Publikasikan ke Publik</span>
              <button
                onClick={() => setPublishOn((v) => !v)}
                className={`w-12 h-6 rounded-full transition-colors relative ${publishOn ? "bg-teal" : "bg-gray-200"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${publishOn ? "left-6" : "left-0.5"}`} />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { toast.success("File berhasil diunduh"); setShowReport(false); }}
                className="flex-1 flex items-center justify-center gap-2 bg-teal text-white rounded-full py-3 text-sm font-semibold hover:bg-teal/90"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={() => { toast.success("Laporan dibagikan"); setShowReport(false); }}
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-teal text-teal rounded-full py-3 text-sm font-semibold hover:bg-teal/5"
              >
                <Share2 className="w-4 h-4" />
                Bagikan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-around">
          <button onClick={() => navigate("/panti/home")} className="flex flex-col items-center gap-1 text-[#6D5A4F]/60">
            <Home className="w-6 h-6" />
            <span className="text-xs">Beranda</span>
          </button>
          <button onClick={() => navigate("/panti/kegiatan")} className="flex flex-col items-center gap-1 text-[#6D5A4F]/60">
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Kegiatan</span>
          </button>
          <button onClick={() => navigate("/panti/donasi")} className="flex flex-col items-center gap-1 text-[#6D5A4F]/60">
            <Package className="w-6 h-6" />
            <span className="text-xs">Donasi</span>
          </button>
          <button onClick={() => navigate("/panti/laporan")} className="flex flex-col items-center gap-1 text-teal">
            <BarChart3 className="w-6 h-6 fill-teal/20" />
            <span className="text-xs font-semibold">Laporan</span>
          </button>
          <button onClick={() => navigate("/panti/profil")} className="flex flex-col items-center gap-1 text-[#6D5A4F]/60">
            <User className="w-6 h-6" />
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
