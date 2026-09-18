"use client";

import { useEffect, useState } from "react";
import Typewriter from "./Typewriter";

interface TypedWordmarkProps {
  className?: string;
  speed?: number;
}

/**
 * "Centaurian_"-Schriftzug, der sich beim Laden der Seite selbst eintippt —
 * wie von einer Hand in ein Terminal geschrieben. Der abschließende
 * Unterstrich bleibt dabei in der Akzentfarbe (Terminal-Cursor-Optik).
 */
const NAME = "Centaurian";

export default function TypedWordmark({ className, speed = 55 }: TypedWordmarkProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
  }, []);

  return (
    <span className={`font-display ${className ?? ""}`}>
      <Typewriter text={NAME} active={active} speed={speed} />
      <span className="text-accent">
        <Typewriter
          text="_"
          active={active}
          speed={speed}
          delay={NAME.length * speed}
        />
      </span>
    </span>
  );
}
