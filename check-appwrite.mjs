// Script diagnostik — cek apa yang sudah ada di Appwrite project
import { Client, Databases, Storage } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://sgp.cloud.appwrite.io/v1")
  .setProject("6789")
  .setKey(process.env.APPWRITE_API_KEY);

const db      = new Databases(client);
const storage = new Storage(client);

console.log("🔍 Cek Database yang ada...");
try {
  const dbs = await db.list();
  console.log(`  Total databases: ${dbs.total}`);
  dbs.databases.forEach(d => {
    console.log(`  - ID: "${d.$id}"  Name: "${d.name}"`);
  });
} catch (e) {
  console.error("  Error:", e.message);
}

console.log("\n🔍 Cek Storage Buckets yang ada...");
try {
  const bkts = await storage.listBuckets();
  console.log(`  Total buckets: ${bkts.total}`);
  bkts.buckets.forEach(b => {
    console.log(`  - ID: "${b.$id}"  Name: "${b.name}"`);
  });
} catch (e) {
  console.error("  Error:", e.message);
}
