import { Models } from "appwrite";
import {
  UserRole,
  STATUS_PANTI,
  STATUS_KAMPANYE,
  STATUS_DONASI_BARANG,
  STATUS_DONASI_UANG,
} from "./config";

// ── Base (semua dokumen Appwrite punya ini) ───────────────
export type AppwriteDocument = Models.Document;

// ── Users Collection ──────────────────────────────────────
export interface UserDocument extends AppwriteDocument {
  userId: string;       // Appwrite account ID
  nama: string;
  email: string;
  role: UserRole;
  fotoProfil?: string;  // fileId di bucket foto-profil
  telepon?: string;
  alamat?: string;
  createdAt: string;
}

// ── Panti Collection ──────────────────────────────────────
export type StatusPanti = (typeof STATUS_PANTI)[keyof typeof STATUS_PANTI];

export interface PantiDocument extends AppwriteDocument {
  userId: string;           // relasi ke users.$id
  namaPanti: string;
  alamat: string;
  kota: string;
  provinsi: string;
  telepon: string;
  email: string;
  deskripsi: string;
  jumlahAnak: number;
  namaKetua: string;
  // Dokumen verifikasi (fileIds di bucket dokumen-panti)
  dokumenAkte?: string;
  dokumenKTP?: string;
  dokumenSuratIzin?: string;
  fotoPanti?: string;
  // Status
  status: StatusPanti;
  catatanAdmin?: string;    // alasan jika ditolak
  verifiedAt?: string;
  noRekening?: string;
  namaBank?: string;
  atasNamaRekening?: string;
}

// ── Kampanye Collection ───────────────────────────────────
export type StatusKampanye =
  (typeof STATUS_KAMPANYE)[keyof typeof STATUS_KAMPANYE];

export interface KampanyeDocument extends AppwriteDocument {
  pantiId: string;          // relasi ke panti.$id
  judul: string;
  deskripsi: string;
  targetDana: number;
  terkumpul: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  fotoKampanye?: string;    // fileId di bucket foto-kampanye
  status: StatusKampanye;
  catatanAdmin?: string;
  kategori: string;         // e.g. "pendidikan", "kesehatan", "infrastruktur"
}

// ── Kegiatan Collection ───────────────────────────────────
export interface KegiatanDocument extends AppwriteDocument {
  pantiId: string;
  judul: string;
  deskripsi: string;
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  lokasi: string;
  kapasitasRelawan?: number;
  relawanTerdaftar: string[];  // array of userId
  fotoKegiatan?: string;       // fileId
  status: "upcoming" | "ongoing" | "selesai" | "dibatalkan";
}

// ── Donasi Barang Collection ──────────────────────────────
export type StatusDonasiBarang =
  (typeof STATUS_DONASI_BARANG)[keyof typeof STATUS_DONASI_BARANG];

export interface DonasiBarangDocument extends AppwriteDocument {
  pantiId: string;
  donaturId: string;          // userId pendonor
  namaBarang: string;
  jumlah: number;
  satuan: string;             // e.g. "buah", "kg", "pasang"
  kondisi: "baru" | "bekas_layak";
  catatan?: string;
  fotoBarang?: string;        // fileId
  alamatPenjemputan?: string;
  metodePengiriman: "antar_sendiri" | "dijemput";
  status: StatusDonasiBarang;
  konfirmasiOleh?: string;    // userId panti yang konfirmasi
  konfirmasiAt?: string;
}

// ── Kebutuhan Barang (request dari panti) ─────────────────
export interface KebutuhanBarangDocument extends AppwriteDocument {
  pantiId: string;
  namaBarang: string;
  jumlahDibutuhkan: number;
  jumlahTerpenuhi: number;
  satuan: string;
  prioritas: "rendah" | "sedang" | "tinggi";
  catatan?: string;
  status: "aktif" | "terpenuhi";
}

// ── Donasi Uang Collection ────────────────────────────────
export type StatusDonasiUang =
  (typeof STATUS_DONASI_UANG)[keyof typeof STATUS_DONASI_UANG];

export interface DonasiUangDocument extends AppwriteDocument {
  kampanyeId: string;
  donaturId: string;
  pantiId: string;
  jumlah: number;
  pesan?: string;
  anonymous: boolean;
  // Bukti transfer
  buktiBayar?: string;        // fileId gambar bukti transfer
  namaRekeningPengirim?: string;
  namaBank?: string;
  tanggalTransfer?: string;
  status: StatusDonasiUang;
  konfirmasiOleh?: string;    // userId panti
  konfirmasiAt?: string;
}

// ── Notifikasi Collection ─────────────────────────────────
export type TipeNotifikasi =
  | "verifikasi_panti"
  | "verifikasi_kampanye"
  | "donasi_barang_masuk"
  | "donasi_uang_masuk"
  | "donasi_dikonfirmasi"
  | "kegiatan_baru"
  | "kegiatan_pengingat"
  | "sistem";

export interface NotifikasiDocument extends AppwriteDocument {
  userId: string;             // penerima notifikasi
  judul: string;
  pesan: string;
  tipe: TipeNotifikasi;
  refId?: string;             // ID dokumen terkait (e.g. kampanyeId)
  dibaca: boolean;
  createdAt: string;
}

// ── Helper Types ──────────────────────────────────────────
export type CreateUserPayload = Omit<
  UserDocument,
  keyof AppwriteDocument | "createdAt"
>;

export type CreatePantiPayload = Omit<
  PantiDocument,
  keyof AppwriteDocument | "status" | "terkumpul"
>;

export type CreateKampanyePayload = Omit<
  KampanyeDocument,
  keyof AppwriteDocument | "status" | "terkumpul"
>;
