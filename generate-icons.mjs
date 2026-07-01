/**
 * Generate PWA icons dari logo HopeHand (Removal-3.png)
 */
import sharp from "sharp";
import { mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputLogo = path.resolve(__dirname, "src/imports/Removal-3.png");
const outputDir = path.resolve(__dirname, "public/icons");

mkdirSync(outputDir, { recursive: true });

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log("🎨 Generating PWA icons dari logo HopeHand...\n");

for (const size of sizes) {
  const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
  await sharp(inputLogo)
    .resize(size, size, {
      fit: "contain",
      background: { r: 255, g: 248, b: 245, alpha: 1 }, // background cream (#FFF8F5)
    })
    .png()
    .toFile(outputPath);
  console.log(`  ✅ icon-${size}x${size}.png`);
}

// Juga buat favicon.ico (32x32)
await sharp(inputLogo)
  .resize(32, 32, { fit: "contain", background: { r: 255, g: 248, b: 245, alpha: 1 } })
  .png()
  .toFile(path.resolve(__dirname, "public/favicon.png"));
console.log("  ✅ favicon.png");

// Apple touch icon (180x180)
await sharp(inputLogo)
  .resize(180, 180, { fit: "contain", background: { r: 255, g: 248, b: 245, alpha: 1 } })
  .png()
  .toFile(path.resolve(__dirname, "public/apple-touch-icon.png"));
console.log("  ✅ apple-touch-icon.png");

console.log(`\n✅ Semua icons berhasil dibuat di: public/icons/`);
