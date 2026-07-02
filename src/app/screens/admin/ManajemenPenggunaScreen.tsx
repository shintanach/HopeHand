import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, MoreVertical, X } from "lucide-react";
import { toast } from "sonner";
import AdminBottomNav from "./AdminBottomNav";
import { userDB } from "@/imports/appwrite/database";
import type { UserDocument } from "@/imports/appwrite/types";

type FilterTab = "semua" | "relawan" | "pengelola" | "suspend";
type UserStatus = "aktif" | "suspend" | "banned";

const colors = ["#FF7F7F", "#6ECDB1", "#B4A7E7", "#F59E0B", "#FFB6C1", "#3B82F6"];
const getBgColor = (name: string) => {
  if (!name) return colors[0];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

function RoleBadge({ role }: { role: string }) {
  const colorsMap: Record<string, { bg: string; text: string }> = {
    "relawan": { bg: "#FFECE8", text: "#C05621" },
    "panti": { bg: "#D1FAE5", text: "#065F46" },
    "admin": { bg: "#EDE9F8", text: "#6B4EAB" },
  };
  const c = colorsMap[role] || colorsMap["relawan"];
  const label = role === "panti" ? "Pengelola Panti" : role === "admin" ? "Admin" : "Relawan";
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: c.bg, color: c.text }}>
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  const map = {
    aktif: { bg: "#D1FAE5", text: "#065F46", label: "Aktif" },
    suspend: { bg: "#FEF3C7", text: "#92400E", label: "Suspend" },
    banned: { bg: "#FEE2E2", text: "#991B1B", label: "Banned" },
  };
  const s = map[status] || map["aktif"];
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
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [users, setUsers] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const filters: { id: FilterTab; label: string }[] = [
    { id: "semua", label: "Semua" },
    { id: "relawan", label: "Relawan & Donatur" },
    { id: "pengelola", label: "Pengelola Panti" },
    { id: "suspend", label: "Suspend / Banned" },
  ];

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await userDB.listAll();
      // Exclude admin from the user list
      setUsers(res.documents.filter(u => u.role !== "admin"));
    } catch (err) {
      console.error("Gagal memuat data pengguna:", err);
      toast.error("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleUpdateStatus(userId: string, status: "aktif" | "suspend" | "banned") {
    try {
      setActionMenu(null);
      await userDB.update(userId, { status });
      toast.success(`Status user berhasil diubah menjadi ${status}`);
      loadUsers();
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengubah status user");
    }
  }

  const filtered = users.filter((u) => {
    const nameMatch = u.nama.toLowerCase().includes(searchQuery.toLowerCase());
    if (!nameMatch) return false;
    const userStatus = u.status || "aktif";

    if (filter === "relawan") return u.role === "relawan";
    if (filter === "pengelola") return u.role === "panti";
    if (filter === "suspend") return userStatus === "suspend" || userStatus === "banned";
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
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading pengguna...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">Tidak ada pengguna ditemukan</div>
        ) : (
          filtered.map((user) => {
            const initials = user.nama
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "?";
            const userStatus = (user.status as UserStatus) || "aktif";

            return (
              <div
                key={user.$id}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-transform"
                onClick={() => navigate(`/admin/pengguna/${user.$id}`)}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ backgroundColor: getBgColor(user.nama) }}
                >
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold text-sm truncate" style={{ color: "#6D5A4F" }}>{user.nama}</p>
                    <RoleBadge role={user.role} />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs text-gray-400">
                      Bergabung {user.$createdAt ? new Date(user.$createdAt).toLocaleDateString("id-ID", { month: "short", year: "numeric" }) : "-"}
                    </p>
                    <StatusBadge status={userStatus} />
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActionMenu(actionMenu === user.$id ? null : user.$id);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 shrink-0"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            );
          })
        )}
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
              {users.find((u) => u.$id === actionMenu)?.nama}
            </p>
            <button
              className="w-full text-left py-3 px-1 text-sm border-b border-border/30 transition-colors hover:bg-gray-50 text-gray-700"
              onClick={() => {
                setActionMenu(null);
                navigate(`/admin/pengguna/${actionMenu}`);
              }}
            >
              Detail
            </button>
            <button
              className="w-full text-left py-3 px-1 text-sm border-b border-border/30 transition-colors hover:bg-gray-50 text-yellow-600"
              onClick={() => handleUpdateStatus(actionMenu, "suspend")}
            >
              Suspend
            </button>
            <button
              className="w-full text-left py-3 px-1 text-sm transition-colors hover:bg-gray-50 text-red-600"
              onClick={() => handleUpdateStatus(actionMenu, "banned")}
            >
              Ban
            </button>
            <button
              className="w-full text-left py-3 px-1 text-sm transition-colors hover:bg-gray-50 text-green-600 font-semibold"
              onClick={() => handleUpdateStatus(actionMenu, "aktif")}
            >
              Aktifkan Kembali
            </button>
          </div>
        </div>
      )}

      <AdminBottomNav active="pengguna" />
    </div>
  );
}
