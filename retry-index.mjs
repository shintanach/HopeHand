import { Client, Databases, DatabasesIndexType } from "node-appwrite";
const client = new Client()
  .setEndpoint("https://sgp.cloud.appwrite.io/v1")
  .setProject("6789")
  .setKey(process.env.APPWRITE_API_KEY);
const db = new Databases(client);

console.log("⏳ Menunggu 3 detik agar attribute status panti siap...");
await new Promise(r => setTimeout(r, 3000));

try {
  await db.createIndex("hopehand-db", "panti", "idx_status", DatabasesIndexType.Key, ["status"], ["ASC"]);
  console.log("✅ index: panti.status berhasil dibuat!");
} catch (e) {
  if (e.code === 409) console.log("⚠️  index sudah ada");
  else console.error("❌", e.message);
}
