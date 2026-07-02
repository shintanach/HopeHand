import { ID, AppwriteException, Client, Account, Databases } from "appwrite";
import { account, databases } from "./client";
import type { UserDocument, PantiDocument } from "./types";
import { DB_ID, COLLECTIONS, ROLES, STATUS_PANTI, APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "./config";
import { getPendingRole, clearPendingRole } from "./roleStorage";

// ─────────────────────────────────────────────────────────
// Register Relawan
// ─────────────────────────────────────────────────────────
export interface RegisterRelawanPayload {
  nama: string;
  email: string;
  password: string;
  telepon?: string;
  alamat?: string;
  fotoProfil?: string;
}

export async function registerRelawan(payload: RegisterRelawanPayload) {
  const userId = ID.unique();

  // 1. Buat akun Appwrite
  await account.create(userId, payload.email, payload.password, payload.nama);

  // 2. Login otomatis agar bisa buat session
  await account.createEmailPasswordSession(payload.email, payload.password);

  // 3. Kirim email verifikasi (non-fatal — lanjut walau gagal)
  try {
    await account.createVerification(
      `${window.location.origin}/email-verification`
    );
  } catch {
    // Verifikasi email gagal dikirim, tapi akun sudah dibuat — abaikan
    console.warn("Gagal mengirim email verifikasi, abaikan.");
  }

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
      fotoProfil: payload.fotoProfil ?? null,
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
  let userId = ID.unique();
  const endpoint = APPWRITE_ENDPOINT;
  const projectId = APPWRITE_PROJECT_ID;

  // Cek apakah user sudah ter-autentikasi (misalnya login via Google)
  const currentUser = await getCurrentUser();
  const isAlreadyAuthenticated = !!currentUser?.authUser;

  if (isAlreadyAuthenticated) {
    userId = currentUser.authUser.$id;
  } else {
    // Helper: Appwrite REST request tanpa cookie (unauthenticated = guests role)
    // Hanya digunakan untuk membuat akun auth (/account) karena Appwrite melarang
    // membuat akun baru jika sudah ada sesi aktif (admin sedang login).
    const guestFetch = async (path: string, body: object) => {
      const res = await fetch(`${endpoint}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": projectId,
        },
        credentials: "omit",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Pendaftaran gagal");
      }
      return data;
    };

    // 1. Buat akun Appwrite sebagai Guest (tanpa cookie admin)
    await guestFetch("/account", {
      userId,
      email: payload.email,
      password: payload.password,
      name: payload.namaPanti,
    });
  }

  // 2. Simpan profil user di collection users menggunakan client bawaan (dengan sesi admin/users atau sesi user baru jika OAuth)
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

  // 3. Simpan profil panti (status: pending — menunggu verifikasi admin) menggunakan client bawaan
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
export async function login(email: string, password: string) {
  try {
    await account.deleteSession("current");
  } catch {
    // Abaikan jika memang tidak ada sesi aktif
  }
  const session = await account.createEmailPasswordSession(email, password);
  return session;
}

// ─────────────────────────────────────────────────────────
// Login dengan Google
// ─────────────────────────────────────────────────────────
export function loginWithGoogle() {
  // Redirect to the generic login page after successful Google OAuth.
  // The LoginScreen component will handle role‑based navigation based on the pending role.
  account.createOAuth2Session(
    "google",
    `${window.location.origin}/login`,
    `${window.location.origin}/login`
  );
}

// ─────────────────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────────────────
export async function logout() {
  try {
    await account.deleteSession("current");
  } catch {
    // ignore if no session or deletion fails
  }

  if (typeof document !== "undefined") {
    document.cookie.split("; ").forEach((cookie) => {
      const name = cookie.split("=")[0];
      if (name.startsWith("a_session_")) {
        document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    });
    try {
      localStorage.removeItem("appwrite:account");
    } catch {
      // ignore storage errors
    }
  }
}

// ─────────────────────────────────────────────────────────
// Get Current User + Profile
// ─────────────────────────────────────────────────────────
export async function getCurrentUser() {
  try {
    const authUser = await account.get();

    try {
      // Ambil dokumen profil dari collection users
      const userDoc = await databases.getDocument<UserDocument>(
        DB_ID,
        COLLECTIONS.USERS,
        authUser.$id
      );

      return { authUser, userDoc };
    } catch {
      return { authUser, userDoc: null };
    }
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
    // DEBUG SEMENTARA — hapus setelah masalah ditemukan
    console.error("[Appwrite Error]", { code: error.code, type: error.type, message: error.message });

    switch (error.code) {
      case 401:
        if (error.type === "user_email_not_verified") {
          return "Email belum diverifikasi. Silakan cek inbox email Anda dan klik link verifikasi.";
        }
        // Tampilkan detail untuk debug
        return `[Debug] code:${error.code} type:${error.type} — ${error.message}`;
      case 409:
        return "Email sudah terdaftar. Silakan login.";
      case 429:
        return "Terlalu banyak percobaan. Coba lagi beberapa saat.";
      default:
        return `[Debug] code:${error.code} type:${error.type} — ${error.message}`;
    }
  }
  return "Terjadi kesalahan. Silakan coba lagi.";
}
