import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import AdminBottomNav from "./AdminBottomNav";

type DateRange = "bulanIni" | "3bulan" | "6bulan" | "tahunIni";

const barData = [
  { bulan: "Jan", donasi: 18500000 },
  { bulan: "Feb", donasi: 22000000 },
  { bulan: "Mar", donasi: 15000000 },
  { bulan: "Apr", donasi: 31000000 },
  { bulan: "Mei", donasi: 27500000 },
  { bulan: "Jun", donasi: 25500000 },
];

const pieData = [
  { name: "Pakaian", value: 35 },
  { name: "Alat Tulis", value: 25 },
  { name: "Sembako", value: 20 },
  { name: "Furnitur", value: 12 },
  { name: "Lainnya", value: 8 },
];

const PIE_COLORS = ["#FF7F7F", "#6ECDB1", "#B4A7E7", "#F59E0B", "#FFB6C1"];

const topPanti = [
  { rank: 1, name: "Panti Asuhan Cahaya Harapan", kegiatan: 24, donasi: "Rp 12,5 Jt" },
  { rank: 2, name: "Rumah Asuh Sejahtera", kegiatan: 19, donasi: "Rp 9,8 Jt" },
  { rank: 3, name: "Panti Sosial Bina Anak", kegiatan: 15, donasi: "Rp 7,2 Jt" },
];

const rankColors: Record<number, { bg: string; text: string }> = {
  1: { bg: "#FEF3C7", text: "#D97706" },
  2: { bg: "#F3F4F6", text: "#6B7280" },
  3: { bg: "#FEF2E8", text: "#B45309" },
};

function formatRupiah(val: number) {
  if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)} Jt`;
  return `Rp ${val.toLocaleString("id-ID")}`;
}

export default function LaporanAdminScreen() {
  const [dateRange, setDateRange] = useState<DateRange>("bulanIni");
  const [showExportSheet, setShowExportSheet] = useState(false);

  const dateRanges: { id: DateRange; label: string }[] = [
    { id: "bulanIni", label: "Bulan Ini" },
    { id: "3bulan", label: "3 Bulan" },
    { id: "6bulan", label: "6 Bulan" },
    { id: "tahunIni", label: "Tahun Ini" },
  ];

  function handleExport(format: "PDF" | "CSV") {
    setShowExportSheet(false);
    toast.success(`File ${format} berhasil diunduh`);
  }

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-border/50 px-5 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: "#6D5A4F" }}>Laporan</h1>
        <button
          onClick={() => setShowExportSheet(true)}
          className="flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: "#B4A7E7" }}
        >
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Date Range Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {dateRanges.map((r) => (
            <button
              key={r.id}
              onClick={() => setDateRange(r.id)}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: dateRange === r.id ? "#B4A7E7" : "#F5EDE8",
                color: dateRange === r.id ? "white" : "#6D5A4F",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Metrics 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total Donasi Uang", value: "Rp 139,5 Jt", icon: "💰" },
            { label: "Total Transaksi", value: "1.248", icon: "📋" },
            { label: "Total Donasi Barang", value: "342 item", icon: "📦" },
            { label: "Total Jam Volunteer", value: "2.840 jam", icon: "⏰" },
          ].map((m) => (
            <div key={m.label} className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xl mb-1">{m.icon}</p>
              <p className="font-bold text-base" style={{ color: "#B4A7E7" }}>{m.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Top Panti */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold mb-3" style={{ color: "#6D5A4F" }}>Panti Paling Aktif</p>
          <div className="space-y-3">
            {topPanti.map((p) => (
              <div key={p.rank} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: rankColors[p.rank].bg, color: rankColors[p.rank].text }}
                >
                  #{p.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "#6D5A4F" }}>{p.name}</p>
                  <p className="text-xs text-gray-400">{p.kegiatan} kegiatan · {p.donasi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold mb-4" style={{ color: "#6D5A4F" }}>Donasi Uang per Bulan</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5EDE8" />
              <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatRupiah(v)} width={60} />
              <Tooltip formatter={(value: number) => [formatRupiah(value), "Donasi"]} labelStyle={{ color: "#6D5A4F" }} />
              <Bar dataKey="donasi" fill="#B4A7E7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold mb-4" style={{ color: "#6D5A4F" }}>Kategori Donasi Barang</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ fontSize: 11, color: "#6D5A4F" }}>{value}</span>}
              />
              <Tooltip formatter={(value) => [`${value}%`, "Persentase"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Bottom Sheet */}
      {showExportSheet && (
        <div
          className="fixed inset-0 bg-black/40 z-40 flex items-end justify-center"
          onClick={() => setShowExportSheet(false)}
        >
          <div
            className="bg-white rounded-t-2xl w-full max-w-lg p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <p className="font-bold text-base mb-2" style={{ color: "#6D5A4F" }}>Export Data</p>
            <p className="text-sm text-gray-500 mb-4">
              Rentang: <span className="font-medium" style={{ color: "#B4A7E7" }}>
                {dateRanges.find((r) => r.id === dateRange)?.label}
              </span>
            </p>
            <div className="flex gap-3 mb-4">
              {(["PDF", "CSV"] as const).map((fmt) => (
                <button
                  key={fmt}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all"
                  style={{ borderColor: "#B4A7E7", color: "#B4A7E7" }}
                  onClick={() => handleExport(fmt)}
                >
                  📄 {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <AdminBottomNav active="laporan" />
    </div>
  );
}
