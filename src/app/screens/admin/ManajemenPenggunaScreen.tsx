import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, MoreVertical, X } from "lucide-react";
import AdminBottomNav from "./AdminBottomNav";

type FilterTab = "semua" | "relawan" | "pengelola" | "suspend";
type UserStatus = "aktif" | "suspend" | "banned";

interface UserData {
  id: number;
  name: string;
  role: "Relawan" | "Donatur" | "Pengelola Panti";
  joinDate: string;
  status: UserStatus;
  initials: string;
  bgColor: string;
}

const users: UserData[] = [
  { id: 1, name: "Budi Santoso", role: "Relawan", joinDate: "Jan 2025", status: "aktif", initials: "BS", bgColor: "#FF7F7F" },
  { id: 2, name: "Siti Rahayu", role: "Pengelola Panti", joinDate: "Feb 2025", status: "aktif", initials: "SR", bgColor: "#6ECDB1" },
  { id: 3, name: "Ahmad Wijaya", role: "Donatur", joinDate: "Mar 2025", status: "aktif", initials: "AW", bgColor: "#B4A7E7" },
  { id: 4, name: "Dewi Lestari", role: "Relawan", joinDate: "Apr 2025", status: "suspend", initials: "DL", bgColor: "#FFB6C1" },
  { id: 5, name: "Rizki Pratama", role: "Pengelola Panti", joinDate: "May 2025", status: "aktif", initials: "RP", bgColor: "#6ECDB1" },
  { id: 6, name: "Maya Indah", role: "Relawan", joinDate: "Jun 2025", status: "banned", initials: "MI", bgColor: "#FF7F7F" },
  { id: 7, name: "Hendra Gunawan", role: "Donatur", joinDate: "Jul 2025", status: "aktif", initials: "HG", bgColor: "#B4A7E7" },
];

function RoleBadge({ role }: { role: UserData["role"] }) {
  const colors = {
    "Relawan": { bg: "#FFECE8", text: "#C05621" },
    "Donatur": { bg: "#EDE9F8", text: "#6B4EAB" },
    "Pengelola Panti": { bg: "#D1FAE5", text: "#065F46" },
  };
  const c = colors[role];
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: c.bg, color: c.text }}>
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  const map = {
    aktif: { bg: "#D1FAE5", text: "#065F46", label: "Aktif" },
    suspend: { bg: "#FEF3C7", text: "#92400E", label: "Suspend" },
    banned: { bg: "#FEE2E2", text: "#991B1B", label: "Banned" },
  };
  const s = map[status];
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}

export default function ManajemenPenggunaScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterTab>("semua");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionMenu, setActionMenu] = useState<number | null>(null);

  const filters: { id: FilterTab; label: string }[] = [
    { id: "semua", label: "Semua" },
    { id: "relawan", label: "Relawan & Donatur" },
    { id: "pengelola", label: "Pengelola Panti" },
    { id: "suspend", label: "Suspend" },
  ];

  const filtered = users.filter((u) => {
    const matchQuery = u.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchQuery) return false;
    if (filter === "relawan") return u.role === "Relawan" || u.role === "Donatur";
    if (filter === "pengelola") return u.role === "Pengelola Panti";
    if (filter === "suspend") return u.status === "suspend";
    return true;
  });

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-border/50">
        <div className="px-5 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ color: "#6D5A4F" }}>Pengguna</h1>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            {showSearch ? <X className="w-5 h-5" style={{ color: "#6D5A4F" }} /> : <Search className="w-5 h-5" style={{ color: "#6D5A4F" }} />}
          </button>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="px-5 pb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama pengguna..."
              autoFocus
              className="w-full px-4 py-2.5 rounded-full text-sm outline-none"
              style={{ backgroundColor: "#F5EDE8", color: "#6D5A4F" }}
            />
          </div>
        )}

        {/* Filter Chips */}
        <div className="flex gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: filter === f.id ? "#B4A7E7" : "#F5EDE8",
                color: filter === f.id ? "white" : "#6D5A4F",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* User List */}
      <div className="px-5 py-4 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">Tidak ada pengguna ditemukan</div>
        )}
        {filtered.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-transform"
            onClick={() => navigate(`/admin/pengguna/${user.id}`)}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ backgroundColor: user.bgColor }}
            >
              {user.initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="font-bold text-sm" style={{ color: "#6D5A4F" }}>{user.name}</p>
                <RoleBadge role={user.role} />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs text-gray-400">Bergabung {user.joinDate}</p>
                <StatusBadge status={user.status} />
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); setActionMenu(actionMenu === user.id ? null : user.id); }}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 shrink-0"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        ))}
      </div>

      {/* Action Menu Overlay */}
      {actionMenu !== null && (
        <div
          className="fixed inset-0 bg-black/20 z-30 flex items-end justify-center"
          onClick={() => setActionMenu(null)}
        >
          <div
            className="bg-white rounded-t-2xl w-full max-w-lg p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <p className="font-bold text-sm mb-4 px-1" style={{ color: "#6D5A4F" }}>
              {users.find((u) => u.id === actionMenu)?.name}
            </p>
            {["Detail", "Suspend", "Ban"].map((action) => (
              <button
                key={action}
                className="w-full text-left py-3 px-1 text-sm border-b border-border/30 last:border-0 transition-colors hover:bg-gray-50"
                style={{
                  color: action === "Suspend" ? "#F59E0B" : action === "Ban" ? "#EF4444" : "#6D5A4F",
                }}
                onClick={() => {
                  setActionMenu(null);
                  if (action === "Detail") navigate(`/admin/pengguna/${actionMenu}`);
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      <AdminBottomNav active="pengguna" />
    </div>
  );
}
