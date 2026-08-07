import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    /**
     * Este lab vive dentro do monorepo Ag47.pt, que tem o próprio
     * package-lock.json. Sem fixar a raiz, o Turbopack infere o diretório do
     * monorepo e passa a observar arquivos fora do projeto.
     */
    root: import.meta.dirname,
  },
};

export default nextConfig;
