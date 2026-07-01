/**
 * HopeHand — Appwrite Setup Script
 * Jalankan: node setup-appwrite.mjs
 *
 * Script ini otomatis membuat:
 *  - Database + 7 Collections + semua Attributes + Indexes
 *  - 4 Storage Buckets
 *  - Permissions untuk setiap collection
 */

import { Client, Databases, Storage, Permission, Role, ID, DatabasesIndexType } from "node-appwrite";

// ─── KONFIGURASI ─────────────────────────────────────────────────────────────
const ENDPOINT   = "https://sgp.cloud.appwrite.io/v1";
const PROJECT_ID = "6789";
const API_KEY    = process.env.APPWRITE_API_KEY; // set via env variable

const DB_ID = "hopehand-db";

const COLLECTIONS = {
  USERS:         "users",
  PANTI:         "panti",
  KAMPANYE:      "kampanye",
  KEGIATAN:      "kegiatan",
  DONASI_BARANG: "donasi_barang",
  DONASI_UANG:   "donasi_uang",
  NOTIFIKASI:    "notifikasi",
};

const BUCKETS = {
  DOKUMEN_PANTI: "dokumen-panti",
  FOTO_UMUM:     "foto-umum",      // kampanye + kegiatan + bukti transfer
  FOTO_PROFIL:   "foto-profil",
  // Catatan: free plan max 3 buckets
};

// ─── CLIENT SETUP ─────────────────────────────────────────────────────────────
if (!API_KEY) {
  console.error("❌  Set APPWRITE_API_KEY environment variable dulu!");
  console.error("    Contoh: $env:APPWRITE_API_KEY='your-api-key'; node setup-appwrite.mjs");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const db      = new Databases(client);
const storage = new Storage(client);

// ─── HELPER ───────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function tryCreate(label, fn) {
  try {
    const result = await fn();
    console.log(`  ✅ ${label}`);
    return result;
  } catch (e) {
    if (e.code === 409) {
      console.log(`  ⚠️  ${label} (sudah ada, skip)`);
    } else {
      console.error(`  ❌ ${label}: ${e.message}`);
    }
  }
}

// ─── 1. DATABASE ──────────────────────────────────────────────────────────────
async function verifyDatabase() {
  console.log(`\n📦 Verifikasi Database '${DB_ID}'...`);
  try {
    await db.get(DB_ID);
    console.log(`  ✅ Database '${DB_ID}' ditemukan!`);
  } catch (e) {
    if (e.code === 404) {
      console.error(`\n  ❌ Database '${DB_ID}' tidak ditemukan!`);
      console.error(`\n  👉 Buat database manual di Appwrite Console:`);
      console.error(`     1. Buka: https://cloud.appwrite.io → Project HopeHand`);
      console.error(`     2. Klik "Databases" di sidebar`);
      console.error(`     3. Klik "Create database"`);
      console.error(`     4. Name: "HopeHand DB"  |  Database ID: "hopehand-db"`);
      console.error(`     5. Klik "Create" lalu jalankan script ini lagi`);
      throw new Error("Database belum dibuat. Ikuti instruksi di atas.");
    } else {
      throw e;
    }
  }
}


// ─── 2. COLLECTIONS ───────────────────────────────────────────────────────────

// USERS
async function createUsersCollection() {
  console.log("\n👥 Collection: users");
  await tryCreate("Collection users", () =>
    db.createCollection(DB_ID, COLLECTIONS.USERS, "Users", [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
    ])
  );
  await sleep(300);

  const attrs = [
    ["userId",     () => db.createStringAttribute(DB_ID, COLLECTIONS.USERS, "userId",     36,  true)],
    ["nama",       () => db.createStringAttribute(DB_ID, COLLECTIONS.USERS, "nama",       255, true)],
    ["email",      () => db.createEmailAttribute( DB_ID, COLLECTIONS.USERS, "email",           true)],
    ["role",       () => db.createEnumAttribute(  DB_ID, COLLECTIONS.USERS, "role",       ["relawan","panti","admin"], true)],
    ["fotoProfil", () => db.createStringAttribute(DB_ID, COLLECTIONS.USERS, "fotoProfil", 36,  false)],
    ["telepon",    () => db.createStringAttribute(DB_ID, COLLECTIONS.USERS, "telepon",    20,  false)],
    ["alamat",     () => db.createStringAttribute(DB_ID, COLLECTIONS.USERS, "alamat",     500, false)],
    ["createdAt",  () => db.createDatetimeAttribute(DB_ID, COLLECTIONS.USERS, "createdAt",     true)],
  ];

  for (const [name, fn] of attrs) {
    await tryCreate(`  attr: ${name}`, fn);
    await sleep(200);
  }

  // Index
  await tryCreate("index: userId", () =>
    db.createIndex(DB_ID, COLLECTIONS.USERS, "idx_userId", DatabasesIndexType.Key, ["userId"], ["ASC"])
  );
}

