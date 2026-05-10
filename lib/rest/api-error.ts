type PostgrestLikeError = {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
};

function toPostgrestLikeError(error: unknown): PostgrestLikeError | null {
  if (!error || typeof error !== "object") return null;

  const maybeError = error as PostgrestLikeError;
  if (typeof maybeError.code !== "string") return null;

  return maybeError;
}

export function responseFromRestApiError(error: unknown): Response {
  const postgrestError = toPostgrestLikeError(error);

  if (postgrestError?.code === "PGRST205") {
    return Response.json(
      {
        error:
          "Persistence schema is not initialized. Apply Rest.AG Supabase migrations before using this endpoint.",
        code: postgrestError.code,
      },
      { status: 503 },
    );
  }

  if (postgrestError?.code === "42501") {
    return Response.json(
      {
        error: "Database permission denied by RLS/grants for this operation.",
        code: postgrestError.code,
      },
      { status: 403 },
    );
  }

  return Response.json({ error: "Internal server error" }, { status: 500 });
}
