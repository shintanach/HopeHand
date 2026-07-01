import { ID, Query } from "appwrite";
import { databases } from "./client";
import { DB_ID, COLLECTIONS, STATUS_PANTI, STATUS_KAMPANYE } from "./config";
import type {
  UserDocument,
  PantiDocument,
  KampanyeDocument,
  KegiatanDocument,
  DonasiBarangDocument,
  KebutuhanBarangDocument,
  DonasiUangDocument,
  NotifikasiDocument,
} from "./types";

// ─────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────
export const userDB = {
  get: (userId: string) =>
    databases.getDocument<UserDocument>(DB_ID, COLLECTIONS.USERS, userId),

  update: (userId: string, data: Partial<UserDocument>) =>
    databases.updateDocument<UserDocument>(DB_ID, COLLECTIONS.USERS, userId, data),
};

// ─────────────────────────────────────────────────────────
// PANTI
// ─────────────────────────────────────────────────────────
export const pantiDB = {
  /** Ambil data panti berdasarkan userId */
  getByUserId: (userId: string) =>
    databases.listDocuments<PantiDocument>(DB_ID, COLLECTIONS.PANTI, [
      Query.equal("userId", userId),
      Query.limit(1),
    ]),

  /** Ambil satu panti by $id */
  getById: (pantiId: string) =>
    databases.getDocument<PantiDocument>(DB_ID, COLLECTIONS.PANTI, pantiId),

  /** Semua panti (untuk admin) */
  listAll: (queries: string[] = []) =>
    databases.listDocuments<PantiDocument>(DB_ID, COLLECTIONS.PANTI, queries),

  /** List panti yang statusnya pending (untuk admin verifikasi) */
  listPending: () =>
    databases.listDocuments<PantiDocument>(DB_ID, COLLECTIONS.PANTI, [
      Query.equal("status", STATUS_PANTI.PENDING),
      Query.orderDesc("$createdAt"),
    ]),

  /** List panti yang sudah terverifikasi (untuk explore) */
  listVerified: () =>
    databases.listDocuments<PantiDocument>(DB_ID, COLLECTIONS.PANTI, [
      Query.equal("status", STATUS_PANTI.TERVERIFIKASI),
      Query.orderAsc("namaPanti"),
    ]),

  /** Update profil panti */
  update: (pantiId: string, data: Partial<PantiDocument>) =>
    databases.updateDocument<PantiDocument>(DB_ID, COLLECTIONS.PANTI, pantiId, data),

  /** Admin: verifikasi panti */
  verify: (pantiId: string) =>
    databases.updateDocument<PantiDocument>(DB_ID, COLLECTIONS.PANTI, pantiId, {
      status: STATUS_PANTI.TERVERIFIKASI,
      verifiedAt: new Date().toISOString(),
    }),

  /** Admin: tolak panti */
  reject: (pantiId: string, catatan: string) =>
    databases.updateDocument<PantiDocument>(DB_ID, COLLECTIONS.PANTI, pantiId, {
      status: STATUS_PANTI.DITOLAK,
      catatanAdmin: catatan,
    }),
};

