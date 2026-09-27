"use client";

import { useEffect, useRef } from "react";
import { createGearScene } from "./gearScene";

/**
 * 3D-Untersetzungsmaschine ("Google Gear"/Googol-Maschine) auf der
 * Universum-Seite. Die gesamte three.js-Logik (Motor, 23 Achsen mit
 * 60:10-Stufen, Zeitberechnung, Kamera-Einpassung) steckt in gearScene.ts,
 * damit sie unabhängig von React im Browser getestet werden kann.
 */
interface Gear3DProps {
  className?: string;
}

export default function Gear3D({ className }: Gear3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    return createGearScene(mount);
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
