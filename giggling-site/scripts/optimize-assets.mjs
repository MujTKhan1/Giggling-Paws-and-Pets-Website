// Converts the provided Pet Parade product photos into web-sized WebP files
// and crops a static hero fallback from the approved concept illustration.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.resolve(root, "..", "pet-parade-products");
const out = path.resolve(root, "public", "products");

// slug -> storefront file (default state) and lifestyle file (hover/focus state)
const products = {
  "gpp-pet-bandana": {
    storefront: "originals/gpp-pet-bandana.png",
    lifestyle: "Golden retriever in a paw-print bandana.png",
  },
  "very-important-pet-tag": {
    storefront: "originals/very-important-pet-tag.png",
    lifestyle: "Golden retriever and signature paw tag.png",
  },
  "pet-bowl": {
    storefront: "originals/pet-bowl.png",
    lifestyle: "Tabby Sips from a Favorite Bowl.png",
  },
  "a-kings-pet-bed": {
    storefront: "originals/a-kings-pet-bed.png",
    lifestyle: "Golden Retriever Resting on Kingly Pillow.png",
  },
  "cat-harness-leash-set": {
    storefront: "originals/cat-harness-leash-set.png",
    lifestyle: "Sunlit Tabby in Golden-Orange Harness.png",
  },
  "catnip-ball-toy": {
    storefront: "originals/catnip-ball-toy.png",
    lifestyle: "Tabby Reaches for Catnip Ball.png",
  },
};

await mkdir(path.join(out, "storefront"), { recursive: true });
await mkdir(path.join(out, "lifestyle"), { recursive: true });
await mkdir(path.join(root, "public", "art"), { recursive: true });

for (const [slug, files] of Object.entries(products)) {
  await sharp(path.join(src, files.storefront))
    .resize(640, 640, { fit: "cover" })
    .webp({ quality: 84, effort: 6 })
    .toFile(path.join(out, "storefront", `${slug}.webp`));

  await sharp(path.join(src, files.lifestyle))
    .resize(800, 800, { fit: "cover" })
    .webp({ quality: 78, effort: 6 })
    .toFile(path.join(out, "lifestyle", `${slug}.webp`));
  console.log("optimized", slug);
}

// Static hero fallback: the dog-and-cat portion of the approved concept (right side of the hero).
const concept = sharp(path.join(root, "design-reference", "pet-parade-concept.webp"));
const { width: W, height: H } = await concept.metadata();
console.log("concept size", W, H);
await concept
  .extract({
    left: Math.round(W * 0.44),
    top: Math.round(H * 0.035),
    width: Math.round(W * 0.56),
    height: Math.round(H * 0.27),
  })
  .webp({ quality: 82 })
  .toFile(path.join(root, "public", "art", "hero-fallback.webp"));
console.log("hero fallback written");
