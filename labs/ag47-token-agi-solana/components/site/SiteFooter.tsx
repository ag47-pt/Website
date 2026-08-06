import { disclosure, nav, site } from "@/lib/content";
import { Logo } from "./Logo";

const RESOURCES = [
  { label: "Whitepaper", href: "#whitepaper" },
  { label: "Devnet documentation", href: "#docs" },
  { label: "Agent operator programme", href: "#agents" },
  { label: "Governance forum", href: "#governance" },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative border-t border-[var(--agi-line)]">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-[var(--agi-muted)]">
              {site.tagline}
            </p>
          </div>

          <nav aria-label="Sections">
            <h2 className="font-mono text-[0.64rem] tracking-[0.2em] text-[var(--agi-subtle)] uppercase">
              Sections
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-[var(--agi-muted)] transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h2 className="font-mono text-[0.64rem] tracking-[0.2em] text-[var(--agi-subtle)] uppercase">
              Resources
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {RESOURCES.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-[var(--agi-muted)] transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="agi-rule my-10" />

        <p className="max-w-4xl text-xs leading-relaxed text-[var(--agi-subtle)]">{disclosure}</p>

        <p className="mt-6 font-mono text-[0.66rem] tracking-[0.14em] text-[var(--agi-subtle)] uppercase">
          © {new Date().getFullYear()} {site.organism} · Agência 47 Labs
        </p>
      </div>
    </footer>
  );
}