// ─────────────────────────────────────────────────────────
// KAMPANYE
// ─────────────────────────────────────────────────────────
export const kampanyeDB = {
  getById: (kampanyeId: string) =>
    databases.getDocument<KampanyeDocument>(DB_ID, COLLECTIONS.KAMPANYE, kampanyeId),

  /** Semua kampanye aktif (untuk explore relawan) */
  listAktif: (queries: string[] = []) =>
    databases.listDocuments<KampanyeDocument>(DB_ID, COLLECTIONS.KAMPANYE, [
      Query.equal("status", STATUS_KAMPANYE.AKTIF),
      Query.orderDesc("$createdAt"),
      ...queries,
    ]),

  /** Kampanye per panti */
  listByPanti: (pantiId: string) =>
    databases.listDocuments<KampanyeDocument>(DB_ID, COLLECTIONS.KAMPANYE, [
      Query.equal("pantiId", pantiId),
      Query.orderDesc("$createdAt"),
    ]),

  /** Kampanye menunggu review admin */
  listPending: () =>
    databases.listDocuments<KampanyeDocument>(DB_ID, COLLECTIONS.KAMPANYE, [
      Query.equal("status", STATUS_KAMPANYE.MENUNGGU),
      Query.orderDesc("$createdAt"),
    ]),

  create: (data: Omit<KampanyeDocument, "$id" | "$collectionId" | "$databaseId" | "$createdAt" | "$updatedAt" | "$permissions">) =>
    databases.createDocument<KampanyeDocument>(
      DB_ID,
      COLLECTIONS.KAMPANYE,
      ID.unique(),
      { ...data, status: STATUS_KAMPANYE.MENUNGGU, terkumpul: 0 }
    ),

  update: (kampanyeId: string, data: Partial<KampanyeDocument>) =>
    databases.updateDocument<KampanyeDocument>(DB_ID, COLLECTIONS.KAMPANYE, kampanyeId, data),

  /** Admin: setujui kampanye */
  approve: (kampanyeId: string) =>
    databases.updateDocument<KampanyeDocument>(DB_ID, COLLECTIONS.KAMPANYE, kampanyeId, {
      status: STATUS_KAMPANYE.AKTIF,
    }),

  /** Admin: tolak kampanye */
  reject: (kampanyeId: string, catatan: string) =>
    databases.updateDocument<KampanyeDocument>(DB_ID, COLLECTIONS.KAMPANYE, kampanyeId, {
      status: STATUS_KAMPANYE.DITOLAK,
      catatanAdmin: catatan,
    }),

  delete: (kampanyeId: string) =>
    databases.deleteDocument(DB_ID, COLLECTIONS.KAMPANYE, kampanyeId),
};

// ─────────────────────────────────────────────────────────
// KEGIATAN
// ─────────────────────────────────────────────────────────
export const kegiatanDB = {
  getById: (kegiatanId: string) =>
    databases.getDocument<KegiatanDocument>(DB_ID, COLLECTIONS.KEGIATAN, kegiatanId),

  listByPanti: (pantiId: string) =>
    databases.listDocuments<KegiatanDocument>(DB_ID, COLLECTIONS.KEGIATAN, [
      Query.equal("pantiId", pantiId),
      Query.orderAsc("tanggal"),
    ]),

  listUpcoming: (queries: string[] = []) =>
    databases.listDocuments<KegiatanDocument>(DB_ID, COLLECTIONS.KEGIATAN, [
      Query.equal("status", "upcoming"),
      Query.orderAsc("tanggal"),
      ...queries,
    ]),

  create: (data: Omit<KegiatanDocument, "$id" | "$collectionId" | "$databaseId" | "$createdAt" | "$updatedAt" | "$permissions">) =>
    databases.createDocument<KegiatanDocument>(
      DB_ID,
      COLLECTIONS.KEGIATAN,
      ID.unique(),
      { ...data, relawanTerdaftar: [], status: "upcoming" }
    ),

  update: (kegiatanId: string, data: Partial<KegiatanDocument>) =>
    databases.updateDocument<KegiatanDocument>(DB_ID, COLLECTIONS.KEGIATAN, kegiatanId, data),

  /** Relawan daftar ke kegiatan */
  daftar: async (kegiatanId: string, userId: string) => {
    const kegiatan = await databases.getDocument<KegiatanDocument>(
      DB_ID, COLLECTIONS.KEGIATAN, kegiatanId
    );
    const relawanBaru = [...(kegiatan.relawanTerdaftar ?? []), userId];
    return databases.updateDocument<KegiatanDocument>(
      DB_ID, COLLECTIONS.KEGIATAN, kegiatanId,
      { relawanTerdaftar: relawanBaru }
    );
  },

  delete: (kegiatanId: string) =>
    databases.deleteDocument(DB_ID, COLLECTIONS.KEGIATAN, kegiatanId),
};

