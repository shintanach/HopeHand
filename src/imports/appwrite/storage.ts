import { ID, ImageFormat, ImageGravity, Permission, Role } from "appwrite";
import { storage } from "./client";
import { BUCKETS } from "./config";

// ─────────────────────────────────────────────────────────
// Catatan: Appwrite free plan = 1 bucket
// Semua file (profil, dokumen, kampanye, dll) disimpan di satu bucket: "dokumen-panti"
// ─────────────────────────────────────────────────────────
type BucketKey = keyof typeof BUCKETS;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "pdf"]);

function getFileExtension(fileName: string) {
  const match = fileName.toLowerCase().match(/\.([a-z0-9]+)$/i);
  return match?.[1] ?? "";
}

function getTargetExtension(fileType: string) {
  if (fileType === "image/jpeg") return "jpg";
  if (fileType === "image/png") return "png";
  if (fileType === "image/webp") return "webp";
  if (fileType === "application/pdf") return "pdf";
  return null;
}

function renameFileWithSupportedExtension(file: File, extension: string) {
  const baseName = file.name.replace(/\.[^.]+$/i, "");
  return new File([file], `${baseName}.${extension}`, { type: file.type || "application/octet-stream" });
}

async function convertImageToPng(file: File) {
  const imageUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Format gambar tidak didukung."));
      img.src = imageUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Tidak bisa memproses gambar ini.");
    }

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Gagal mengubah gambar ke format yang didukung."));
        }
      }, "image/png");
    });

    return new File([pngBlob], `${file.name.replace(/\.[^.]+$/i, "")}.png`, { type: "image/png" });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

async function normalizeFileForUpload(file: File) {
  const extension = getFileExtension(file.name).toLowerCase();
  const mimeType = (file.type || "").toLowerCase();

  if (mimeType === "application/pdf" || extension === "pdf") {
    return renameFileWithSupportedExtension(file, "pdf");
  }

  if (ALLOWED_IMAGE_TYPES.has(mimeType) && ALLOWED_EXTENSIONS.has(extension)) {
    return renameFileWithSupportedExtension(file, getTargetExtension(mimeType) ?? extension);
  }

  if (file.type.startsWith("image/")) {
    return convertImageToPng(file);
  }

  throw new Error("Format file tidak didukung. Gunakan JPG, PNG, WebP, atau PDF.");
}

export async function uploadFile(bucketKey: BucketKey, file: File) {
  const bucketId = BUCKETS[bucketKey];
  const fileToUpload = await normalizeFileForUpload(file);

  // Permission.read(Role.any()) agar file bisa diakses via URL preview publik
  const result = await storage.createFile(bucketId, ID.unique(), fileToUpload, [
    Permission.read(Role.any()),
  ]);
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
