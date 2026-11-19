"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { REDUCED_MOTION_QUERY, supportsWebGL, useMediaQuery } from "@/lib/motion";
import type { Progress } from "./Characters";

// three.js is fetched only on capable desktop browsers.
const PetScene = dynamic(() => import("./PetScene"), { ssr: false });

type Mode = "fallback" | "scene";

export default function PetParadeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const progress: Progress = useRef(0);
  const [active, setActive] = useState(true);
  const [webgl, setWebgl] = useState(false);

  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const wideScreen = useMediaQuery("(min-width: 900px)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  useEffect(() => setWebgl(supportsWebGL()), []);

  // Server render and small / reduced-motion / no-WebGL visitors get the static illustration.
  const mode: Mode = webgl && wideScreen && !reducedMotion ? "scene" : "fallback";

  // Scroll through the pinned stage drives the ball and the pets. The visitor stays in control.
  useEffect(() => {
    const el = heroRef.current;
    if (mode !== "scene" || !el) return;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress.current = self.progress;
        el.style.setProperty("--hero-progress", self.progress.toFixed(3));
      },
    });
    // Switching to the scene makes the hero taller, so every later trigger must re-measure.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      trigger.kill();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  }, [mode, progress]);

  // Stop rendering while the hero is off screen.
  useEffect(() => {
    const el = heroRef.current;
    if (!el || mode !== "scene") return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  return (
    <section id="top" ref={heroRef} className="hero" data-mode={mode} aria-labelledby="hero-title">
      <div className="hero-stage">
        <div className="hero-backdrop" aria-hidden="true">
          <span className="sun" />
          <span className="window" />
          <span className="leaf leaf-a" />
          <span className="leaf leaf-b" />
        </div>

        {mode === "scene" ? (
          <div className="hero-canvas" aria-hidden="true">
            <PetScene progress={progress} active={active} pointerEnabled={finePointer} />
          </div>
        ) : (
          <div className="hero-art">
            <img
              src="/art/hero-fallback.webp"
              alt="A golden retriever in a coral bandana and a grey tabby with a yellow bow chase a striped ball across the living room"
              width={573}
              height={415}
              fetchPriority="high"
            />
          </div>
        )}

        <div className="hero-copy">
          <p className="eyebrow">
            The Pet Parade
            <Dashes className="eyebrow-dashes" />
          </p>
          <h1 id="hero-title" className="hero-title">
            <span className="line">A Little More</span>
            <span className="line">
              <span className="accent">Joy</span> for
              <Heart className="title-heart" />
            </span>
            <span className="line">Every Paw</span>
          </h1>
          <a className="btn btn-coral" href="#shop-by-pet">
            Explore the Collection
            <span aria-hidden="true" className="btn-arrow">→</span>
          </a>
        </div>

        {mode === "scene" && (
          <p className="scroll-cue" aria-hidden="true">
            <span className="scroll-cue-ball" />
            Scroll to follow the parade
          </p>
        )}
      </div>
    </section>
  );
}

export function Dashes({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path d="M8 30 L14 20 M18 30 L20 14 M28 30 L32 20" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Heart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 44" aria-hidden="true" focusable="false">
      <path
        d="M24 40 C10 30 4 22 6 13 C8 6 17 4 22 11 C24 14 24 14 26 11 C31 4 41 6 42 14 C43 23 36 30 24 40 Z"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
