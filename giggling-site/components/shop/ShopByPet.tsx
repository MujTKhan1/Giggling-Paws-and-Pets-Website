"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { REDUCED_MOTION_QUERY } from "@/lib/motion";
import type { PetFilter } from "@/lib/products";
import { PawIcon } from "@/components/SiteHeader";

/** Asks Pet Favourites to show one pet's products. The link's #pet-favourites jump still works on its own. */
export function requestFavouriteFilter(filter: Exclude<PetFilter, "all">) {
  window.dispatchEvent(new CustomEvent<PetFilter>("pet-parade:filter", { detail: filter }));
}

export default function ShopByPet() {
  const sectionRef = useRef<HTMLElement>(null);
  const ballRef = useRef<HTMLSpanElement>(null);
  const landingRef = useRef<HTMLSpanElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const trailMaskRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current!;
    const ball = ballRef.current!;
    const landing = landingRef.current!;
    const svg = svgRef.current!;
    const trail = trailRef.current!;
    const mask = trailMaskRef.current!;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    let ctx: gsap.Context | undefined;

    const build = () => {
      ctx?.revert();
      ctx = gsap.context(() => {
        // The ball arrives where the hero's 3D ball rolled out (upper right), swoops left over
        // the panels, and lands beside the hand-lettered tag. Measured from the live layout.
        const W = section.clientWidth;
        const H = section.clientHeight;
        const s = section.getBoundingClientRect();
        const l = landing.getBoundingClientRect();
        const end = { x: l.left - s.left + l.width / 2, y: l.top - s.top + l.height / 2 };
        const start = { x: W * 0.7, y: -60 };
        const d =
          `M${start.x},${start.y} ` +
          `C${W * 0.62},${H * 0.06} ${W * 0.3},${H * 0.02} ${(start.x + end.x) * 0.3},${end.y * 0.45} ` +
          `S${end.x - 40},${end.y - 30} ${end.x},${end.y}`;

        svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
        trail.setAttribute("d", d);
        mask.setAttribute("d", d);
        const len = trail.getTotalLength();
        gsap.set(mask, { strokeDasharray: len, strokeDashoffset: len });
        gsap.set(ball, { autoAlpha: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top 10%",
            scrub: 0.8,
          },
        });

        tl.to(ball, { motionPath: { path: d }, rotation: -900, duration: 1 }, 0)
          .to(mask, { strokeDashoffset: 0, duration: 1 }, 0)
          .from(".pet-panel", {
            y: 160,
            rotation: (i) => (i ? 5 : -5),
            clipPath: "inset(22% 0% 0% 0% round 36px)",
            duration: 0.55,
            stagger: 0.15,
          }, 0.25)
          .from(".hand-tag", { scale: 0.5, rotation: -14, autoAlpha: 0, duration: 0.3 }, 0.62)
          .from(".paw-step", { autoAlpha: 0, scale: 0.4, duration: 0.12, stagger: 0.06 }, 0.7);

        // Layered parallax: the backdrop drifts slowest, the art and doodles fastest.
        gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((el) => {
          const depth = Number(el.dataset.depth);
          gsap.fromTo(
            el,
            { yPercent: depth * 12 },
            {
              yPercent: -depth * 12,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      }, section);
    };

    build();
    // Re-measure the path whenever ScrollTrigger recalculates (resize, font load, etc.).
    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(() => {
      build();
      ScrollTrigger.refresh();
    });

    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      ctx?.revert();
    };
  }, []);

  return (
    <section id="shop-by-pet" ref={sectionRef} className="shop" aria-labelledby="shop-title">
      <svg ref={svgRef} className="shop-trail" aria-hidden="true" focusable="false">
        <defs>
          <mask id="trail-reveal" maskUnits="userSpaceOnUse">
            <path ref={trailMaskRef} fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" />
          </mask>
        </defs>
        <path ref={trailRef} className="trail-path" mask="url(#trail-reveal)" />
      </svg>
      <span ref={ballRef} className="handoff-ball" aria-hidden="true" />

      <div className="shop-grid">
        <div className="shop-intro">
          <p className="eyebrow eyebrow--brown">Follow the parade</p>
          <h2 id="shop-title" className="section-title">
            Shop <span className="nowrap">by Pet</span>
          </h2>
          <p className="hand-tag">
            Follow the parade to your pet&rsquo;s perfect picks!
          </p>
          <div className="paw-trail" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <PawIcon key={i} className="paw-step" />
            ))}
            <span ref={landingRef} className="ball-landing" />
          </div>
        </div>

        <article id="for-dogs" className="pet-panel pet-panel--dogs" aria-labelledby="dogs-title">
          <svg className="doodle doodle-bone" data-depth="0.9" viewBox="0 0 64 32" aria-hidden="true">
            <path d="M14 10a6 6 0 1 1 6-6h24a6 6 0 1 1 6 6 6 6 0 1 1-6 6H20a6 6 0 1 1-6-6Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" transform="translate(0 8)" />
          </svg>
          <div className="panel-copy">
            <h3 id="dogs-title" className="panel-title">
              For <span>Dogs</span>
            </h3>
            <p>Bandanas, tags and a bed fit for a king.</p>
            <a className="panel-cta" href="#pet-favourites" onClick={() => requestFavouriteFilter("dogs")}>
              Shop dog favourites
              <span className="panel-cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
          <div className="panel-art">
            <img
              data-depth="0.6"
              src="/products/lifestyle/a-kings-pet-bed.webp"
              alt=""
              width={800}
              height={800}
              loading="lazy"
              decoding="async"
            />
          </div>
        </article>

        <article id="for-cats" className="pet-panel pet-panel--cats" aria-labelledby="cats-title">
          <svg className="doodle doodle-cat" data-depth="0.9" viewBox="0 0 64 48" aria-hidden="true">
            <path d="M10 44c-4-10-2-22 6-28l-2-12 10 8c6-2 12-2 18 0l10-8-2 12c8 6 10 18 6 28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="panel-copy">
            <h3 id="cats-title" className="panel-title">
              For <span>Cats</span>
            </h3>
            <p>A favourite bowl, a sunny harness and catnip play.</p>
            <a className="panel-cta" href="#pet-favourites" onClick={() => requestFavouriteFilter("cats")}>
              Shop cat favourites
              <span className="panel-cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
          <div className="panel-art">
            <img
              data-depth="0.6"
              src="/products/lifestyle/catnip-ball-toy.webp"
              alt=""
              width={800}
              height={800}
              loading="lazy"
              decoding="async"
            />
          </div>
        </article>
      </div>
    </section>
  );
}
