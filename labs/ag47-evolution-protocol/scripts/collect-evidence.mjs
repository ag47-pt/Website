#!/usr/bin/env node
/**
 * Coleta evidências reais dos gates determinísticos.
 *
 * Executa lint, typecheck e build de verdade e grava o resultado — código de
 * saída, duração e timestamp — em src/data/build-evidence.json. A seção
 * "Como esta página foi construída" lê esse arquivo em vez de afirmar que os
 * gates passaram.
 *
 * Ordem de execução: `npm run evidence` e depois `npm run build`. O build
 * medido aqui é o imediatamente anterior ao que publica a página, por isso o
 * painel sempre exibe o timestamp da verificação.
 *
 * Sai com código 1 se qualquer gate falhar — a evidência é gravada mesmo assim,
 * registrando a falha em vez de escondê-la.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = join(projectRoot, "src", "data", "build-evidence.json");

const GATES = [
  { id: "lint", label: "Lint", args: ["eslint"] },
  { id: "typecheck", label: "Typecheck", args: ["tsc", "--noEmit"] },
  { id: "build", label: "Build", args: ["next", "build"] },
];

const results = [];

for (const gate of GATES) {
  process.stdout.write(`→ ${gate.label}… `);
  const startedAt = Date.now();

  const run = spawnSync("npx", gate.args, {
    cwd: projectRoot,
    shell: true,
    encoding: "utf8",
  });

  const durationMs = Date.now() - startedAt;
  const exitCode = run.status ?? 1;
  const passed = exitCode === 0;

  process.stdout.write(`${passed ? "ok" : "FALHOU"} (${(durationMs / 1000).toFixed(1)}s)\n`);

  if (!passed) {
    process.stdout.write(`${run.stdout ?? ""}${run.stderr ?? ""}\n`);
  }

  results.push({
    id: gate.id,
    label: gate.label,
    status: passed ? "passed" : "failed",
    exitCode,
    durationMs,
  });
}

const evidence = {
  generatedAt: new Date().toISOString(),
  node: process.version,
  gates: results,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");

const failed = results.filter((result) => result.status === "failed");
process.stdout.write(`\nEvidência gravada em src/data/build-evidence.json\n`);
process.exit(failed.length > 0 ? 1 : 0);