// PANTI
async function createPantiCollection() {
  console.log("\n🏠 Collection: panti");
  await tryCreate("Collection panti", () =>
    db.createCollection(DB_ID, COLLECTIONS.PANTI, "Panti", [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ])
  );
  await sleep(300);

  const attrs = [
    ["userId",             () => db.createStringAttribute(  DB_ID, COLLECTIONS.PANTI, "userId",             36,   true)],
    ["namaPanti",          () => db.createStringAttribute(  DB_ID, COLLECTIONS.PANTI, "namaPanti",          255,  true)],
    ["alamat",             () => db.createStringAttribute(  DB_ID, COLLECTIONS.PANTI, "alamat",             500,  true)],
    ["kota",               () => db.createStringAttribute(  DB_ID, COLLECTIONS.PANTI, "kota",               100,  false)],
    ["provinsi",           () => db.createStringAttribute(  DB_ID, COLLECTIONS.PANTI, "provinsi",           100,  false)],
    ["telepon",            () => db.createStringAttribute(  DB_ID, COLLECTIONS.PANTI, "telepon",            20,   true)],
    ["email",              () => db.createEmailAttribute(   DB_ID, COLLECTIONS.PANTI, "email",                    true)],
    ["deskripsi",          () => db.createStringAttribute(  DB_ID, COLLECTIONS.PANTI, "deskripsi",          2000, false)],
    ["jumlahAnak",         () => db.createIntegerAttribute( DB_ID, COLLECTIONS.PANTI, "jumlahAnak",               false)],
    ["namaKetua",          () => db.createStringAttribute(  DB_ID, COLLECTIONS.PANTI, "namaKetua",          255,  false)],
    ["dokumenAkte",        () => db.createStringAttribute(  DB_ID, COLLECTIONS.PANTI, "dokumenAkte",        36,   false)],
    ["dokumenKTP",         () => db.createStringAttribute(  DB_ID, COLLECTIONS.PANTI, "dokumenKTP",         36,   false)],
    ["dokumenSuratIzin",   () => db.createStringAttribute(  DB_ID, COLLECTIONS.PANTI, "dokumenSuratIzin",   36,   false)],
    ["fotoPanti",          () => db.createStringAttribute(  DB_ID, COLLECTIONS.PANTI, "fotoPanti",          36,   false)],
    ["status",             () => db.createEnumAttribute(    DB_ID, COLLECTIONS.PANTI, "status", ["pending","terverifikasi","ditolak"], true, "pending")],
    ["catatanAdmin",       () => db.createStringAttribute(  DB_ID, COLLECTIONS.PANTI, "catatanAdmin",       1000, false)],
    ["verifiedAt",         () => db.createDatetimeAttribute(DB_ID, COLLECTIONS.PANTI, "verifiedAt",               false)],
    ["noRekening",         () => db.createStringAttribute(  DB_ID, COLLECTIONS.PANTI, "noRekening",         50,   false)],
    ["namaBank",           () => db.createStringAttribute(  DB_ID, COLLECTIONS.PANTI, "namaBank",           100,  false)],
    ["atasNamaRekening",   () => db.createStringAttribute(  DB_ID, COLLECTIONS.PANTI, "atasNamaRekening",   255,  false)],
  ];

  for (const [name, fn] of attrs) {
    await tryCreate(`  attr: ${name}`, fn);
    await sleep(200);
  }

  await tryCreate("index: userId",     () => db.createIndex(DB_ID, COLLECTIONS.PANTI, "idx_userId",     DatabasesIndexType.Key,      ["userId"],  ["ASC"]));
  await sleep(200);
  await tryCreate("index: status",     () => db.createIndex(DB_ID, COLLECTIONS.PANTI, "idx_status",     DatabasesIndexType.Key,      ["status"],  ["ASC"]));
  await sleep(200);
  await tryCreate("index: namaPanti",  () => db.createIndex(DB_ID, COLLECTIONS.PANTI, "idx_namaPanti",  DatabasesIndexType.Fulltext,  ["namaPanti"]));
}

