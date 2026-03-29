import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tokensPath = path.resolve(__dirname, '../src/design-system/tokens.json');
const outputPath = path.resolve(__dirname, '../src/design-system/tokens.css');

const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
const entries = [];

function getTokenValue(root, tokenPath) {
  return tokenPath.split('.').reduce((acc, key) => {
    if (acc == null || !(key in acc)) {
      throw new Error(`Unresolved token reference: ${tokenPath}`);
    }

    return acc[key];
  }, root);
}

function resolveValue(value, root) {
  if (typeof value !== 'string') {
    return String(value);
  }

  return value.replace(/\{([^}]+)\}/g, (_, tokenPath) => {
    const variableName = `--ds-${tokenPath.replace(/\./g, '-')}`;
    const referencedValue = getTokenValue(root, tokenPath);

    if (typeof referencedValue === 'string' && referencedValue.includes('{')) {
      resolveValue(referencedValue, root);
    }

    return `var(${variableName})`;
  });
}

function flatten(node, segments = []) {
  if (Array.isArray(node)) {
    return;
  }

  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      flatten(value, [...segments, key]);
    }

    return;
  }

  const variableName = `--ds-${segments.join('-')}`;
  entries.push([variableName, resolveValue(node, tokens)]);
}

flatten(tokens);

const css = [
  ':root {',
  ...entries.map(([name, value]) => `  ${name}: ${value};`),
  '}',
  '',
].join('\n');

fs.writeFileSync(outputPath, css, 'utf8');
