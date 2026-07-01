import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminBottomNav from "./AdminBottomNav";

interface PaymentMethod {
  id: string;
  label: string;
  enabled: boolean;
}

interface Category {
  id: number;
  name: string;
}

const initialPaymentMethods: PaymentMethod[] = [
  { id: "qris", label: "QRIS", enabled: true },
  { id: "gopay", label: "GoPay", enabled: true },
  { id: "ovo", label: "OVO", enabled: true },
  { id: "transfer", label: "Transfer Bank", enabled: true },
];

const initialCategories: Category[] = [
  { id: 1, name: "Pakaian" },
  { id: 2, name: "Alat Tulis" },
  { id: 3, name: "Sembako" },
  { id: 4, name: "Furnitur" },
  { id: 5, name: "Lainnya" },
];

type NotifKey = "kegiatanBaru" | "kampanyeBaru" | "donasiMasuk";

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-12 h-6 rounded-full transition-colors"
      style={{ backgroundColor: value ? "#B4A7E7" : "#D1D5DB" }}
    >
      <div
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
        style={{ transform: value ? "translateX(1.5rem)" : "translateX(0.125rem)" }}
      />
    </button>
  );
}

export default function PengaturanPlatformScreen() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [pendingToggle, setPendingToggle] = useState<string | null>(null);

  const [adminFee, setAdminFee] = useState("2");
  const [showFeeDialog, setShowFeeDialog] = useState(false);

  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [deleteCatId, setDeleteCatId] = useState<number | null>(null);
  const [editCatId, setEditCatId] = useState<number | null>(null);
  const [editCatName, setEditCatName] = useState("");

  const [announceTo, setAnnounceTo] = useState<Record<string, boolean>>({
    semua: false,
    relawan: false,
    pengelola: false,
  });
  const [announceTitle, setAnnounceTitle] = useState("");
  const [announceBody, setAnnounceBody] = useState("");
  const [showAnnounceDialog, setShowAnnounceDialog] = useState(false);

  const [notifs, setNotifs] = useState<Record<NotifKey, boolean>>({
    kegiatanBaru: true,
    kampanyeBaru: true,
    donasiMasuk: true,
  });

  function handleTogglePayment(id: string) {
    const method = paymentMethods.find((m) => m.id === id);
    if (method?.enabled) {
      setPendingToggle(id);
    } else {
      setPaymentMethods((prev) => prev.map((m) => (m.id === id ? { ...m, enabled: true } : m)));
    }
  }

  function confirmDisable() {
    if (pendingToggle) {
      setPaymentMethods((prev) => prev.map((m) => (m.id === pendingToggle ? { ...m, enabled: false } : m)));
      setPendingToggle(null);
    }
  }

  function handleAddCategory() {
    if (!newCategory.trim()) return;
    setCategories((prev) => [...prev, { id: Date.now(), name: newCategory.trim() }]);
    setNewCategory("");
    setShowAddCategory(false);
    toast.success("Kategori ditambahkan");
  }

  function handleDeleteCat(id: number) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDeleteCatId(null);
    toast.success("Kategori dihapus");
  }

  function handleEditCat() {
    if (!editCatName.trim() || editCatId === null) return;
    setCategories((prev) => prev.map((c) => (c.id === editCatId ? { ...c, name: editCatName } : c)));
    setEditCatId(null);
    setEditCatName("");
    toast.success("Kategori diperbarui");
  }

  function handleSendAnnouncement() {
    setShowAnnounceDialog(false);
    setAnnounceTitle("");
    setAnnounceBody("");
    setAnnounceTo({ semua: false, relawan: false, pengelola: false });
    toast.success("Pengumuman berhasil dikirim");
  }

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-border/50 px-5 py-4">
        <h1 className="text-xl font-bold" style={{ color: "#6D5A4F" }}>Pengaturan</h1>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold mb-3" style={{ color: "#6D5A4F" }}>Metode Pembayaran</p>
          <div className="space-y-4">
            {paymentMethods.map((m) => (
              <div key={m.id} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "#6D5A4F" }}>{m.label}</span>
                <Toggle value={m.enabled} onChange={() => handleTogglePayment(m.id)} />
              </div>
            ))}
          </div>
        </div>

        {/* Admin Fee */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold mb-3" style={{ color: "#6D5A4F" }}>Biaya Admin</p>
          <p className="text-xs text-gray-500 mb-2">Persentase biaya per transaksi</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl" style={{ backgroundColor: "#F5EDE8" }}>
              <input
                type="number"
                value={adminFee}
                onChange={(e) => setAdminFee(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm font-semibold"
                style={{ color: "#6D5A4F" }}
                min="0"
                max="100"
              />
              <span className="text-sm text-gray-400">%</span>
            </div>
            <button
              onClick={() => setShowFeeDialog(true)}
              className="px-5 py-3 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: "#B4A7E7" }}
            >
              Simpan
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold mb-3" style={{ color: "#6D5A4F" }}>Kategori Donasi Barang</p>
          <div className="space-y-2 mb-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                {editCatId === cat.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editCatName}
                      onChange={(e) => setEditCatName(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg text-sm outline-none"
                      style={{ backgroundColor: "#F5EDE8", color: "#6D5A4F" }}
                      autoFocus
                    />
                    <button onClick={handleEditCat} className="text-xs px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: "#B4A7E7" }}>Simpan</button>
                    <button onClick={() => setEditCatId(null)} className="text-xs px-2 py-1.5 rounded-full text-gray-500">Batal</button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm" style={{ color: "#6D5A4F" }}>{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditCatId(cat.id); setEditCatName(cat.name); }} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100">
                        <Pencil className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                      <button onClick={() => setDeleteCatId(cat.id)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {showAddCategory ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nama kategori baru..."
                className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                style={{ backgroundColor: "#F5EDE8", color: "#6D5A4F" }}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              />
              <button onClick={handleAddCategory} className="px-4 py-2 rounded-full text-sm font-semibold text-white shrink-0" style={{ backgroundColor: "#B4A7E7" }}>Tambah</button>
              <button onClick={() => { setShowAddCategory(false); setNewCategory(""); }} className="px-3 py-2 rounded-full text-sm text-gray-500 shrink-0">Batal</button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddCategory(true)}
              className="text-sm font-semibold flex items-center gap-1"
              style={{ color: "#B4A7E7" }}
            >
              + Tambah Kategori
            </button>
          )}
        </div>

        {/* Announcement */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold mb-3" style={{ color: "#6D5A4F" }}>Kirim Pengumuman</p>

          <p className="text-xs text-gray-500 mb-2">Kepada</p>
          <div className="space-y-2 mb-4">
            {[
              { id: "semua", label: "Semua Pengguna" },
              { id: "relawan", label: "Relawan & Donatur" },
              { id: "pengelola", label: "Pengelola Panti" },
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-3 cursor-pointer">
                <div
                  className="w-4 h-4 rounded flex items-center justify-center border-2"
                  style={{ borderColor: announceTo[opt.id] ? "#B4A7E7" : "#D1D5DB", backgroundColor: announceTo[opt.id] ? "#B4A7E7" : "transparent" }}
                  onClick={() => setAnnounceTo((prev) => ({ ...prev, [opt.id]: !prev[opt.id] }))}
                >
                  {announceTo[opt.id] && <span className="text-white text-xs">✓</span>}
                </div>
                <span className="text-sm" style={{ color: "#6D5A4F" }}>{opt.label}</span>
              </label>
            ))}
          </div>

          <input
            type="text"
            value={announceTitle}
            onChange={(e) => setAnnounceTitle(e.target.value)}
            placeholder="Judul Pengumuman"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-3"
            style={{ backgroundColor: "#F5EDE8", color: "#6D5A4F" }}
          />
          <textarea
            value={announceBody}
            onChange={(e) => setAnnounceBody(e.target.value)}
            placeholder="Isi Pesan..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none mb-4"
            style={{ backgroundColor: "#F5EDE8", color: "#6D5A4F" }}
          />
          <button
            onClick={() => setShowAnnounceDialog(true)}
            className="w-full py-3 rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: "#B4A7E7" }}
          >
            Kirim Sekarang
          </button>
        </div>

        {/* Global Notifications */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold mb-3" style={{ color: "#6D5A4F" }}>Notifikasi Global</p>
          <div className="space-y-4">
            {(
              [
                { key: "kegiatanBaru" as NotifKey, label: "Notifikasi kegiatan baru" },
                { key: "kampanyeBaru" as NotifKey, label: "Notifikasi kampanye baru" },
                { key: "donasiMasuk" as NotifKey, label: "Notifikasi donasi masuk" },
              ] as { key: NotifKey; label: string }[]
            ).map((n) => (
              <div key={n.key} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "#6D5A4F" }}>{n.label}</span>
                <Toggle value={notifs[n.key]} onChange={(v) => setNotifs((prev) => ({ ...prev, [n.key]: v }))} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disable Payment Dialog */}
      {pendingToggle !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="font-bold text-base mb-2 text-center" style={{ color: "#6D5A4F" }}>
              Nonaktifkan {paymentMethods.find((m) => m.id === pendingToggle)?.label}?
            </p>
            <p className="text-sm text-center text-gray-500 mb-5">Metode pembayaran ini tidak akan tersedia untuk pengguna.</p>
            <div className="flex gap-3">
              <button onClick={() => setPendingToggle(null)} className="flex-1 py-2.5 rounded-full text-sm border border-border" style={{ color: "#6D5A4F" }}>Batal</button>
              <button onClick={confirmDisable} className="flex-1 py-2.5 rounded-full text-sm font-bold text-white" style={{ backgroundColor: "#EF4444" }}>Ya, Nonaktifkan</button>
            </div>
          </div>
        </div>
      )}

      {/* Fee Dialog */}
      {showFeeDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="font-bold text-base mb-2 text-center" style={{ color: "#6D5A4F" }}>Simpan Biaya Admin?</p>
            <p className="text-sm text-center text-gray-500 mb-5">Biaya admin akan diubah menjadi <span className="font-semibold">{adminFee}%</span> per transaksi.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowFeeDialog(false)} className="flex-1 py-2.5 rounded-full text-sm border border-border" style={{ color: "#6D5A4F" }}>Batal</button>
              <button
                onClick={() => { setShowFeeDialog(false); toast.success("Biaya admin diperbarui"); }}
                className="flex-1 py-2.5 rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: "#B4A7E7" }}
              >
                Ya, Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Dialog */}
      {deleteCatId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="font-bold text-base mb-2 text-center" style={{ color: "#6D5A4F" }}>Hapus Kategori?</p>
            <p className="text-sm text-center text-gray-500 mb-5">
              Hapus "<span className="font-semibold">{categories.find((c) => c.id === deleteCatId)?.name}</span>"?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteCatId(null)} className="flex-1 py-2.5 rounded-full text-sm border border-border" style={{ color: "#6D5A4F" }}>Batal</button>
              <button onClick={() => handleDeleteCat(deleteCatId)} className="flex-1 py-2.5 rounded-full text-sm font-bold text-white" style={{ backgroundColor: "#EF4444" }}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Dialog */}
      {showAnnounceDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="font-bold text-base mb-2 text-center" style={{ color: "#6D5A4F" }}>Kirim Pengumuman?</p>
            <p className="text-sm text-center text-gray-500 mb-5">Pengumuman akan dikirim ke pengguna yang dipilih sekarang.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowAnnounceDialog(false)} className="flex-1 py-2.5 rounded-full text-sm border border-border" style={{ color: "#6D5A4F" }}>Batal</button>
              <button onClick={handleSendAnnouncement} className="flex-1 py-2.5 rounded-full text-sm font-bold text-white" style={{ backgroundColor: "#B4A7E7" }}>Ya, Kirim</button>
            </div>
          </div>
        </div>
      )}

      <AdminBottomNav active="pengaturan" />
    </div>
  );
}
