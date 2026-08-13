#!/usr/bin/env node
/**
 * Refresh data/evopro-manifest.json from the installed Evolution Protocol.
 *
 * The EvoPro landing page states facts about a system that lives in another
 * repository. Those facts used to be copied by hand, which is why the page
 * drifted a full release behind. This script replaces the copying: the protocol
 * publishes its own surface with `evolution manifest`, and the page renders it.
 *
 *   npm run sync:evopro
 *
 * Requires the protocol on PATH:
 *   pip install git+https://github.com/ag47-pt/ag47-evolution-protocol.git
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = join(ROOT, 'data', 'evopro-manifest.json');

function fail(message) {
  console.error(`\n  ✗ ${message}\n`);
  process.exit(1);
}

let raw;
try {
  raw = execFileSync('evolution', ['manifest'], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
} catch (error) {
  fail(
    `could not run \`evolution manifest\`: ${error.message}\n` +
      '    Install or update the protocol, then run this again:\n' +
      '    pip install git+https://github.com/ag47-pt/ag47-evolution-protocol.git'
  );
}

let manifest;
try {
  manifest = JSON.parse(raw);
} catch {
  fail(
    '`evolution manifest` did not return JSON. The command was added in 0.3.2 — ' +
      'reinstall the protocol if the installed version is older.'
  );
}

if (!manifest.protocol?.version || !Array.isArray(manifest.cli)) {
  fail('the manifest is missing `protocol.version` or `cli`; refusing to write a partial file.');
}

const previous = existsSync(TARGET)
  ? JSON.parse(readFileSync(TARGET, 'utf8')).protocol?.version
  : null;

writeFileSync(TARGET, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

const { version } = manifest.protocol;
console.log(
  previous && previous !== version
    ? `\n  ✓ manifest updated: ${previous} → ${version}\n`
    : `\n  ✓ manifest in sync at ${version}\n`
);
console.log(
  `    ${manifest.cli.length} commands · ` +
    `${manifest.critics.length} critics · ` +
    `${manifest.guardrails.length} guardrails · ` +
    `${manifest.artifacts.length} artifact paths\n`
);
