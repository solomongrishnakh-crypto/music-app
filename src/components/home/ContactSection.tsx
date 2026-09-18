const CONTACTS = [
  { label: "Telegram", href: "https://t.me/Perseus641" },
  { label: "X", href: "https://x.com/capone_835" },
];

/**
 * Abschließender Kontakt-Bereich ganz unten auf der Seite — schlichte
 * Text-Links, die in einem neuen Tab zu Telegram bzw. X führen.
 */
export default function ContactSection() {
  return (
    <div className="mx-auto mb-16 mt-20 w-full max-w-5xl sm:mt-28">
      <div className="mb-6 border-b border-border pb-4">
        <p className="label-mono text-xs uppercase">// Kontakte</p>
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {CONTACTS.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-sm uppercase tracking-wide text-muted transition-colors hover:text-accent"
          >
            {contact.label}
          </a>
        ))}
      </div>
    </div>
  );
}
