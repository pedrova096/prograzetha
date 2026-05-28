// scripts/extract-lucide-svgs.ts
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

type IconNode = [tag: string, attrs: Record<string, string | number>][];

const ICONS_DIR = 'node_modules/lucide-svelte/dist/icons';
const OUTPUT_DIR = 'src/lib/constants/LiteralVariants/svg';

const DEFAULT_SVG_ATTRS = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};

const SELECTED_ICONS = [
  'quote',
  'hash',
  'circle-slash',
  'circle-check',
  'list',
  'braces',
] as const;

function escapeAttr(value: string | number): string {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function attrsToString(attrs: Record<string, string | number>): string {
  return Object.entries(attrs)
    .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
    .join(' ');
}

function iconNodeToSvg(iconNode: IconNode): string {
  const svgAttrs = attrsToString(DEFAULT_SVG_ATTRS);

  const children = iconNode
    .map(([tag, attrs]) => `  <${tag} ${attrsToString(attrs)} />`)
    .join('\n');

  return `<svg ${svgAttrs}>\n${children}\n</svg>\n`;
}

function extractIconNode(source: string): IconNode | null {
  const match = source.match(/const iconNode = (\[[\s\S]*?\]);/);

  if (!match) {
    return null;
  }

  // Lucide's iconNode is a plain JS array literal.
  // This avoids needing a full JS parser.
  return new Function(`return ${match[1]}`)() as IconNode;
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = await readdir(ICONS_DIR);
  const selected = new Set(SELECTED_ICONS.map((name) => `${name}.svelte`));

  for (const file of files) {
    if (!selected.has(file)) continue;

    const filePath = join(ICONS_DIR, file);
    const source = await readFile(filePath, 'utf8');

    const iconNode = extractIconNode(source);

    if (!iconNode) {
      console.warn(`Could not extract iconNode from ${file}`);
      continue;
    }

    const iconName = basename(file, '.svelte');
    const svg = iconNodeToSvg(iconNode);

    await writeFile(join(OUTPUT_DIR, `${iconName}.svg`), svg, 'utf8');

    console.log(`Created ${OUTPUT_DIR}/${iconName}.svg`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
