const USER_TIMEZONE = process.env.NEXT_PUBLIC_USER_TIMEZONE || undefined;

export function formatCurrency(value: number | null, compact = false) {
  if (value === null) return "N/D";
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : value < 0.01 ? 6 : 2,
  }).format(value);
}

export function formatNumber(value: number | null, compact = false) {
  if (value === null) return "N/D";
  return new Intl.NumberFormat("pt-PT", {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 2,
  }).format(value);
}

export function formatPercent(value: number | null, signed = false) {
  if (value === null) return "N/D";
  const prefix = signed && value > 0 ? "+" : "";
  return `${prefix}${new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 1 }).format(value)}%`;
}

export function formatRatio(value: number | null) {
  if (value === null) return "N/D";
  return `${new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 1 }).format(value * 100)}%`;
}

export function formatScore(value: number | null) {
  if (value === null) return "N/D";
  return new Intl.NumberFormat("pt-PT", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDateTime(value: string | null) {
  if (!value) return "Aguardando dados";
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: USER_TIMEZONE,
  }).format(new Date(value));
}

export function formatTime(value: string) {
  return new Intl.DateTimeFormat("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: USER_TIMEZONE,
  }).format(new Date(value));
}

export function formatAge(value: string | null) {
  if (!value) return "Desconhecido";
  const elapsedHours = Math.max(0, (Date.now() - new Date(value).getTime()) / 3_600_000);
  if (elapsedHours < 1) return `${Math.max(1, Math.floor(elapsedHours * 60))} min`;
  if (elapsedHours < 48) return `${Math.floor(elapsedHours)} h`;
  return `${Math.floor(elapsedHours / 24)} d`;
}

export function shortenAddress(value: string, size = 5) {
  if (value.length <= size * 2 + 1) return value;
  return `${value.slice(0, size)}…${value.slice(-size)}`;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
}

export function formatClassification(value: string | null) {
  const labels: Record<string, string> = {
    oportunidade_forte: "Oportunidade forte",
    observar: "Observar",
    especulativo: "Especulativo",
    risco_elevado: "Risco elevado",
  };
  return value ? (labels[value] ?? value) : "Aguardando score";
}
