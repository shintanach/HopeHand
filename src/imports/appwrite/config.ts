// ============================================================
// Appwrite Configuration — IDs & Constants
// ============================================================

export const APPWRITE_ENDPOINT =
  import.meta.env.VITE_APPWRITE_ENDPOINT as string;

export const APPWRITE_PROJECT_ID =
  import.meta.env.VITE_APPWRITE_PROJECT_ID as string;

// ── Database ──────────────────────────────────────────────
export const DB_ID = "hopehand-db";

// ── Collection IDs ────────────────────────────────────────
export const COLLECTIONS = {
  USERS: "users",
  PANTI: "panti",
  KAMPANYE: "kampanye",
  KEGIATAN: "kegiatan",
  DONASI_BARANG: "donasi_barang",
  DONASI_UANG: "donasi_uang",
  NOTIFIKASI: "notifikasi",
} as const;

// ── Storage Bucket IDs ───────────────────────────────────
// Catatan: Appwrite free plan = 1 bucket. Semua file pakai satu bucket.
export const BUCKETS = {
  SEMUA: "dokumen-panti", // satu bucket untuk semua jenis file
} as const;

// ── User Roles (stored as Appwrite labels) ────────────────
export const ROLES = {
  RELAWAN: "relawan",
  PANTI: "panti",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// ── Status Values ─────────────────────────────────────────
export const STATUS_PANTI = {
  PENDING: "pending",
  TERVERIFIKASI: "terverifikasi",
  DITOLAK: "ditolak",
} as const;

export const STATUS_KAMPANYE = {
  DRAFT: "draft",
  MENUNGGU: "menunggu",
  AKTIF: "aktif",
  SELESAI: "selesai",
  DITOLAK: "ditolak",
} as const;

export const STATUS_DONASI_BARANG = {
  MENUNGGU: "menunggu",
  DIKONFIRMASI: "dikonfirmasi",
  DITERIMA: "diterima",
  DITOLAK: "ditolak",
} as const;

export const STATUS_DONASI_UANG = {
  MENUNGGU_KONFIRMASI: "menunggu_konfirmasi",
  TERKONFIRMASI: "terkonfirmasi",
  DITOLAK: "ditolak",
} as const;