// ─────────────────────────────────────────────────────────
// DONASI BARANG
// ─────────────────────────────────────────────────────────
export const donasiBarangDB = {
  getById: (donasiId: string) =>
    databases.getDocument<DonasiBarangDocument>(DB_ID, COLLECTIONS.DONASI_BARANG, donasiId),

  /** List donasi masuk ke panti tertentu */
  listByPanti: (pantiId: string, queries: string[] = []) =>
    databases.listDocuments<DonasiBarangDocument>(DB_ID, COLLECTIONS.DONASI_BARANG, [
      Query.equal("pantiId", pantiId),
      Query.orderDesc("$createdAt"),
      ...queries,
    ]),

  /** Riwayat donasi oleh seorang relawan */
  listByDonatur: (donaturId: string) =>
    databases.listDocuments<DonasiBarangDocument>(DB_ID, COLLECTIONS.DONASI_BARANG, [
      Query.equal("donaturId", donaturId),
      Query.orderDesc("$createdAt"),
    ]),

  create: (data: Omit<DonasiBarangDocument, "$id" | "$collectionId" | "$databaseId" | "$createdAt" | "$updatedAt" | "$permissions">) =>
    databases.createDocument<DonasiBarangDocument>(
      DB_ID,
      COLLECTIONS.DONASI_BARANG,
      ID.unique(),
      { ...data, status: "menunggu" }
    ),

  /** Panti konfirmasi penerimaan */
  konfirmasi: (donasiId: string, konfirmasiOleh: string) =>
    databases.updateDocument<DonasiBarangDocument>(
      DB_ID, COLLECTIONS.DONASI_BARANG, donasiId,
      {
        status: "diterima",
        konfirmasiOleh,
        konfirmasiAt: new Date().toISOString(),
      }
    ),

  tolak: (donasiId: string, konfirmasiOleh: string) =>
    databases.updateDocument<DonasiBarangDocument>(
      DB_ID, COLLECTIONS.DONASI_BARANG, donasiId,
      { status: "ditolak", konfirmasiOleh }
    ),
};

// ─────────────────────────────────────────────────────────
// KEBUTUHAN BARANG (request dari panti)
// ─────────────────────────────────────────────────────────
export const kebutuhanDB = {
  listByPanti: (pantiId: string) =>
    databases.listDocuments<KebutuhanBarangDocument>(DB_ID, COLLECTIONS.DONASI_BARANG, [
      Query.equal("pantiId", pantiId),
      Query.equal("status", "aktif"),
      Query.orderDesc("prioritas"),
    ]),

  create: (data: Partial<KebutuhanBarangDocument>) =>
    databases.createDocument<KebutuhanBarangDocument>(
      DB_ID,
      COLLECTIONS.DONASI_BARANG,
      ID.unique(),
      { ...data, jumlahTerpenuhi: 0, status: "aktif" }
    ),

  update: (id: string, data: Partial<KebutuhanBarangDocument>) =>
    databases.updateDocument<KebutuhanBarangDocument>(DB_ID, COLLECTIONS.DONASI_BARANG, id, data),

  delete: (id: string) =>
    databases.deleteDocument(DB_ID, COLLECTIONS.DONASI_BARANG, id),
};

