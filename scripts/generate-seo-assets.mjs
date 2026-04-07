#!/usr/bin/env node
/**
 * Build-time SEO/GEO asset generator for OIF site.
 *
 * Produces:
 *   - public/sitemap.xml — all public routes with lastmod
 *   - public/llms-full.txt — concatenated page content for LLM crawlers
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(REPO_ROOT, 'public');
const BASE_URL = 'https://openinferencefoundation.org';

if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });

// ─── sitemap.xml ────────────────────────────────────────────────────────

const routes = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/thesis', changefreq: 'monthly', priority: 0.9 },
  { url: '/buy', changefreq: 'monthly', priority: 0.9 },
  { url: '/tokenomics', changefreq: 'monthly', priority: 0.8 },
  { url: '/staking', changefreq: 'monthly', priority: 0.8 },
  { url: '/agents', changefreq: 'monthly', priority: 0.8 },
  { url: '/governance', changefreq: 'monthly', priority: 0.7 },
  { url: '/privacy', changefreq: 'monthly', priority: 0.8 },
  { url: '/docs', changefreq: 'monthly', priority: 0.7 },
];

const lastmod = new Date().toISOString().split('T')[0];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${BASE_URL}${r.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml);
console.log(`  sitemap.xml — ${routes.length} routes`);

// ─── llms-full.txt ──────────────────────────────────────────────────────

function extractText(filePath) {
  try {
    let content = readFileSync(filePath, 'utf-8');
    // Strip imports
    content = content.replace(/^import\s+.*$/gm, '');
    // Strip JSX tags but keep text content
    content = content.replace(/<[^>]+>/g, ' ');
    // Strip style objects
    content = content.replace(/style=\{\{[^}]+\}\}/g, '');
    // Strip className
    content = content.replace(/className="[^"]*"/g, '');
    // Strip JS expressions in braces (but keep string literals)
    content = content.replace(/\{\/\*.*?\*\/\}/gs, '');
    // Strip export/function declarations
    content = content.replace(/^export\s+(default\s+)?function\s+\w+.*\{$/gm, '');
    // Strip return statements
    content = content.replace(/return\s*\(/g, '');
    // Clean up whitespace
    content = content.replace(/[{}();]/g, ' ');
    content = content.replace(/\s+/g, ' ');
    content = content.replace(/^\s+$/gm, '');
    // Remove lines that are just whitespace or very short
    content = content
      .split('\n')
      .filter((line) => line.trim().length > 10)
      .join('\n');
    return content.trim();
  } catch {
    return '';
  }
}

const SRC_DIR = join(REPO_ROOT, 'src', 'pages');
const pages = [
  { file: 'Home.tsx', title: 'Home' },
  { file: 'Thesis.tsx', title: 'Inference as a Utility' },
  { file: 'TokenEconomics.tsx', title: 'Token Economics' },
  { file: 'Staking.tsx', title: 'Staking' },
  { file: 'Agents.tsx', title: 'The Agent Network' },
  { file: 'Governance.tsx', title: 'Governance' },
  { file: 'Privacy.tsx', title: 'Privacy' },
  { file: 'Buy.tsx', title: 'Buy Tokens' },
  { file: 'Docs.tsx', title: 'Documentation' },
];

let llmsContent = `# Open Inference Foundation
# ${BASE_URL}
# A nonprofit inference co-op providing wholesale AI compute through collective membership.
# Generated: ${new Date().toISOString()}

`;

for (const page of pages) {
  const text = extractText(join(SRC_DIR, page.file));
  if (text) {
    llmsContent += `\n## ${page.title}\n\n${text}\n\n---\n`;
  }
}

writeFileSync(join(PUBLIC_DIR, 'llms-full.txt'), llmsContent);
console.log(`  llms-full.txt — ${pages.length} pages extracted`);