// KAMPANYE
async function createKampanyeCollection() {
  console.log("\n📢 Collection: kampanye");
  await tryCreate("Collection kampanye", () =>
    db.createCollection(DB_ID, COLLECTIONS.KAMPANYE, "Kampanye", [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ])
  );
  await sleep(300);

  const attrs = [
    ["pantiId",       () => db.createStringAttribute(  DB_ID, COLLECTIONS.KAMPANYE, "pantiId",       36,   true)],
    ["judul",         () => db.createStringAttribute(  DB_ID, COLLECTIONS.KAMPANYE, "judul",         255,  true)],
    ["deskripsi",     () => db.createStringAttribute(  DB_ID, COLLECTIONS.KAMPANYE, "deskripsi",     5000, false)],
    ["targetDana",    () => db.createFloatAttribute(   DB_ID, COLLECTIONS.KAMPANYE, "targetDana",          true)],
    ["terkumpul",     () => db.createFloatAttribute(   DB_ID, COLLECTIONS.KAMPANYE, "terkumpul",           false, 0)],
    ["tanggalMulai",  () => db.createDatetimeAttribute(DB_ID, COLLECTIONS.KAMPANYE, "tanggalMulai",        true)],
    ["tanggalSelesai",() => db.createDatetimeAttribute(DB_ID, COLLECTIONS.KAMPANYE, "tanggalSelesai",      true)],
    ["fotoKampanye",  () => db.createStringAttribute(  DB_ID, COLLECTIONS.KAMPANYE, "fotoKampanye",  36,   false)],
    ["status",        () => db.createEnumAttribute(    DB_ID, COLLECTIONS.KAMPANYE, "status", ["draft","menunggu","aktif","selesai","ditolak"], true, "menunggu")],
    ["catatanAdmin",  () => db.createStringAttribute(  DB_ID, COLLECTIONS.KAMPANYE, "catatanAdmin",  1000, false)],
    ["kategori",      () => db.createStringAttribute(  DB_ID, COLLECTIONS.KAMPANYE, "kategori",      100,  false)],
  ];

  for (const [name, fn] of attrs) {
    await tryCreate(`  attr: ${name}`, fn);
    await sleep(200);
  }

  await tryCreate("index: pantiId", () => db.createIndex(DB_ID, COLLECTIONS.KAMPANYE, "idx_pantiId", DatabasesIndexType.Key,     ["pantiId"], ["ASC"]));
  await sleep(200);
  await tryCreate("index: status",  () => db.createIndex(DB_ID, COLLECTIONS.KAMPANYE, "idx_status",  DatabasesIndexType.Key,     ["status"],  ["ASC"]));
  await sleep(200);
  await tryCreate("index: judul",   () => db.createIndex(DB_ID, COLLECTIONS.KAMPANYE, "idx_judul",   DatabasesIndexType.Fulltext, ["judul"]));
}

