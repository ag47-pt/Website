import type { Metadata } from "next";
import { WatchlistView } from "@/eco/alt-radar/apps/web/components/watchlist/watchlist-view";

export const metadata: Metadata = { title: "Watchlist" };

export default function WatchlistPage() {
  return <WatchlistView />;
}
