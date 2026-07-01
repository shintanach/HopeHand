import { useNavigate } from "react-router";
import { Home, CheckSquare, Users, BarChart2, Settings } from "lucide-react";

type AdminTab = "dashboard" | "verifikasi" | "pengguna" | "laporan" | "pengaturan";

const navItems = [
  { id: "dashboard" as AdminTab, label: "Dashboard", icon: Home, path: "/admin/home" },
  { id: "verifikasi" as AdminTab, label: "Verifikasi", icon: CheckSquare, path: "/admin/verifikasi" },
  { id: "pengguna" as AdminTab, label: "Pengguna", icon: Users, path: "/admin/pengguna" },
  { id: "laporan" as AdminTab, label: "Laporan", icon: BarChart2, path: "/admin/laporan" },
  { id: "pengaturan" as AdminTab, label: "Pengaturan", icon: Settings, path: "/admin/pengaturan" },
];

export default function AdminBottomNav({ active }: { active: AdminTab }) {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-20">
      <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors"
            >
              <item.icon
                className="w-5 h-5"
                style={{ color: isActive ? "#B4A7E7" : "#9CA3AF" }}
              />
              <span
                className="text-[10px]"
                style={{ color: isActive ? "#B4A7E7" : "#9CA3AF", fontWeight: isActive ? 600 : 400 }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