// KEGIATAN
async function createKegiatanCollection() {
  console.log("\n📅 Collection: kegiatan");
  await tryCreate("Collection kegiatan", () =>
    db.createCollection(DB_ID, COLLECTIONS.KEGIATAN, "Kegiatan", [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ])
  );
  await sleep(300);

  const attrs = [
    ["pantiId",           () => db.createStringAttribute(  DB_ID, COLLECTIONS.KEGIATAN, "pantiId",           36,   true)],
    ["judul",             () => db.createStringAttribute(  DB_ID, COLLECTIONS.KEGIATAN, "judul",             255,  true)],
    ["deskripsi",         () => db.createStringAttribute(  DB_ID, COLLECTIONS.KEGIATAN, "deskripsi",         3000, false)],
    ["tanggal",           () => db.createDatetimeAttribute(DB_ID, COLLECTIONS.KEGIATAN, "tanggal",                 true)],
    ["waktuMulai",        () => db.createStringAttribute(  DB_ID, COLLECTIONS.KEGIATAN, "waktuMulai",        10,   false)],
    ["waktuSelesai",      () => db.createStringAttribute(  DB_ID, COLLECTIONS.KEGIATAN, "waktuSelesai",      10,   false)],
    ["lokasi",            () => db.createStringAttribute(  DB_ID, COLLECTIONS.KEGIATAN, "lokasi",            500,  false)],
    ["kapasitasRelawan",  () => db.createIntegerAttribute( DB_ID, COLLECTIONS.KEGIATAN, "kapasitasRelawan",        false)],
    ["relawanTerdaftar",  () => db.createStringAttribute(  DB_ID, COLLECTIONS.KEGIATAN, "relawanTerdaftar",  36,   false, null, true)],
    ["fotoKegiatan",      () => db.createStringAttribute(  DB_ID, COLLECTIONS.KEGIATAN, "fotoKegiatan",      36,   false)],
    ["status",            () => db.createEnumAttribute(    DB_ID, COLLECTIONS.KEGIATAN, "status", ["upcoming","ongoing","selesai","dibatalkan"], true, "upcoming")],
  ];

  for (const [name, fn] of attrs) {
    await tryCreate(`  attr: ${name}`, fn);
    await sleep(200);
  }

  await tryCreate("index: pantiId", () => db.createIndex(DB_ID, COLLECTIONS.KEGIATAN, "idx_pantiId", DatabasesIndexType.Key, ["pantiId"], ["ASC"]));
  await sleep(200);
  await tryCreate("index: status",  () => db.createIndex(DB_ID, COLLECTIONS.KEGIATAN, "idx_status",  DatabasesIndexType.Key, ["status"],  ["ASC"]));
  await sleep(200);
  await tryCreate("index: tanggal", () => db.createIndex(DB_ID, COLLECTIONS.KEGIATAN, "idx_tanggal", DatabasesIndexType.Key, ["tanggal"], ["ASC"]));
}

// DONASI BARANG
async function createDonasiBarangCollection() {
  console.log("\n📦 Collection: donasi_barang");
  await tryCreate("Collection donasi_barang", () =>
    db.createCollection(DB_ID, COLLECTIONS.DONASI_BARANG, "Donasi Barang", [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
    ])
  );
  await sleep(300);

  const attrs = [
    ["pantiId",            () => db.createStringAttribute(  DB_ID, COLLECTIONS.DONASI_BARANG, "pantiId",            36,   true)],
    ["donaturId",          () => db.createStringAttribute(  DB_ID, COLLECTIONS.DONASI_BARANG, "donaturId",          36,   true)],
    ["namaBarang",         () => db.createStringAttribute(  DB_ID, COLLECTIONS.DONASI_BARANG, "namaBarang",         255,  true)],
    ["jumlah",             () => db.createIntegerAttribute( DB_ID, COLLECTIONS.DONASI_BARANG, "jumlah",                   true)],
    ["satuan",             () => db.createStringAttribute(  DB_ID, COLLECTIONS.DONASI_BARANG, "satuan",             50,   true)],
    ["kondisi",            () => db.createEnumAttribute(    DB_ID, COLLECTIONS.DONASI_BARANG, "kondisi", ["baru","bekas_layak"], true)],
    ["catatan",            () => db.createStringAttribute(  DB_ID, COLLECTIONS.DONASI_BARANG, "catatan",            1000, false)],
    ["fotoBarang",         () => db.createStringAttribute(  DB_ID, COLLECTIONS.DONASI_BARANG, "fotoBarang",         36,   false)],
    ["alamatPenjemputan",  () => db.createStringAttribute(  DB_ID, COLLECTIONS.DONASI_BARANG, "alamatPenjemputan",  500,  false)],
    ["metodePengiriman",   () => db.createEnumAttribute(    DB_ID, COLLECTIONS.DONASI_BARANG, "metodePengiriman", ["antar_sendiri","dijemput"], true)],
    ["status",             () => db.createEnumAttribute(    DB_ID, COLLECTIONS.DONASI_BARANG, "status", ["menunggu","dikonfirmasi","diterima","ditolak"], true, "menunggu")],
    ["konfirmasiOleh",     () => db.createStringAttribute(  DB_ID, COLLECTIONS.DONASI_BARANG, "konfirmasiOleh",     36,   false)],
    ["konfirmasiAt",       () => db.createDatetimeAttribute(DB_ID, COLLECTIONS.DONASI_BARANG, "konfirmasiAt",             false)],
  ];

  for (const [name, fn] of attrs) {
    await tryCreate(`  attr: ${name}`, fn);
    await sleep(200);
  }

  await tryCreate("index: pantiId",   () => db.createIndex(DB_ID, COLLECTIONS.DONASI_BARANG, "idx_pantiId",   DatabasesIndexType.Key, ["pantiId"],   ["ASC"]));
  await sleep(200);
  await tryCreate("index: donaturId", () => db.createIndex(DB_ID, COLLECTIONS.DONASI_BARANG, "idx_donaturId", DatabasesIndexType.Key, ["donaturId"], ["ASC"]));
  await sleep(200);
  await tryCreate("index: status",    () => db.createIndex(DB_ID, COLLECTIONS.DONASI_BARANG, "idx_status",    DatabasesIndexType.Key, ["status"],    ["ASC"]));
}

