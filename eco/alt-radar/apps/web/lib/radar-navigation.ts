export type RadarNavigationMode = "standalone" | "embedded";

export function getRadarHref(tab: string, mode: RadarNavigationMode) {
  if (mode === "embedded") {
    return tab === "landing" ? "/eco/alt-radar" : `/eco/alt-radar?tab=${encodeURIComponent(tab)}`;
  }

  return tab === "landing" ? "/" : `/${tab}`;
}

export function getStandaloneRadarTab(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.at(-1) ?? "landing";
}
