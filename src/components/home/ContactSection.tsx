const CONTACTS = [
  {
    label: "Telegram",
    href: "https://t.me/Perseus641",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.05 3.5 2.85 10.6c-1.24.5-1.23 1.19-.23 1.5l4.66 1.45 1.8 5.5c.22.6.37.85.8.85.35 0 .5-.16.71-.36l1.72-1.65 4.75 3.5c.87.48 1.5.23 1.72-.8L21.98 4.7c.32-1.28-.49-1.84-1.93-1.2ZM7.9 13.9l9.2-5.8c.44-.27.84-.12.51.18l-7.8 7.05-.3 3.2-1.6-4.63Z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/capone_835",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.6 10.6 21 2h-2l-6.4 7.4L7.6 2H2l7.7 11.2L2 22h2l6.8-7.9L16.4 22H22l-8.4-11.4Zm-2.4 2.8-.8-1.1L4.2 3.5h2.6l5 7.2.8 1.1 6.6 9.5h-2.6l-5.4-7.9Z" />
      </svg>
    ),
  },
];

/**
 * Abschließender Kontakt-Bereich ganz unten auf der Seite — Logos statt
 * Text, die in einem neuen Tab zu Telegram bzw. X führen.
 */
export default function ContactSection() {
  return (
    <div className="mx-auto mb-4 mt-20 w-full max-w-5xl sm:mt-28">
      <div className="mb-6 border-b border-border pb-4">
        <p className="label-mono text-xs uppercase">// Kontakte</p>
      </div>
      <div className="flex items-center gap-6">
        {CONTACTS.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={contact.label}
            className="flex h-10 w-10 items-center justify-center border border-border text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <span className="h-4 w-4">{contact.icon}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
