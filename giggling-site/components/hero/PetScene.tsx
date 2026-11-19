"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Sparkles } from "@react-three/drei";
import { CanvasTexture, Vector3, type Group } from "three";
import { GoldenRetriever, GreyTabby, GROUND_Y, StripedBall, smoothstep, type Progress } from "./Characters";

/** Eases raw scroll progress so the scene glides even when the wheel steps. Mounted first so it updates first. */
function ProgressSmoother({ raw, smoothed }: { raw: Progress; smoothed: Progress }) {
  useFrame((_, delta) => {
    const k = 1 - Math.exp(-delta * 7);
    smoothed.current += (raw.current - smoothed.current) * k;
  });
  return null;
}

/** Soft warm rug under the cast so they read as standing in the room, not floating. */
function Rug() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    g.addColorStop(0, "rgba(240,214,176,0.9)");
    g.addColorStop(0.6, "rgba(244,222,190,0.55)");
    g.addColorStop(1, "rgba(250,236,214,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new CanvasTexture(c);
  }, []);
  return (
    <mesh position={[0.6, GROUND_Y - 0.002, 1]} rotation={[-Math.PI / 2, 0, 0]} scale={[9, 6, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

const LOOK_START = new Vector3(0, -0.35, 0);
const LOOK_END = new Vector3(1.1, -0.85, 1.6);

/**
 * Frames the stage for the viewport, adds pointer depth, and follows the ball
 * with a slow camera push as the visitor scrolls toward Shop by Pet.
 */
function Rig({ progress, pointerEnabled, children }: { progress: Progress; pointerEnabled: boolean; children: ReactNode }) {
  const group = useRef<Group>(null);
  const look = useMemo(() => new Vector3(), []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const { pointer, camera, size } = state;
    const aspect = size.width / size.height;
    // Wide screens: the cast takes the right of the frame and the headline keeps the left.
    // Cast spans roughly x ∈ [-1.65, 1.65] in stage units (dog's tail to cat's nose);
    // keep its right edge inside the frame and its left edge clear of the headline.
    const wide = aspect > 1.3;
    const halfWidth = Math.tan((32 * Math.PI) / 360) * 6.6 * aspect;
    const targetScale = wide ? Math.min(0.76, Math.max(0.58, aspect * 0.46)) : 0.62;
    const targetX = wide ? halfWidth * 0.9 - 1.65 * targetScale : 0.15;
    const targetY = wide ? -0.12 : -0.55;
    const px = pointerEnabled ? pointer.x : 0;
    const py = pointerEnabled ? pointer.y : 0;
    const follow = smoothstep(0.45, 1, progress.current);

    g.position.x += (targetX - g.position.x) * 0.1;
    g.position.y += (targetY - g.position.y) * 0.1;
    g.scale.setScalar(g.scale.x + (targetScale - g.scale.x) * 0.1);
    g.rotation.y += (px * 0.14 - g.rotation.y) * 0.05;
    g.rotation.x += (-py * 0.05 - g.rotation.x) * 0.05;

    camera.position.x += (px * 0.35 + follow * 0.5 - camera.position.x) * 0.06;
    camera.position.y += (1.0 + py * 0.2 - follow * 0.2 - camera.position.y) * 0.06;
    camera.position.z += (6.6 - follow * 0.9 - camera.position.z) * 0.06;
    look.lerpVectors(LOOK_START, LOOK_END, follow);
    camera.lookAt(look);
  });

  return <group ref={group}>{children}</group>;
}

export default function PetScene({
  progress,
  active,
  pointerEnabled,
}: {
  progress: Progress;
  active: boolean;
  pointerEnabled: boolean;
}) {
  const smoothed = useRef(progress.current);

  return (
    <Canvas
      flat
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 1, 6.6], fov: 32, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ProgressSmoother raw={progress} smoothed={smoothed} />

      {/* warm daylight: sky/floor bounce, a soft key from the window, a gentle rim */}
      <hemisphereLight args={["#FFF6E6", "#E9C9A0", 1.1]} />
      <directionalLight position={[3.5, 5, 4]} intensity={1.6} color="#FFEBCB" />
      <directionalLight position={[-4, 2.5, -3]} intensity={0.9} color="#FFD9A6" />
      <ambientLight intensity={0.25} />

      <Rig progress={smoothed} pointerEnabled={pointerEnabled}>
        <Rug />
        <GoldenRetriever progress={smoothed} base={[-0.75, 0, -0.45]} />
        <GreyTabby progress={smoothed} base={[0.85, 0, -0.1]} />
        <StripedBall progress={smoothed} />
        <ContactShadows
          position={[0.6, GROUND_Y + 0.001, 1]}
          scale={[10, 8]}
          far={1.6}
          blur={2.4}
          opacity={0.42}
          resolution={512}
          color="#7A4A2A"
        />
        <Sparkles count={36} scale={[7, 3, 4]} position={[0.6, 0.4, 0]} size={2.4} speed={0.25} opacity={0.55} color="#FFE2A6" />
      </Rig>
    </Canvas>
  );
}
