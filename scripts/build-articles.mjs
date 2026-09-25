/*
 * 把 _hexo-old 中的文章迁移到 remio-home（构建期执行）：
 *   - 解析 front-matter
 *   - 正文用 marked 渲染，输出 public/article/<slug>/index.html
 *   - 生成 public/article-list/index.html 归档页
 *   - 生成 src/generated/articles.json 索引
 * 运行：node scripts/build-articles.mjs
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';

const ROOT = process.cwd();
const POSTS_DIR = join(ROOT, '..', '_hexo-old', 'source', '_posts');
const OUT_HTML = join(ROOT, 'public', 'article');
const OUT_JSON = join(ROOT, 'src', 'generated', 'articles.json');
const OUT_LIST = join(ROOT, 'public', 'article-list', 'index.html');

const SITE_TITLE = '随波逐流の旅店';

function parseFrontMatter(raw) {
  const m = raw.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const [, yaml, body] = m;
  const data = {};
  let currentKey = null;
  for (const line of yaml.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const listItem = line.match(/^\s+-\s+(.*)$/);
    if (listItem && currentKey) {
      const v = listItem[1].trim().replace(/^['"]|['"]$/g, '');
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(v);
      continue;
    }
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      const value = kv[2].trim();
      if (value === '') data[currentKey] = '';
      else if (value.startsWith('[') && value.endsWith(']')) {
        data[currentKey] = value
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean);
      } else data[currentKey] = value.replace(/^['"]|['"]$/g, '');
    }
  }
  return { data, body };
}

// 已失效 / 不可用的图床（用于过滤封面）
const DEAD_HOSTS = ["imgchr.com", "imgse.com", "s2.loli.net", "i.loli.net", "imgtu.com"];
function usableImage(url) {
  if (!url || !/^https?:\/\//i.test(url)) return false;
  try {
    const host = new URL(url).host;
    return !DEAD_HOSTS.some((d) => host.includes(d));
  } catch {
    return false;
  }
}
function firstImage(body) {
  const re = /!\[[^\]]*\]\(([^)\s]+)/g;
  let m;
  while ((m = re.exec(body))) {
    if (usableImage(m[1])) return m[1];
  }
  return '';
}
function toList(v) {
  if (!v) return [];
  return Array.isArray(v) ? v.map(String) : [String(v)];
}
function normalizeDate(raw) {
  const dm = String(raw || '').match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  return dm ? `${dm[1]}-${String(dm[2]).padStart(2, '0')}-${String(dm[3]).padStart(2, '0')}` : '';
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const BASE_CSS = `:root{--ink:#eaf3ff;--muted:#a9c3dd;--line:rgba(255,255,255,.2);--sky:#3aa3e3;--gold:#e0a545}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{min-height:100vh;color:var(--ink);font:16px/1.85 "PingFang SC","Microsoft YaHei",system-ui,-apple-system,sans-serif;background:#0d2137 url('/SAO-bg.jpg') center/cover fixed no-repeat}
body::before{content:'';position:fixed;inset:0;background:rgba(8,20,36,.7);z-index:-1}
.pill{display:inline-flex;align-items:center;gap:8px;padding:7px 16px;border-radius:999px;background:rgba(226,236,248,.16);border:1px solid var(--line);color:#fff;text-decoration:none;font-size:14px;backdrop-filter:blur(12px);transition:.3s}
.pill:hover{background:rgba(58,163,227,.5)}`;

const ARTICLE_CSS = `${BASE_CSS}
.wrap{max-width:860px;margin:0 auto;padding:44px 22px 80px}
.panel{margin-top:18px;background:rgba(12,26,44,.62);border:1px solid var(--line);border-radius:20px;padding:34px 36px;backdrop-filter:blur(18px) saturate(140%);box-shadow:0 20px 50px rgba(5,16,30,.4)}
h1{margin:0 0 14px;font-size:29px;line-height:1.4;color:#fff}
.meta{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;padding-bottom:18px;border-bottom:1px dashed var(--line)}
.chip{padding:2px 11px;border-radius:999px;background:rgba(255,255,255,.12);border:1px solid var(--line);font-size:12px;color:var(--muted)}
.chip.date{color:var(--gold)}
article h2,article h3,article h4{color:#fff;margin:1.6em 0 .6em;line-height:1.45}
article h2{font-size:23px;border-left:3px solid var(--sky);padding-left:12px}
article h3{font-size:19px;color:#dcecff}
article p{margin:.85em 0}
article a{color:#8fd0ff}
article img{max-width:100%;border-radius:10px;margin:14px 0}
article ul,article ol{padding-left:1.5em}
article li{margin:.35em 0}
article blockquote{margin:1.2em 0;padding:10px 18px;border-left:3px solid var(--sky);background:rgba(255,255,255,.07);border-radius:0 10px 10px 0;color:var(--muted)}
article code{background:rgba(255,255,255,.14);padding:2px 6px;border-radius:5px;font-size:.9em;color:#ffd9a8;font-family:Consolas,Monaco,monospace}
article pre{background:rgba(6,14,26,.85);border:1px solid var(--line);border-radius:12px;padding:16px 18px;overflow:auto;margin:1.2em 0}
article pre code{background:none;padding:0;color:#d6e6f7;font-size:13.5px;line-height:1.7}
article table{width:100%;border-collapse:collapse;margin:1.2em 0;font-size:14px}
article th,article td{border:1px solid var(--line);padding:8px 12px;text-align:left}
article th{background:rgba(255,255,255,.07);color:#fff}
article hr{border:none;border-top:1px dashed var(--line);margin:2em 0}
.img-fallback{display:block;padding:18px;margin:14px 0;border:1px dashed var(--line);border-radius:10px;background:rgba(255,255,255,.05);color:var(--muted);font-size:13px;text-align:center}
@media(max-width:640px){.panel{padding:22px 18px}.wrap{padding:24px 14px 60px}h1{font-size:22px}}`;

const LIST_CSS = `${BASE_CSS}
.wrap{max-width:1220px;margin:0 auto;padding:11vh 20px 70px}
header{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:30px}
header h1{margin:0;font-size:34px;color:#fff;text-shadow:0 2px 14px rgba(6,20,36,.6)}
.sub{margin:8px 0 0;font-size:13.5px;color:rgba(255,255,255,.72)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
.card{position:relative;display:block;height:190px;border-radius:18px;overflow:hidden;text-decoration:none;border:1px solid rgba(255,255,255,.25);background:rgba(12,30,50,.42);box-shadow:0 12px 30px rgba(15,46,76,.24);backdrop-filter:blur(7px);transition:transform .4s cubic-bezier(.4,0,.2,1),filter .45s ease,box-shadow .4s ease}
.card .bg{position:absolute;inset:0;background-size:cover;background-position:center;transform:scale(1.02);transition:transform .7s cubic-bezier(.22,.61,.36,1)}
.card .bg-empty{background:linear-gradient(135deg,rgba(58,163,227,.55),rgba(98,163,61,.55))}
.card .shade{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,24,42,.9),rgba(8,24,42,.28) 58%,rgba(8,24,42,.12))}
.card-date{position:absolute;right:14px;top:14px;z-index:2;padding:3px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.25);background:rgba(12,30,50,.45);backdrop-filter:blur(10px);font-size:11px;color:rgba(255,255,255,.85)}
.card-body{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:18px}
.card-body h2{margin:0;font-size:17px;line-height:1.45;font-weight:700;color:#fff;text-shadow:0 2px 12px rgba(6,20,36,.65);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.card-body p{margin:5px 0 0;font-size:12.5px;color:rgba(255,255,255,.76);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.card-body .cat{display:inline-block;margin-top:8px;padding:1px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.15);font-size:11px;color:#fff}
.card:hover{z-index:10;transform:scale(1.06);box-shadow:0 22px 46px rgba(15,46,76,.34)}
.card:hover .bg{transform:scale(1.08)}
.grid.hovering .card:not(:hover){transform:scale(.94);filter:blur(1px)}
@media(max-width:640px){.wrap{padding:8vh 14px 50px}header h1{font-size:24px}.grid{gap:14px}}`;

function articleShell(a, contentHtml) {
  const chips = [...a.categories.map((c) => `分类·${c}`), ...a.tags.map((t) => `#${t}`)]
    .map((t) => `<span class="chip">${esc(t)}</span>`)
    .join('');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(a.title)} · ${esc(SITE_TITLE)}</title>
<style>${ARTICLE_CSS}</style>
</head>
<body>
<div class="wrap">
  <a class="pill" href="/article-list/">← 返回归档</a> <a class="pill" href="/">⌂ 主页</a>
  <div class="panel">
    <h1>${esc(a.title)}</h1>
    <div class="meta">${a.date ? `<span class="chip date">${esc(a.date)}</span>` : ''}${chips}</div>
    <article>${contentHtml}</article>
  </div>
</div><script>
  // 正文插图兜底：失效图片替换为占位块，避免出现破图
  document.querySelectorAll('article img').forEach(function (img) {
    img.loading = 'lazy';
    img.addEventListener('error', function () {
      var ph = document.createElement('span');
      ph.className = 'img-fallback';
      ph.textContent = '图片已失效 · ' + (img.getAttribute('alt') || '');
      if (img.parentNode) img.parentNode.replaceChild(ph, img);
    });
  });
</script></body>
</html>`;
}

function listShell(articles) {
  const years = articles.reduce((acc, a) => {
    const y = (a.date || '未标注').slice(0, 4);
    acc[y] = (acc[y] || 0) + 1;
    return acc;
  }, {});
  const yearLine = Object.entries(years).map(([y, n]) => `${y} 年 ${n} 篇`).join(' / ');

  const cards = articles
    .map((a) => {
      const bg = a.cover
        ? `<span class="bg" style="background-image:url('${esc(a.cover)}')"></span>`
        : '<span class="bg bg-empty"></span>';
      return `<a class="card" href="${a.url}" title="${esc(a.title)}">
${bg}<span class="shade"></span>
${a.date ? `<span class="card-date">${esc(a.date)}</span>` : ''}
<div class="card-body">
<h2>${esc(a.title)}</h2>
${a.desc ? `<p>${esc(a.desc)}</p>` : ''}
${a.categories.length ? `<span class="cat">${esc(a.categories[0])}</span>` : ''}
</div></a>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>文章归档 · ${esc(SITE_TITLE)}</title>
<style>${LIST_CSS}</style>
</head>
<body>
<div class="wrap">
  <header>
    <div>
      <h1>文章归档</h1>
      <p class="sub">共 ${articles.length} 篇 · ${yearLine}</p>
    </div>
    <a class="pill" href="/">← 返回主页</a>
  </header>
  <div class="grid" id="grid">
${cards}
  </div>
</div>
<script>
  // 悬停：被指向的卡片放大，其余卡片轻微缩小 + 模糊（与主页一致）
  var grid = document.getElementById('grid');
  grid.addEventListener('mouseover', function (e) {
    if (e.target.closest('.card')) grid.classList.add('hovering');
  });
  grid.addEventListener('mouseleave', function () { grid.classList.remove('hovering'); });
</script>
</body>
</html>`;
}

function main() {
  if (!existsSync(POSTS_DIR)) {
    console.error('找不到文章目录：', POSTS_DIR);
    process.exit(1);
  }
  if (existsSync(OUT_HTML)) rmSync(OUT_HTML, { recursive: true, force: true });
  mkdirSync(OUT_HTML, { recursive: true });
  mkdirSync(join(ROOT, 'src', 'generated'), { recursive: true });

  const articles = [];
  for (const file of readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))) {
    const slug = file.replace(/\.md$/, '');
    const raw = readFileSync(join(POSTS_DIR, file), 'utf-8');
    const { data, body } = parseFrontMatter(raw);
    const title = String(data.title || slug);
    const cats = toList(data.categories);
    const tags = toList(data.tags);

    let desc = toList(data.description).join(' ').trim();
    if (!desc) {
      desc = body
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/[#>*`_-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 80);
    }

    const a = {
      slug,
      title,
      url: `/article/${encodeURIComponent(slug)}/`,
      desc: desc.slice(0, 90),
      cover: String(data.cover || data.top_img || firstImage(body) || ''),
      categories: cats,
      tags,
      date: normalizeDate(data.date || data.datas || data.updated || '')
    };

    const html = marked.parse(body);
    const dir = join(OUT_HTML, slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), articleShell(a, html), 'utf-8');
    articles.push(a);
  }

  articles.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  mkdirSync(join(ROOT, 'public', 'article-list'), { recursive: true });
  writeFileSync(OUT_LIST, listShell(articles), 'utf-8');
  writeFileSync(OUT_JSON, JSON.stringify(articles, null, 2), 'utf-8');

  console.log(`已生成文章 ${articles.length} 篇`);
  console.log('  public/article/<slug>/index.html');
  console.log('  public/article-list/index.html');
  // GitHub Pages 的 Jekyll 会忽略以 _ 开头的目录（如 _next），禁用之
  writeFileSync(join(ROOT, 'public', '.nojekyll'), '', 'utf-8');

  console.log('  src/generated/articles.json');
  console.log('  public/.nojekyll');
}

main();
