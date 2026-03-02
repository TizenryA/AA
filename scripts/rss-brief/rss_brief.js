import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import Parser from 'rss-parser';

const ROOT = path.resolve(process.cwd());
const FEEDS_PATH = path.join(ROOT, 'feeds.json');
const STATE_DIR = path.join(ROOT, 'state');
const SEEN_PATH = path.join(STATE_DIR, 'seen.json');

const argv = process.argv.slice(2);
function arg(name, def) {
  const i = argv.indexOf(name);
  if (i === -1) return def;
  return argv[i + 1] ?? def;
}
function hasFlag(name) {
  return argv.includes(name);
}

const limit = Number(arg('--limit', '40'));
const onlyNew = hasFlag('--new');
const categories = (arg('--categories', '') || '').split(',').map(s => s.trim()).filter(Boolean);

function sha1(s) {
  return crypto.createHash('sha1').update(s).digest('hex');
}

function stripHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pickSnippet(item) {
  const s = stripHtml(item.contentSnippet || item.content || item.summary || item['content:encoded'] || '');
  return s.slice(0, 260);
}

async function loadJson(p, fallback) {
  try {
    const s = await fs.readFile(p, 'utf-8');
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

async function saveJson(p, obj) {
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(obj, null, 2), 'utf-8');
}

async function fetchWithTimeout(url, ms) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try {
    const r = await fetch(url, { signal: ac.signal, redirect: 'follow' });
    return r;
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  const cfg = await loadJson(FEEDS_PATH, { feeds: [] });
  const seen = await loadJson(SEEN_PATH, { seen: {}, updatedAt: 0 });

  const parser = new Parser({
    timeout: 15000,
    customFetch: async (url, options) => {
      // rss-parser uses node-fetch-like API; we shim with global fetch
      const r = await fetchWithTimeout(url, 15000);
      return {
        ok: r.ok,
        status: r.status,
        statusText: r.statusText,
        url: r.url,
        headers: r.headers,
        text: () => r.text(),
      };
    }
  });

  const feeds = (cfg.feeds || []).filter(f => {
    if (!categories.length) return true;
    return categories.includes(f.category);
  });

  const results = [];
  const errors = [];

  await Promise.all(feeds.map(async (f) => {
    try {
      const feed = await parser.parseURL(f.url);
      for (const it of (feed.items || [])) {
        const link = it.link || it.guid || '';
        if (!link) continue;
        const id = sha1(link);
        const iso = it.isoDate || it.pubDate || it.date || '';
        const ts = iso ? Date.parse(iso) : NaN;

        const rec = {
          id,
          title: stripHtml(it.title || '').slice(0, 180),
          link,
          source: f.name,
          category: f.category,
          lang: f.lang,
          publishedAt: isFinite(ts) ? new Date(ts).toISOString() : null,
          snippet: pickSnippet(it)
        };

        if (onlyNew && seen.seen[id]) continue;
        results.push(rec);
      }
    } catch (e) {
      errors.push({ feed: f.name, url: f.url, error: String(e?.message || e) });
    }
  }));

  // sort newest first (null last)
  results.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));

  const out = results.slice(0, limit);
  const now = Date.now();

  // mark as seen
  for (const r of out) seen.seen[r.id] = now;
  // prune old seen (>30d)
  const THIRTY_DAYS = 30 * 24 * 3600 * 1000;
  for (const [k, v] of Object.entries(seen.seen)) {
    if (typeof v === 'number' && now - v > THIRTY_DAYS) delete seen.seen[k];
  }
  seen.updatedAt = now;
  await saveJson(SEEN_PATH, seen);

  const payload = {
    ok: true,
    generatedAt: new Date().toISOString(),
    totalCandidates: results.length,
    returned: out.length,
    errors,
    items: out
  };

  process.stdout.write(JSON.stringify(payload, null, 2));
}

main().catch((e) => {
  console.error('rss_brief failed:', e);
  process.exit(1);
});