// ─────────────────────────────────────────────────────────
// DONASI UANG (via transfer manual)
// ─────────────────────────────────────────────────────────
export const donasiUangDB = {
  getById: (donasiId: string) =>
    databases.getDocument<DonasiUangDocument>(DB_ID, COLLECTIONS.DONASI_UANG, donasiId),

  listByKampanye: (kampanyeId: string) =>
    databases.listDocuments<DonasiUangDocument>(DB_ID, COLLECTIONS.DONASI_UANG, [
      Query.equal("kampanyeId", kampanyeId),
      Query.orderDesc("$createdAt"),
    ]),

  listByDonatur: (donaturId: string) =>
    databases.listDocuments<DonasiUangDocument>(DB_ID, COLLECTIONS.DONASI_UANG, [
      Query.equal("donaturId", donaturId),
      Query.orderDesc("$createdAt"),
    ]),

  listPendingByPanti: (pantiId: string) =>
    databases.listDocuments<DonasiUangDocument>(DB_ID, COLLECTIONS.DONASI_UANG, [
      Query.equal("pantiId", pantiId),
      Query.equal("status", "menunggu_konfirmasi"),
      Query.orderDesc("$createdAt"),
    ]),

  /** Relawan submit bukti transfer */
  create: (data: Omit<DonasiUangDocument, "$id" | "$collectionId" | "$databaseId" | "$createdAt" | "$updatedAt" | "$permissions">) =>
    databases.createDocument<DonasiUangDocument>(
      DB_ID,
      COLLECTIONS.DONASI_UANG,
      ID.unique(),
      { ...data, status: "menunggu_konfirmasi" }
    ),

  /** Panti konfirmasi donasi & update total kampanye */
  konfirmasi: async (donasiId: string, konfirmasiOleh: string) => {
    const donasi = await databases.getDocument<DonasiUangDocument>(
      DB_ID, COLLECTIONS.DONASI_UANG, donasiId
    );

    // Update status donasi
    await databases.updateDocument<DonasiUangDocument>(
      DB_ID, COLLECTIONS.DONASI_UANG, donasiId,
      {
        status: "terkonfirmasi",
        konfirmasiOleh,
        konfirmasiAt: new Date().toISOString(),
      }
    );

    // Tambah jumlah ke total kampanye
    const kampanye = await databases.getDocument<KampanyeDocument>(
      DB_ID, COLLECTIONS.KAMPANYE, donasi.kampanyeId
    );
    await databases.updateDocument<KampanyeDocument>(
      DB_ID, COLLECTIONS.KAMPANYE, donasi.kampanyeId,
      { terkumpul: (kampanye.terkumpul ?? 0) + donasi.jumlah }
    );
  },

  tolak: (donasiId: string, konfirmasiOleh: string) =>
    databases.updateDocument<DonasiUangDocument>(
      DB_ID, COLLECTIONS.DONASI_UANG, donasiId,
      { status: "ditolak", konfirmasiOleh }
    ),
};

// ─────────────────────────────────────────────────────────
// NOTIFIKASI
// ─────────────────────────────────────────────────────────
export const notifikasiDB = {
  listByUser: (userId: string, onlyUnread = false) => {
    const queries = [
      Query.equal("userId", userId),
      Query.orderDesc("createdAt"),
      Query.limit(50),
    ];
    if (onlyUnread) queries.push(Query.equal("dibaca", false));
    return databases.listDocuments<NotifikasiDocument>(
      DB_ID, COLLECTIONS.NOTIFIKASI, queries
    );
  },

  create: (data: Omit<NotifikasiDocument, "$id" | "$collectionId" | "$databaseId" | "$createdAt" | "$updatedAt" | "$permissions">) =>
    databases.createDocument<NotifikasiDocument>(
      DB_ID,
      COLLECTIONS.NOTIFIKASI,
      ID.unique(),
      { ...data, dibaca: false, createdAt: new Date().toISOString() }
    ),

  markAsRead: (notifId: string) =>
    databases.updateDocument<NotifikasiDocument>(
      DB_ID, COLLECTIONS.NOTIFIKASI, notifId,
      { dibaca: true }
    ),

  markAllAsRead: async (userId: string) => {
    const list = await notifikasiDB.listByUser(userId, true);
    return Promise.all(
      list.documents.map((n) => notifikasiDB.markAsRead(n.$id))
    );
  },

  delete: (notifId: string) =>
    databases.deleteDocument(DB_ID, COLLECTIONS.NOTIFIKASI, notifId),
};
