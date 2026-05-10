type EnvScopeSummary = {
  valid: boolean;
  missingServer: string[];
  missingClient: string[];
};

type RestEnvSummary = {
  valid: boolean;
  missingServer: string[];
  missingClient: string[];
  core: EnvScopeSummary;
  optional: {
    valid: boolean;
    missingServer: string[];
    missingClient: string[];
    features: Record<
      string,
      EnvScopeSummary & {
        description: string;
      }
    >;
  };
};

const coreRequiredServer = ["SUPABASE_SERVICE_ROLE_KEY"] as const;

const coreRequiredClient = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

const optionalFeatureConfig: Record<
  string,
  {
    description: string;
    requiredServer: readonly string[];
    requiredClient: readonly string[];
  }
> = {
  authClaims: {
    description: "JWT claim checks and advanced auth flows",
    requiredServer: ["SUPABASE_JWT_SECRET"],
    requiredClient: [],
  },
  billing: {
    description: "Stripe billing and webhook handling",
    requiredServer: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
    requiredClient: [],
  },
  notifications: {
    description: "Transactional email with Resend",
    requiredServer: ["RESEND_API_KEY"],
    requiredClient: [],
  },
  aiConcierge: {
    description: "AI concierge assistant",
    requiredServer: ["OPENAI_API_KEY"],
    requiredClient: [],
  },
  appLinks: {
    description: "Canonical app URLs used in links and callbacks",
    requiredServer: [],
    requiredClient: ["NEXT_PUBLIC_APP_URL"],
  },
};

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function getMissing(keys: readonly string[]): string[] {
  return keys.filter((key) => !process.env[key]);
}

function createScopeSummary(requiredServer: readonly string[], requiredClient: readonly string[]): EnvScopeSummary {
  const missingServer = getMissing(requiredServer);
  const missingClient = getMissing(requiredClient);

  return {
    valid: missingServer.length === 0 && missingClient.length === 0,
    missingServer,
    missingClient,
  };
}

export function getRestEnvSummary(): RestEnvSummary {
  const core = createScopeSummary(coreRequiredServer, coreRequiredClient);

  const features = Object.fromEntries(
    Object.entries(optionalFeatureConfig).map(([feature, config]) => {
      const scope = createScopeSummary(config.requiredServer, config.requiredClient);
      return [
        feature,
        {
          description: config.description,
          valid: scope.valid,
          missingServer: scope.missingServer,
          missingClient: scope.missingClient,
        },
      ];
    }),
  ) as RestEnvSummary["optional"]["features"];

  const optionalMissingServer = unique(
    Object.values(features).flatMap((feature) => feature.missingServer),
  );
  const optionalMissingClient = unique(
    Object.values(features).flatMap((feature) => feature.missingClient),
  );

  const optional = {
    valid: optionalMissingServer.length === 0 && optionalMissingClient.length === 0,
    missingServer: optionalMissingServer,
    missingClient: optionalMissingClient,
    features,
  };

  return {
    valid: core.valid,
    missingServer: [...core.missingServer],
    missingClient: [...core.missingClient],
    core,
    optional,
  };
}

export function assertRestEnv(options?: { strict?: boolean; includeOptional?: boolean }): RestEnvSummary {
  const summary = getRestEnvSummary();
  const strict = options?.strict ?? false;
  const includeOptional = options?.includeOptional ?? false;

  const hasCoreIssues = !summary.core.valid;
  const hasOptionalIssues = includeOptional && !summary.optional.valid;

  if (strict && (hasCoreIssues || hasOptionalIssues)) {
    const lines = [
      "Rest.AG env validation failed.",
      `Core missing server vars: ${summary.core.missingServer.join(", ") || "none"}`,
      `Core missing client vars: ${summary.core.missingClient.join(", ") || "none"}`,
    ];

    if (includeOptional) {
      lines.push(
        `Optional missing server vars: ${summary.optional.missingServer.join(", ") || "none"}`,
      );
      lines.push(
        `Optional missing client vars: ${summary.optional.missingClient.join(", ") || "none"}`,
      );
    }

    throw new Error(lines.join(" "));
  }

  return summary;
}