// DONASI UANG
async function createDonasiUangCollection() {
  console.log("\n💸 Collection: donasi_uang");
  await tryCreate("Collection donasi_uang", () =>
    db.createCollection(DB_ID, COLLECTIONS.DONASI_UANG, "Donasi Uang", [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
    ])
  );
  await sleep(300);

  const attrs = [
    ["kampanyeId",            () => db.createStringAttribute(  DB_ID, COLLECTIONS.DONASI_UANG, "kampanyeId",            36,   true)],
    ["donaturId",             () => db.createStringAttribute(  DB_ID, COLLECTIONS.DONASI_UANG, "donaturId",             36,   true)],
    ["pantiId",               () => db.createStringAttribute(  DB_ID, COLLECTIONS.DONASI_UANG, "pantiId",               36,   true)],
    ["jumlah",                () => db.createFloatAttribute(   DB_ID, COLLECTIONS.DONASI_UANG, "jumlah",                      true)],
    ["pesan",                 () => db.createStringAttribute(  DB_ID, COLLECTIONS.DONASI_UANG, "pesan",                 500,  false)],
    ["anonymous",             () => db.createBooleanAttribute( DB_ID, COLLECTIONS.DONASI_UANG, "anonymous",                   false, false)],
    ["buktiBayar",            () => db.createStringAttribute(  DB_ID, COLLECTIONS.DONASI_UANG, "buktiBayar",            36,   false)],
    ["namaRekeningPengirim",  () => db.createStringAttribute(  DB_ID, COLLECTIONS.DONASI_UANG, "namaRekeningPengirim",  255,  false)],
    ["namaBank",              () => db.createStringAttribute(  DB_ID, COLLECTIONS.DONASI_UANG, "namaBank",              100,  false)],
    ["tanggalTransfer",       () => db.createDatetimeAttribute(DB_ID, COLLECTIONS.DONASI_UANG, "tanggalTransfer",             false)],
    ["status",                () => db.createEnumAttribute(    DB_ID, COLLECTIONS.DONASI_UANG, "status", ["menunggu_konfirmasi","terkonfirmasi","ditolak"], true, "menunggu_konfirmasi")],
    ["konfirmasiOleh",        () => db.createStringAttribute(  DB_ID, COLLECTIONS.DONASI_UANG, "konfirmasiOleh",        36,   false)],
    ["konfirmasiAt",          () => db.createDatetimeAttribute(DB_ID, COLLECTIONS.DONASI_UANG, "konfirmasiAt",                false)],
  ];

  for (const [name, fn] of attrs) {
    await tryCreate(`  attr: ${name}`, fn);
    await sleep(200);
  }

  await tryCreate("index: kampanyeId", () => db.createIndex(DB_ID, COLLECTIONS.DONASI_UANG, "idx_kampanyeId", DatabasesIndexType.Key, ["kampanyeId"], ["ASC"]));
  await sleep(200);
  await tryCreate("index: donaturId",  () => db.createIndex(DB_ID, COLLECTIONS.DONASI_UANG, "idx_donaturId",  DatabasesIndexType.Key, ["donaturId"],  ["ASC"]));
  await sleep(200);
  await tryCreate("index: pantiId",    () => db.createIndex(DB_ID, COLLECTIONS.DONASI_UANG, "idx_pantiId",    DatabasesIndexType.Key, ["pantiId"],    ["ASC"]));
  await sleep(200);
  await tryCreate("index: status",     () => db.createIndex(DB_ID, COLLECTIONS.DONASI_UANG, "idx_status",     DatabasesIndexType.Key, ["status"],     ["ASC"]));
}

