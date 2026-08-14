import type { Metadata } from "next";
import { OpportunitiesView } from "@/eco/alt-radar/apps/web/components/opportunities/opportunities-view";
import { tokenIdSchema } from "@/eco/alt-radar/apps/web/lib/api/schemas";

export const metadata: Metadata = { title: "Oportunidades" };

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const token = tokenIdSchema.safeParse((await searchParams).token);
  return <OpportunitiesView initialTokenId={token.success ? token.data : null} />;
}
