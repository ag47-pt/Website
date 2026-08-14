import type { Metadata } from "next";
import { OpportunitiesView } from "@/components/opportunities/opportunities-view";
import { tokenIdSchema } from "@/lib/api/schemas";

export const metadata: Metadata = { title: "Oportunidades" };

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const token = tokenIdSchema.safeParse((await searchParams).token);
  return <OpportunitiesView initialTokenId={token.success ? token.data : null} />;
}
