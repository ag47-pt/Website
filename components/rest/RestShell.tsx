"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { RestLocale } from "@/lib/rest/types";

type ThemeMode = "light" | "dark";

const localeLinks: Array<{ locale: RestLocale; label: string }> = [
  { locale: "pt-PT", label: "PT" },
  { locale: "en-GB", label: "EN" },
  { locale: "es-ES", label: "ES" },
];

export function RestShell(props: {
  locale: RestLocale;
  appName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<ThemeMode>("light");

  const standalonePrefixes = useMemo(
    () => [
      `/rest/${props.locale}/dashboard`,
      `/rest/${props.locale}/acesso`,
      `/rest/${props.locale}/onboarding`,
      `/rest/${props.locale}/checkout`,
    ],
    [props.locale],
  );

  const shouldBypassShell = useMemo(
    () =>
      pathname === `/rest/${props.locale}` ||
      standalonePrefixes.some((prefix) => pathname.startsWith(prefix)),
    [pathname, props.locale, standalonePrefixes],
  );

  const surfaceClass = theme === "dark"
    ? "bg-[#0a111f] text-[#dbe7ff]"
    : "bg-[#f7f8f2] text-[#1f2430]";

  const cardClass = theme === "dark"
    ? "border-white/15 bg-white/5"
    : "border-black/10 bg-white/70";

  if (shouldBypassShell) {
    return <>{props.children}</>;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${surfaceClass}`}>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-12%] top-[-20%] h-[28rem] w-[28rem] rounded-full bg-[#7ad8ff]/30 blur-3xl" />
        <div className="absolute right-[-12%] top-[10%] h-[20rem] w-[20rem] rounded-full bg-[#f4c542]/25 blur-3xl" />
        <div className="absolute bottom-[-18%] left-[25%] h-[25rem] w-[25rem] rounded-full bg-[#0ea5e9]/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href={`/rest/${props.locale}`} className="text-lg font-extrabold tracking-tight">
            {props.appName}
          </Link>

          <div className="flex items-center gap-2">
            <nav className="flex items-center rounded-full border border-black/10 bg-white/60 p-1 dark:border-white/10 dark:bg-white/5">
              {localeLinks.map((item) => (
                <Link
                  key={item.locale}
                  href={`/rest/${item.locale}`}
                  className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition ${
                    item.locale === props.locale
                      ? "bg-[#1f2430] text-white"
                      : "text-[#1f2430] hover:bg-black/5 dark:text-[#dbe7ff] dark:hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
              className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition ${cardClass}`}
              aria-label="Alternar tema"
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{props.children}</main>
    </div>
  );
}
