"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export interface PickItem {
  i: number;
  label: string;
  sub: string;
  hay: string;
}

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Suchfeld mit gefilterter Liste (Vergleichsmodus, Nutzerwunsch 14.10.2026). */
export default function SizePicker({ items, current, placeholder, none, onPick, onClose }: {
  items: PickItem[];
  current: number;
  placeholder: string;
  none: string;
  onPick: (i: number) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const inp = useRef<HTMLInputElement>(null);
  const cur = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    inp.current?.focus();
    cur.current?.scrollIntoView({ block: "nearest" });
  }, []);
  const nq = norm(q.trim());
  const list = useMemo(() => items.filter((x) => !nq || x.hay.includes(nq)), [items, nq]);
  return (
    <div className="mt-2 border border-border bg-background">
      <div className="flex items-center gap-2 border-b border-border px-2">
        <span aria-hidden="true" className="text-muted">⌕</span>
        <input
          ref={inp}
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Enter" && list[0]) onPick(list[0].i);
          }}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full bg-transparent py-2 text-xs text-foreground outline-none placeholder:text-muted"
        />
        <button type="button" onClick={onClose} aria-label="×" className="px-1 text-sm text-muted hover:text-accent">×</button>
      </div>
      <ul role="listbox" className="max-h-52 overflow-y-auto">
        {list.length === 0 && <li className="px-3 py-2 text-xs text-muted">{none}</li>}
        {list.map((x) => (
          <li key={x.i} role="option" aria-selected={x.i === current}>
            <button
              ref={x.i === current ? cur : undefined}
              type="button"
              onClick={() => onPick(x.i)}
              className={"flex w-full items-baseline justify-between gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-white/5 " + (x.i === current ? "text-accent" : "text-foreground")}
            >
              <span className="min-w-0 truncate">{x.label}</span>
              <span className="label-mono shrink-0 text-[9px] uppercase text-muted">{x.sub}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
