import { messaging } from "./client";

// ─────────────────────────────────────────────────────────
// Push Notification via Appwrite Messaging
// ─────────────────────────────────────────────────────────
// Appwrite Messaging menggunakan FCM (Firebase Cloud Messaging)
// untuk push notification di web/mobile.

// ─────────────────────────────────────────────────────────
// Daftarkan device token FCM ke Appwrite
// ─────────────────────────────────────────────────────────
export async function registerPushToken(fcmToken: string) {
  try {
    // Cek apakah sudah ada token yang terdaftar
    const targets = await messaging.listSubscriberTargets();
    const alreadyRegistered = targets.targets.some(
      (t) => t.identifier === fcmToken
    );

    if (!alreadyRegistered) {
      // providerId = ID provider FCM yang dibuat di Appwrite Console
      // Ganti "fcm-provider" dengan ID yang kamu buat di console
      await messaging.createSubscriberTarget(
        "fcm-provider",
        fcmToken
      );
    }
  } catch (e) {
    console.warn("Push token registration failed:", e);
  }
}

// ─────────────────────────────────────────────────────────
// Hapus token (saat logout)
// ─────────────────────────────────────────────────────────
export async function unregisterPushToken(targetId: string) {
  try {
    await messaging.deleteSubscriberTarget(targetId);
  } catch (e) {
    console.warn("Push token unregister failed:", e);
  }
}

// ─────────────────────────────────────────────────────────
// NOTE: Pengiriman notifikasi push dari sisi server
// ─────────────────────────────────────────────────────────
// Pengiriman push notification HARUS dilakukan dari server
// (Appwrite Function / backend) menggunakan Server SDK + API Key,
// bukan dari client (browser) karena alasan keamanan.
//
// Cara mengirim dari Appwrite Function:
//
//   const client = new Client()
//     .setEndpoint(endpoint)
//     .setProject(projectId)
//     .setKey(apiKey);  // server key
//
//   const messaging = new Messaging(client);
//   await messaging.createPush(
//     ID.unique(),
//     "Judul Notifikasi",
//     "Isi pesan notifikasi",
//     topics,   // topik target (e.g. ['panti-123'])
//     users,    // atau target user ID spesifik
//     targets,  // atau device token spesifik
//   );
//
// Contoh trigger: setelah admin verifikasi panti, kirim notif ke userId panti.
// ─────────────────────────────────────────────────────────

export { messaging };
