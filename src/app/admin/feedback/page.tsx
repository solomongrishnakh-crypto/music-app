"use client";

// Admin-Ansicht fuer das Feedback (Passwort = FEEDBACK_ADMIN_KEY in Vercel)
import { useState } from "react";

interface Item {
  id: string;
  ts: string;
  type: string;
  name?: string;
  message: string;
  email?: string;
  page?: string;
  lang?: string;
}

const KEY = "centaurian-fb-key";

function readKey(): string {
  try {
    return window.sessionStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}

export default function FeedbackAdminPage() {
  const [pw, setPw] = useState("");
  const [items, setItems] = useState<Item[] | null>(null);
  const [total, setTotal] = useState(0);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(key: string) {
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/feedback", { headers: { "x-admin-key": key }, cache: "no-store" });
      if (r.status === 401) setErr("Falsches Passwort");
      else if (r.status === 429) setErr("Zu viele Versuche, bitte spaeter erneut");
      else if (!r.ok) setErr("Fehler " + r.status);
      else {
        const j = (await r.json()) as { items: Item[]; total: number };
        setItems(j.items);
        setTotal(j.total);
        try {
          window.sessionStorage.setItem(KEY, key);
        } catch {
          /* ignorieren */
        }
      }
    } catch {
      setErr("Netzwerkfehler");
    }
    setBusy(false);
  }

  async function remove(id: string) {
    const key = readKey() || pw;
    const r = await fetch("/api/feedback", {
      method: "DELETE",
      headers: { "x-admin-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (r.ok) setItems((cur) => (cur ? cur.filter((x) => x.id !== id) : cur));
  }

  const label: Record<string, string> = { bug: "Bug", idea: "Idee", other: "Sonstiges" };
  const color: Record<string, string> = { bug: "#ff6b6b", idea: "#6bdcff", other: "#b4b4c8" };

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px", color: "#fff" }}>
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>Feedback</h1>
      {items === null ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void load(pw);
          }}
          style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
        >
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Passwort"
            autoComplete="off"
            style={{ flex: "1 1 200px", padding: "10px 12px", background: "#0b0b14", color: "#fff", border: "1px solid #444", borderRadius: 8 }}
          />
          <button
            type="submit"
            disabled={busy || !pw}
            style={{ padding: "10px 18px", background: "#6bdcff", color: "#000", border: 0, borderRadius: 8, fontWeight: 700 }}
          >
            Oeffnen
          </button>
          {err && <p style={{ width: "100%", color: "#ff6b6b" }}>{err}</p>}
        </form>
      ) : (
        <div>
          <p style={{ opacity: 0.7, marginBottom: 16 }}>
            {total} Nachrichten (neueste zuerst){" "}
            <button onClick={() => void load(readKey() || pw)} style={{ marginLeft: 8, textDecoration: "underline" }}>
              neu laden
            </button>
          </p>
          {items.length === 0 && <p>Noch kein Feedback.</p>}
          <div style={{ display: "grid", gap: 12 }}>
            {items.map((it) => (
              <article key={it.id} style={{ border: "1px solid #333", borderRadius: 10, padding: 14, background: "rgba(255,255,255,.04)" }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12, opacity: 0.85, marginBottom: 8 }}>
                  <strong style={{ color: color[it.type] || "#fff" }}>{label[it.type] || it.type}</strong>
                  {it.name && <strong>{it.name}</strong>}
                  <span>{new Date(it.ts).toLocaleString("de-DE")}</span>
                  {it.page && <span>Seite: {it.page}</span>}
                  {it.lang && <span>Sprache: {it.lang}</span>}
                  {it.email && <span>Mail: {it.email}</span>}
                </div>
                <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{it.message}</p>
                <button onClick={() => void remove(it.id)} style={{ marginTop: 10, fontSize: 12, color: "#ff6b6b" }}>
                  loeschen
                </button>
              </article>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
