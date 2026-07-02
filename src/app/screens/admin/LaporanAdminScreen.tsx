import { useState, useEffect } from "react";
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
import { donasiUangDB, donasiBarangDB, pantiDB, kegiatanDB } from "@/imports/appwrite/database";
import { Query } from "appwrite";

type DateRange = "bulanIni" | "3bulan" | "6bulan" | "tahunIni";

const PIE_COLORS = ["#FF7F7F", "#6ECDB1", "#B4A7E7", "#F59E0B", "#FFB6C1"];

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
  const [loading, setLoading] = useState(true);

  // States for real data
  const [metrics, setMetrics] = useState([
    { label: "Total Donasi Uang", value: "Rp 0", icon: "💰" },
    { label: "Total Transaksi", value: "0", icon: "📋" },
    { label: "Total Donasi Barang", value: "0 item", icon: "📦" },
    { label: "Total Jam Volunteer", value: "0 jam", icon: "⏰" },
  ]);
  const [topPanti, setTopPanti] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  const dateRanges: { id: DateRange; label: string }[] = [
    { id: "bulanIni", label: "Bulan Ini" },
    { id: "3bulan", label: "3 Bulan" },
    { id: "6bulan", label: "6 Bulan" },
    { id: "tahunIni", label: "Tahun Ini" },
  ];

  const loadLaporan = async () => {
    try {
      setLoading(true);
      const [uangRes, barangRes, pantiRes, kegiatanRes] = await Promise.all([
        donasiUangDB.listAll([Query.equal("status", "terkonfirmasi")]),
        donasiBarangDB.listAll([Query.equal("status", "diterima")]),
        pantiDB.listAll(),
        kegiatanDB.listAll(),
      ]);

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      // Filter by range helper
      const filterByRange = (items: any[]) => {
        return items.filter((item) => {
          const itemDate = new Date(item.$createdAt);
          const diffMs = now.getTime() - itemDate.getTime();
          const diffDays = diffMs / (1000 * 60 * 60 * 24);

          if (dateRange === "bulanIni") {
            return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
          }
          if (dateRange === "3bulan") return diffDays <= 90;
          if (dateRange === "6bulan") return diffDays <= 180;
          return itemDate.getFullYear() === currentYear; // tahun ini
        });
      };

      const filteredUang = filterByRange(uangRes.documents);
      const filteredBarang = filterByRange(barangRes.documents);

      // Calculations
      const totalUang = filteredUang.reduce((sum, d) => sum + (d.jumlah || 0), 0);
      const totalTransaksi = filteredUang.length;
      const totalBarang = filteredBarang.reduce((sum, b) => sum + (b.jumlah || 0), 0);

      // JAM VOLUNTEER: (jumlah relawan terdaftar * 3 jam per kegiatan)
      const totalJam = kegiatanRes.documents.reduce((sum, k) => {
        const volunteersCount = k.relawanTerdaftar ? k.relawanTerdaftar.length : 0;
        return sum + volunteersCount * 3;
      }, 0);

      setMetrics([
        {
          label: "Total Donasi Uang",
          value: totalUang >= 1000000 ? `Rp ${(totalUang / 1000000).toFixed(1)} Jt` : `Rp ${totalUang.toLocaleString("id-ID")}`,
          icon: "💰",
        },
        { label: "Total Transaksi", value: String(totalTransaksi), icon: "📋" },
        { label: "Total Donasi Barang", value: `${totalBarang} item`, icon: "📦" },
        { label: "Total Jam Volunteer", value: `${totalJam} jam`, icon: "⏰" },
      ]);

      // Top Panti Paling Aktif (berdasarkan jumlah kegiatan)
      const pantiKegiatanMap: Record<string, number> = {};
      const pantiDonasiMap: Record<string, number> = {};

      kegiatanRes.documents.forEach((k) => {
        pantiKegiatanMap[k.pantiId] = (pantiKegiatanMap[k.pantiId] || 0) + 1;
      });

      filteredUang.forEach((d) => {
        pantiDonasiMap[d.pantiId] = (pantiDonasiMap[d.pantiId] || 0) + (d.jumlah || 0);
      });

      const sortedPantiList = pantiRes.documents
        .map((p) => {
          const kegiatanCount = pantiKegiatanMap[p.$id] || 0;
          const donasiSum = pantiDonasiMap[p.$id] || 0;
          return {
            name: p.namaPanti,
            kegiatan: kegiatanCount,
            donasiVal: donasiSum,
            donasi: donasiSum >= 1000000 ? `Rp ${(donasiSum / 1000000).toFixed(1)} Jt` : `Rp ${donasiSum.toLocaleString("id-ID")}`,
          };
        })
        .sort((a, b) => b.kegiatan - a.kegiatan) // sort by most active
        .slice(0, 3)
        .map((p, idx) => ({ ...p, rank: idx + 1 }));

      setTopPanti(sortedPantiList);

      // Bar Chart: Donasi per bulan (6 bulan terakhir)
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
      const monthlyDataMap: Record<string, number> = {};

      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        monthlyDataMap[months[d.getMonth()]] = 0;
      }

      uangRes.documents.forEach((d) => {
        const date = new Date(d.$createdAt);
        const monthName = months[date.getMonth()];
        if (monthlyDataMap[monthName] !== undefined) {
          monthlyDataMap[monthName] += d.jumlah || 0;
        }
      });

      const barChartFormatted = Object.keys(monthlyDataMap).map((m) => ({
        bulan: m,
        donasi: monthlyDataMap[m],
      }));
      setBarData(barChartFormatted);

      // Pie Chart: Donasi Barang by Category
      let pakaian = 0;
      let alatTulis = 0;
      let sembako = 0;
      let lainnya = 0;

      barangRes.documents.forEach((b) => {
        const name = (b.namaBarang || "").toLowerCase();
        const qty = b.jumlah || 1;
        if (name.includes("baju") || name.includes("pakaian") || name.includes("celana") || name.includes("seragam")) {
          pakaian += qty;
        } else if (name.includes("buku") || name.includes("tulis") || name.includes("pensil") || name.includes("pulpen")) {
          alatTulis += qty;
        } else if (name.includes("beras") || name.includes("mie") || name.includes("makanan") || name.includes("sembako")) {
          sembako += qty;
        } else {
          lainnya += qty;
        }
      });

      const totalItems = pakaian + alatTulis + sembako + lainnya || 1;
      const pieChartFormatted = [
        { name: "Pakaian", value: Math.round((pakaian / totalItems) * 100) },
        { name: "Alat Tulis", value: Math.round((alatTulis / totalItems) * 100) },
        { name: "Sembako", value: Math.round((sembako / totalItems) * 100) },
        { name: "Lainnya", value: Math.round((lainnya / totalItems) * 100) },
      ].filter((item) => item.value > 0);

      setPieData(pieChartFormatted.length > 0 ? pieChartFormatted : [{ name: "Belum Ada Data", value: 100 }]);

    } catch (err) {
      console.error("Gagal memuat laporan admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLaporan();
  }, [dateRange]);

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header (Export button removed) */}
      <div className="bg-white sticky top-0 z-10 border-b border-border/50 px-5 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: "#6D5A4F" }}>Laporan</h1>
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
          {metrics.map((m) => (
            <div key={m.label} className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xl mb-1">{m.icon}</p>
              <p className="font-bold text-base" style={{ color: "#B4A7E7" }}>{loading ? "..." : m.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Top Panti */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold mb-3" style={{ color: "#6D5A4F" }}>Panti Paling Aktif</p>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-4 text-xs text-gray-400">Loading...</div>
            ) : topPanti.length === 0 ? (
              <div className="text-center py-4 text-xs text-gray-400">Belum ada aktivitas panti</div>
            ) : (
              topPanti.map((p) => (
                <div key={p.rank} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: rankColors[p.rank]?.bg || "#F3F4F6", color: rankColors[p.rank]?.text || "#6B7280" }}
                  >
                    #{p.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "#6D5A4F" }}>{p.name}</p>
                    <p className="text-xs text-gray-400">{p.kegiatan} kegiatan · Terkumpul {p.donasi}</p>
                  </div>
                </div>
              ))
            )}
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

      <AdminBottomNav active="laporan" />
    </div>
  );
}
