/**
 * Patch script — fix attribute status & dibaca yang gagal di run sebelumnya
 * Appwrite tidak boleh required=true + default sekaligus untuk enum/boolean
 */
import { Client, Databases, DatabasesIndexType } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://sgp.cloud.appwrite.io/v1")
  .setProject("6789")
  .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const DB_ID = "hopehand-db";
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function tryPatch(label, fn) {
  try {
    await fn();
    console.log(`  ✅ ${label}`);
  } catch (e) {
    if (e.code === 409) console.log(`  ⚠️  ${label} (sudah ada)`);
    else console.error(`  ❌ ${label}: ${e.message}`);
  }
}

console.log("🔧 Patch: Fix status & dibaca attributes\n");

// ── PANTI: status ─────────────────────────────────────────
console.log("🏠 Patch panti.status");
await tryPatch("attr: status", () =>
  db.createEnumAttribute(DB_ID, "panti", "status",
    ["pending","terverifikasi","ditolak"], false, "pending")
);
await sleep(500);
await tryPatch("index: status", () =>
  db.createIndex(DB_ID, "panti", "idx_status", DatabasesIndexType.Key, ["status"], ["ASC"])
);
await sleep(300);

// ── KAMPANYE: status ──────────────────────────────────────
console.log("\n📢 Patch kampanye.status");
await tryPatch("attr: status", () =>
  db.createEnumAttribute(DB_ID, "kampanye", "status",
    ["draft","menunggu","aktif","selesai","ditolak"], false, "menunggu")
);
await sleep(500);
await tryPatch("index: status", () =>
  db.createIndex(DB_ID, "kampanye", "idx_status", DatabasesIndexType.Key, ["status"], ["ASC"])
);
await sleep(300);

// ── KEGIATAN: status ──────────────────────────────────────
console.log("\n📅 Patch kegiatan.status");
await tryPatch("attr: status", () =>
  db.createEnumAttribute(DB_ID, "kegiatan", "status",
    ["upcoming","ongoing","selesai","dibatalkan"], false, "upcoming")
);
await sleep(500);
await tryPatch("index: status", () =>
  db.createIndex(DB_ID, "kegiatan", "idx_status", DatabasesIndexType.Key, ["status"], ["ASC"])
);
await sleep(300);

// ── DONASI_BARANG: status ─────────────────────────────────
console.log("\n📦 Patch donasi_barang.status");
await tryPatch("attr: status", () =>
  db.createEnumAttribute(DB_ID, "donasi_barang", "status",
    ["menunggu","dikonfirmasi","diterima","ditolak"], false, "menunggu")
);
await sleep(500);
await tryPatch("index: status", () =>
  db.createIndex(DB_ID, "donasi_barang", "idx_status", DatabasesIndexType.Key, ["status"], ["ASC"])
);
await sleep(300);

// ── DONASI_UANG: status ───────────────────────────────────
console.log("\n💸 Patch donasi_uang.status");
await tryPatch("attr: status", () =>
  db.createEnumAttribute(DB_ID, "donasi_uang", "status",
    ["menunggu_konfirmasi","terkonfirmasi","ditolak"], false, "menunggu_konfirmasi")
);
await sleep(500);
await tryPatch("index: status", () =>
  db.createIndex(DB_ID, "donasi_uang", "idx_status", DatabasesIndexType.Key, ["status"], ["ASC"])
);
await sleep(300);

// ── NOTIFIKASI: dibaca ────────────────────────────────────
console.log("\n🔔 Patch notifikasi.dibaca");
await tryPatch("attr: dibaca", () =>
  db.createBooleanAttribute(DB_ID, "notifikasi", "dibaca", false, false)
);
await sleep(500);
await tryPatch("index: dibaca", () =>
  db.createIndex(DB_ID, "notifikasi", "idx_dibaca", DatabasesIndexType.Key, ["dibaca"], ["ASC"])
);

console.log("\n\n✅ Patch selesai!");
