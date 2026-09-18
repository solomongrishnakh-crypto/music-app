"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Liefert ein Ref + einen Boolean, der einmalig auf true springt, sobald
 * das Element beim Scrollen ins Blickfeld kommt (IntersectionObserver).
 * Wird genutzt, um Texte erst beim Scrollen "eintippen" zu lassen.
 */
export function useInView<T extends HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px", ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
