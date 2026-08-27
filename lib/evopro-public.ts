export interface EvoProCapability {
  id: string;
  status: 'implemented' | 'validation' | 'planned' | string;
  label: string;
}

export interface EvoProPublicManifest {
  schema_version: number;
  owner: string;
  product: string;
  package: string;
  version: string;
  maturity: string;
  canonical_url: string;
  repository: string;
  tagline: string;
  interaction_model: string;
  architecture: Record<string, string>;
  principles: string[];
  capabilities: EvoProCapability[];
  known_limitations: string[];
  current_gate?: { id: string; status: string; description: string };
  release_contract?: Record<string, unknown>;
}

export interface EvoProPublicState {
  manifest: EvoProPublicManifest;
  sourceRef: string;
  sourceKind: 'tag' | 'main';
  fetchedAt: string;
}

const REPO = 'ag47-pt/ag47-evolution-protocol';
const FALLBACK_REF = 'main';
const REVALIDATE_SECONDS = 300;

async function latestTag(): Promise<string | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/tags?per_page=1`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) return null;
    const tags = (await response.json()) as Array<{ name?: string }>;
    return tags[0]?.name || null;
  } catch {
    return null;
  }
}

async function manifestAt(ref: string): Promise<EvoProPublicManifest | null> {
  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/${REPO}/${encodeURIComponent(ref)}/metadata/public-manifest.json`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
    if (!response.ok) return null;
    return (await response.json()) as EvoProPublicManifest;
  } catch {
    return null;
  }
}

export async function getEvoProPublicState(): Promise<EvoProPublicState | null> {
  const tag = await latestTag();
  if (tag) {
    const tagged = await manifestAt(tag);
    if (tagged) {
      return { manifest: tagged, sourceRef: tag, sourceKind: 'tag', fetchedAt: new Date().toISOString() };
    }
  }

  const fallback = await manifestAt(FALLBACK_REF);
  if (!fallback) return null;
  return { manifest: fallback, sourceRef: FALLBACK_REF, sourceKind: 'main', fetchedAt: new Date().toISOString() };
}
