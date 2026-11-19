import type { CSSProperties } from "react";
import { HERO_IMAGE } from "@/lib/site";
import { Dashes, Heart } from "@/components/Doodles";

/**
 * Photo-led hero. Wide screens: the photo fills the stage with the pets on the right and the
 * copy on the cream wall to the left. Narrower screens: a split layout with a brand-coloured
 * copy panel. Phones: photo stacked above the copy, cropped to both pets.
 */
export default function PhotoHero() {
  const focus = {
    "--focus-wide": HERO_IMAGE.focusWide,
    "--focus-split": HERO_IMAGE.focusSplit,
    "--focus-mobile": HERO_IMAGE.focusMobile,
  } as CSSProperties;

  return (
    <section id="top" className="photo-hero" aria-labelledby="hero-title" style={focus}>
      <div className="photo-hero-media">
        <img
          src={HERO_IMAGE.src}
          srcSet={HERO_IMAGE.srcSet}
          sizes="(max-width: 760px) 100vw, (max-width: 1100px) 56vw, 100vw"
          width={HERO_IMAGE.width}
          height={HERO_IMAGE.height}
          alt={HERO_IMAGE.alt}
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <div className="photo-hero-copy">
        <p className="eyebrow">
          The Pet Parade
          <Dashes className="eyebrow-dashes" />
        </p>
        <h1 id="hero-title" className="hero-title">
          Made for <span className="accent">wagging tails</span> and{" "}
          <span className="accent accent--brown">
            curious paws
            <Heart className="title-heart" />
          </span>
        </h1>
        <p className="hero-lede">Playful accessories, toys, and everyday favorites for dogs and cats.</p>
        <div className="hero-actions">
          <a className="btn btn-coral" href="#for-dogs">
            Shop Dogs
            <span aria-hidden="true" className="btn-arrow">→</span>
          </a>
          <a className="btn btn-cat" href="#for-cats">
            Shop Cats
            <span aria-hidden="true" className="btn-arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
