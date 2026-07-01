import { ID, ImageFormat, ImageGravity } from "appwrite";
import { storage } from "./client";
import { BUCKETS } from "./config";

// ─────────────────────────────────────────────────────────
// Catatan: Appwrite free plan = 1 bucket
// Semua file (profil, dokumen, kampanye, dll) disimpan di satu bucket: "dokumen-panti"
// ─────────────────────────────────────────────────────────
type BucketKey = keyof typeof BUCKETS;

export async function uploadFile(bucketKey: BucketKey, file: File) {
  const bucketId = BUCKETS[bucketKey];
  const result = await storage.createFile(bucketId, ID.unique(), file);
  return result;
}

// Get File Preview URL (gambar — returns webp)
export function getFilePreviewUrl(
  bucketKey: BucketKey,
  fileId: string,
  options?: { width?: number; height?: number; quality?: number }
) {
  const bucketId = BUCKETS[bucketKey];
  return storage.getFilePreview(
    bucketId,
    fileId,
    options?.width ?? 800,
    options?.height,
    ImageGravity.Center,
    options?.quality ?? 80,
    0,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    ImageFormat.Webp
  );
}

// Get File View URL (dokumen / download)
export function getFileViewUrl(bucketKey: BucketKey, fileId: string) {
  const bucketId = BUCKETS[bucketKey];
  return storage.getFileView(bucketId, fileId);
}

// Delete File
export async function deleteFile(bucketKey: BucketKey, fileId: string) {
  const bucketId = BUCKETS[bucketKey];
  return await storage.deleteFile(bucketId, fileId);
}

// ─────────────────────────────────────────────────────────
// Helper uploads — semua ke bucket "SEMUA"
// ─────────────────────────────────────────────────────────
export const uploadFotoProfil    = (file: File) => uploadFile("SEMUA", file);
export const uploadDokumenPanti  = (file: File) => uploadFile("SEMUA", file);
export const uploadFotoKampanye  = (file: File) => uploadFile("SEMUA", file);
export const uploadFotoKegiatan  = (file: File) => uploadFile("SEMUA", file);
export const uploadBuktiTransfer = (file: File) => uploadFile("SEMUA", file);

// Shorthand preview & view (langsung pakai bucket default)
export const getPreviewUrl = (fileId: string, width = 800) =>
  getFilePreviewUrl("SEMUA", fileId, { width });

export const getViewUrl = (fileId: string) =>
  getFileViewUrl("SEMUA", fileId);