// NOTIFIKASI
async function createNotifikasiCollection() {
  console.log("\n🔔 Collection: notifikasi");
  await tryCreate("Collection notifikasi", () =>
    db.createCollection(DB_ID, COLLECTIONS.NOTIFIKASI, "Notifikasi", [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ])
  );
  await sleep(300);

  const TIPE_VALUES = ["verifikasi_panti","verifikasi_kampanye","donasi_barang_masuk","donasi_uang_masuk","donasi_dikonfirmasi","kegiatan_baru","kegiatan_pengingat","sistem"];

  const attrs = [
    ["userId",    () => db.createStringAttribute(  DB_ID, COLLECTIONS.NOTIFIKASI, "userId",    36,   true)],
    ["judul",     () => db.createStringAttribute(  DB_ID, COLLECTIONS.NOTIFIKASI, "judul",     255,  true)],
    ["pesan",     () => db.createStringAttribute(  DB_ID, COLLECTIONS.NOTIFIKASI, "pesan",     1000, true)],
    ["tipe",      () => db.createEnumAttribute(    DB_ID, COLLECTIONS.NOTIFIKASI, "tipe",      TIPE_VALUES, true)],
    ["refId",     () => db.createStringAttribute(  DB_ID, COLLECTIONS.NOTIFIKASI, "refId",     36,   false)],
    ["dibaca",    () => db.createBooleanAttribute( DB_ID, COLLECTIONS.NOTIFIKASI, "dibaca",          true, false)],
    ["createdAt", () => db.createDatetimeAttribute(DB_ID, COLLECTIONS.NOTIFIKASI, "createdAt",       true)],
  ];

  for (const [name, fn] of attrs) {
    await tryCreate(`  attr: ${name}`, fn);
    await sleep(200);
  }

  await tryCreate("index: userId", () => db.createIndex(DB_ID, COLLECTIONS.NOTIFIKASI, "idx_userId", DatabasesIndexType.Key, ["userId"], ["ASC"]));
  await sleep(200);
  await tryCreate("index: dibaca", () => db.createIndex(DB_ID, COLLECTIONS.NOTIFIKASI, "idx_dibaca", DatabasesIndexType.Key, ["dibaca"], ["ASC"]));
}

// ─── 3. STORAGE BUCKETS ───────────────────────────────────────────────────────
async function createBuckets() {
  console.log("\n🪣 Membuat Storage Buckets (max 3 — free plan)...");

  const buckets = [
    {
      id:      BUCKETS.DOKUMEN_PANTI,
      name:    "Dokumen Panti",
      perms:   [Permission.read(Role.users()), Permission.create(Role.users()), Permission.delete(Role.users())],
      types:   ["image/jpeg","image/png","image/webp","application/pdf"],
      maxSize: 10 * 1024 * 1024, // 10 MB
    },
    {
      id:      BUCKETS.FOTO_UMUM,
      name:    "Foto Umum (Kampanye, Kegiatan, Bukti Transfer)",
      perms:   [Permission.read(Role.any()), Permission.create(Role.users()), Permission.delete(Role.users())],
      types:   ["image/jpeg","image/png","image/webp"],
      maxSize: 5 * 1024 * 1024, // 5 MB
    },
    {
      id:      BUCKETS.FOTO_PROFIL,
      name:    "Foto Profil",
      perms:   [Permission.read(Role.any()), Permission.create(Role.users()), Permission.update(Role.users()), Permission.delete(Role.users())],
      types:   ["image/jpeg","image/png","image/webp"],
      maxSize: 3 * 1024 * 1024, // 3 MB
    },
  ];

  for (const b of buckets) {
    await tryCreate(`Bucket: ${b.id}`, () =>
      storage.createBucket(b.id, b.name, b.perms, false, true, b.maxSize, b.types, "gzip", true)
    );
    await sleep(300);
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 HopeHand — Appwrite Setup Script");
  console.log("====================================");
  console.log(`   Endpoint:   ${ENDPOINT}`);
  console.log(`   Project ID: ${PROJECT_ID}`);
  console.log(`   Database:   ${DB_ID}`);

  try {
    await verifyDatabase();
    await createUsersCollection();
    await createPantiCollection();
    await createKampanyeCollection();
    await createKegiatanCollection();
    await createDonasiBarangCollection();
    await createDonasiUangCollection();
    await createNotifikasiCollection();
    await createBuckets();

    console.log("\n\n✅ SELESAI! Semua resource Appwrite berhasil dibuat.");
    console.log("   Sekarang aktifkan Auth (Email/Password + Google) di Appwrite Console.");
  } catch (e) {
    console.error("\n❌ Error:", e.message);
    process.exit(1);
  }
}

main();
