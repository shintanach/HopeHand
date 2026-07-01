import { ID, AppwriteException } from "appwrite";
import { account, databases } from "./client";
import { DB_ID, COLLECTIONS, ROLES, STATUS_PANTI } from "./config";
import type { UserDocument, PantiDocument } from "./types";

// ─────────────────────────────────────────────────────────
// Register Relawan
// ─────────────────────────────────────────────────────────
export interface RegisterRelawanPayload {
  nama: string;
  email: string;
  password: string;
  telepon?: string;
  alamat?: string;
}

export async function registerRelawan(payload: RegisterRelawanPayload) {
  const userId = ID.unique();

  // 1. Buat akun Appwrite
  await account.create(userId, payload.email, payload.password, payload.nama);

  // 2. Login otomatis agar bisa buat session
  await account.createEmailPasswordSession(payload.email, payload.password);

  // 3. Kirim email verifikasi
  await account.createVerification(
    `${window.location.origin}/email-verification`
  );

  // 4. Simpan profil di collection users
  const userDoc = await databases.createDocument<UserDocument>(
    DB_ID,
    COLLECTIONS.USERS,
    userId,
    {
      userId,
      nama: payload.nama,
      email: payload.email,
      role: ROLES.RELAWAN,
      telepon: payload.telepon ?? null,
      alamat: payload.alamat ?? null,
      createdAt: new Date().toISOString(),
    }
  );

  return userDoc;
}

// ─────────────────────────────────────────────────────────
// Register Panti
// ─────────────────────────────────────────────────────────
export interface RegisterPantiPayload {
  // Akun
  email: string;
  password: string;
  // Data panti
  namaPanti: string;
  namaKetua: string;
  alamat: string;
  kota: string;
  provinsi: string;
  telepon: string;
  deskripsi: string;
  jumlahAnak: number;
  noRekening?: string;
  namaBank?: string;
  atasNamaRekening?: string;
  // fileIds (sudah di-upload duluan ke Storage)
  dokumenAkte?: string;
  dokumenKTP?: string;
  dokumenSuratIzin?: string;
  fotoPanti?: string;
}

export async function registerPanti(payload: RegisterPantiPayload) {
  const userId = ID.unique();

  // 1. Buat akun Appwrite
  await account.create(userId, payload.email, payload.password, payload.namaPanti);

  // 2. Login & kirim verifikasi email
  await account.createEmailPasswordSession(payload.email, payload.password);
  await account.createVerification(
    `${window.location.origin}/email-verification`
  );

  // 3. Simpan user
  await databases.createDocument<UserDocument>(
    DB_ID,
    COLLECTIONS.USERS,
    userId,
    {
      userId,
      nama: payload.namaPanti,
      email: payload.email,
      role: ROLES.PANTI,
      createdAt: new Date().toISOString(),
    }
  );

  // 4. Simpan profil panti (status: pending — menunggu verifikasi admin)
  const pantiDoc = await databases.createDocument<PantiDocument>(
    DB_ID,
    COLLECTIONS.PANTI,
    ID.unique(),
    {
      userId,
      namaPanti: payload.namaPanti,
      namaKetua: payload.namaKetua,
      alamat: payload.alamat,
      kota: payload.kota,
      provinsi: payload.provinsi,
      telepon: payload.telepon,
      email: payload.email,
      deskripsi: payload.deskripsi,
      jumlahAnak: payload.jumlahAnak,
      noRekening: payload.noRekening ?? null,
      namaBank: payload.namaBank ?? null,
      atasNamaRekening: payload.atasNamaRekening ?? null,
      dokumenAkte: payload.dokumenAkte ?? null,
      dokumenKTP: payload.dokumenKTP ?? null,
      dokumenSuratIzin: payload.dokumenSuratIzin ?? null,
      fotoPanti: payload.fotoPanti ?? null,
      status: STATUS_PANTI.PENDING,
    }
  );

  return pantiDoc;
}

// ─────────────────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────────────────
export async function login(email: string, password: string) {
  const session = await account.createEmailPasswordSession(email, password);
  return session;
}

// ─────────────────────────────────────────────────────────
// Login dengan Google
// ─────────────────────────────────────────────────────────
export function loginWithGoogle() {
  account.createOAuth2Session(
    "google",
    `${window.location.origin}/relawan/home`,
    `${window.location.origin}/login`
  );
}

// ─────────────────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────────────────
export async function logout() {
  await account.deleteSession("current");
}

// ─────────────────────────────────────────────────────────
// Get Current User + Profile
// ─────────────────────────────────────────────────────────
export async function getCurrentUser() {
  try {
    const authUser = await account.get();

    // Ambil dokumen profil dari collection users
    const userDoc = await databases.getDocument<UserDocument>(
      DB_ID,
      COLLECTIONS.USERS,
      authUser.$id
    );

    return { authUser, userDoc };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────
// Cek apakah ada sesi aktif
// ─────────────────────────────────────────────────────────
export async function checkSession(): Promise<boolean> {
  try {
    await account.getSession("current");
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────
// Verifikasi Email (dipanggil di halaman /email-verification)
// ─────────────────────────────────────────────────────────
export async function verifyEmail(userId: string, secret: string) {
  return await account.updateVerification(userId, secret);
}

// ─────────────────────────────────────────────────────────
// Kirim ulang verifikasi email
// ─────────────────────────────────────────────────────────
export async function resendVerification() {
  return await account.createVerification(
    `${window.location.origin}/email-verification`
  );
}

// ─────────────────────────────────────────────────────────
// Reset Password
// ─────────────────────────────────────────────────────────
export async function sendPasswordReset(email: string) {
  return await account.createRecovery(
    email,
    `${window.location.origin}/reset-password`
  );
}

export async function confirmPasswordReset(
  userId: string,
  secret: string,
  newPassword: string
) {
  return await account.updateRecovery(userId, secret, newPassword);
}

// ─────────────────────────────────────────────────────────
// Error Helper
// ─────────────────────────────────────────────────────────
export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AppwriteException) {
    switch (error.code) {
      case 401:
        return "Email atau password salah.";
      case 409:
        return "Email sudah terdaftar. Silakan login.";
      case 429:
        return "Terlalu banyak percobaan. Coba lagi beberapa saat.";
      default:
        return error.message;
    }
  }
  return "Terjadi kesalahan. Silakan coba lagi.";
}
