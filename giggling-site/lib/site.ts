/**
 * Homepage hero photo. To swap in a new shot, drop the source into
 * pet-parade-products/hero/, run `node scripts/optimize-assets.mjs`, and update
 * the paths, size and focal points below. Focal points are CSS object-position
 * values that keep the pets' faces in frame at each crop.
 */
export const HERO_IMAGE = {
  src: "/art/hero-pets-1752.webp",
  srcSet: "/art/hero-pets-960.webp 960w, /art/hero-pets-1752.webp 1752w",
  width: 1752,
  height: 897,
  alt: "A smiling golden retriever in a navy paw-print bandana sits beside a grey tabby wearing a golden-orange harness",
  /** Wide screens: photo fills the hero, pets sit on the right. */
  focusWide: "60% 35%",
  /** Split layout (tablet / narrow desktop): photo fills the right column. */
  focusSplit: "74% 35%",
  /** Phones: photo stacks above the copy, cropped to both pets. */
  focusMobile: "77% 30%",
};

export const SOCIAL = {
  instagram: "https://www.instagram.com/gigglingpawsandpets_/",
  facebook: "https://www.facebook.com/GigglingPaws/",
  tiktok: "https://www.tiktok.com/@gigglingpawsandpets",
};
