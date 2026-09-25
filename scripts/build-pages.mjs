/*
 * 生成站点内的静态子页面：关于店长 / 员工们（友链）/ 留言板
 * 数据来源：_hexo-old/source 下的 about、link、comments 与 _data/link.yml
 * 输出：public/about/index.html、public/link/index.html、public/comments/index.html
 * 运行：node scripts/build-pages.mjs（已挂在 prebuild）
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';

const ROOT = process.cwd();
const SRC = join(ROOT, '..', '_hexo-old', 'source');
const PUBLIC = join(ROOT, 'public');
const SITE_TITLE = '随波逐流の旅店';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

const TOPBAR_CSS = `
/* 顶栏：悬浮胶囊玻璃条（与首页一致） */
.topbar{position:fixed;top:0;left:0;right:0;z-index:60;padding:14px 20px}
.topbar-in{max-width:1120px;margin:0 auto;height:56px;padding:0 8px 0 18px;display:flex;align-items:center;justify-content:space-between;gap:18px;border-radius:999px;border:1px solid rgba(255,255,255,.22);background:rgba(78,86,120,.42);backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);box-shadow:0 12px 34px rgba(6,18,34,.32)}
.brand{display:flex;align-items:center;gap:9px;text-decoration:none;white-space:nowrap;color:#fff}
.brand .mark{width:28px;height:28px;flex:none;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:linear-gradient(140deg,#3aa3e3,#62a33d);font:700 15px/1 Georgia,"Times New Roman",serif;color:#fff}
.brand .word{font:700 17px/1 Georgia,"Times New Roman",serif}
.nav-menu{display:flex;align-items:center;gap:24px;list-style:none;margin:0;padding:0}
.nav-menu a{position:relative;color:rgba(255,255,255,.88);text-decoration:none;font-size:14.5px;white-space:nowrap;transition:color .25s ease}
.nav-menu a::after{content:\"\";position:absolute;left:50%;bottom:-6px;width:0;height:2px;border-radius:2px;background:#fff;transform:translateX(-50%);transition:width .3s cubic-bezier(.4,0,.2,1)}
.nav-menu a:hover{color:#fff}
.nav-menu a:hover::after{width:60%}
.nav-menu a.active{color:#fff;font-weight:600}
.nav-menu a.active::after{width:60%}
.topbar .avatar-btn{width:34px;height:34px;border-radius:50%;overflow:hidden;flex:none;border:2px solid rgba(255,255,255,.85);box-shadow:0 4px 14px rgba(6,20,36,.4);transition:transform .25s ease}
.topbar .avatar-btn img{width:100%;height:100%;object-fit:cover;display:block}
.topbar .avatar-btn:hover{transform:scale(1.1)}
@media(max-width:820px){
  .topbar{padding:10px 12px}
  .topbar-in{padding:0 6px 0 12px}
  .brand .word{font-size:15px}
  .nav-menu{gap:12px}
  .nav-menu a{font-size:13px}
  .nav-menu a::after{display:none}
}
`;

const BASE_CSS = `:root{--ink:#eaf3ff;--muted:#a9c3dd;--line:rgba(255,255,255,.2);--sky:#3aa3e3;--gold:#e0a545}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{min-height:100vh;color:var(--ink);font:16px/1.85 "PingFang SC","Microsoft YaHei",system-ui,-apple-system,sans-serif;background:#0d2137 url('/SAO-bg.jpg') center/cover fixed no-repeat}
body::before{content:'';position:fixed;inset:0;background:rgba(8,20,36,.7);z-index:-1}
.wrap{position:relative;z-index:1;max-width:960px;margin:0 auto;padding:104px 22px 80px}
.pill{display:inline-flex;align-items:center;gap:8px;padding:7px 16px;border-radius:999px;background:rgba(226,236,248,.16);border:1px solid var(--line);color:#fff;text-decoration:none;font-size:14px;backdrop-filter:blur(12px);transition:.3s}
.pill:hover{background:rgba(58,163,227,.5)}
.head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:26px;margin-top:6px}
h1{margin:0;font-size:32px;color:#fff;text-shadow:0 2px 14px rgba(6,20,36,.6)}
.sub{margin:8px 0 0;font-size:13.5px;color:rgba(255,255,255,.72)}
.panel{background:rgba(12,26,44,.62);border:1px solid var(--line);border-radius:20px;padding:34px 36px;backdrop-filter:blur(18px) saturate(140%);box-shadow:0 20px 50px rgba(5,16,30,.4)}
.panel p{margin:.9em 0}
.panel h2{color:#fff;font-size:20px;margin:1.6em 0 .5em;border-left:3px solid var(--sky);padding-left:12px}
.panel a{color:#8fd0ff}
.panel del{color:rgba(255,255,255,.45)}
@media(max-width:640px){.panel{padding:22px 18px}.wrap{padding:8vh 14px 60px}h1{font-size:23px}}`;

const LINK_CSS = `${BASE_CSS}
.group{margin-bottom:34px}
.group h2{margin:0 0 6px;font-size:22px;color:#fff;border-left:3px solid var(--sky);padding-left:12px}
.group .desc{margin:0 0 16px;font-size:13px;color:rgba(255,255,255,.68)}
.items{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}
.item{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:16px;text-decoration:none;
  border:1px solid rgba(255,255,255,.22);background:rgba(226,236,248,.14);backdrop-filter:blur(10px);
  transition:transform .35s cubic-bezier(.4,0,.2,1),background .35s ease,box-shadow .35s ease}
.item:hover{transform:translateY(-4px);background:rgba(58,163,227,.3);box-shadow:0 16px 34px rgba(15,46,76,.3)}
.item img{flex:none;width:46px;height:46px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,255,255,.35);background:linear-gradient(135deg,rgba(58,163,227,.6),rgba(98,163,61,.6))}
.item .txt{min-width:0}
.item .name{display:block;font-size:15px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.item .note{margin:2px 0 0;font-size:12.5px;color:rgba(255,255,255,.72);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`;

function shell(title, subtitle, bodyHtml, extraCss = '') {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · ${esc(SITE_TITLE)}</title>
<link rel="icon" href="/favicon.ico">
<style>${TOPBAR_CSS}${BASE_CSS}${extraCss}</style>
</head>
<body>
<header class="topbar">
  <div class="topbar-in">
    <a class="brand" href="/"><span class="mark">随</span><span class="word">${esc(SITE_TITLE)}</span></a>
    <nav>
      <ul class="nav-menu">
        <li><a href="/">首页</a></li>
        <li><a href="/diary/">随心记</a></li>
        <li><a href="/wallpaper/">壁纸墙</a></li>
        <li><a href="/link/">友人帐</a></li>
        <li><a href="/about/">关于我</a></li>
      </ul>
    </nav>
    <a class="avatar-btn" href="/about/" title="vernus"><img src="/icons/cards/avatar.png" alt="vernus"></a>
  </div>
</header>
<div class="wrap">
  <div class="head">
    <div>
      <h1>${esc(title)}</h1>
      ${subtitle ? `<p class="sub">${esc(subtitle)}</p>` : ''}
    </div>
    <a class="pill" href="/">← 返回主页</a>
  </div>
  ${bodyHtml}
</div>
</body>
</html>`;
}

/** 极简 front-matter */
function parseFrontMatter(raw) {
  const m = raw.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return { data, body: m[2] };
}

/** 去掉 Hexo 标签插件（如 {%psw ...%} / {% ... %}） */
function stripHexoTags(md) {
  return md
    .replace(/\{%\s*psw\s+([\s\S]*?)%\}/g, '$1')
    .replace(/\{%[\s\S]*?%\}/g, '')
    .replace(/<br\s*\/?>/gi, '\n');
}

/** 解析 _data/link.yml 的友链分组 */
function readLinkGroups() {
  const p = join(SRC, '_data', 'link.yml');
  if (!existsSync(p)) return [];
  const text = readFileSync(p, 'utf-8');
  const groups = [];
  let cur = null;
  let inItem = false;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\t/g, '  ');
    const classMatch = line.match(/^\s*-\s*class_name:\s*(.+)$/);
    if (classMatch) {
      cur = { name: classMatch[1].trim(), desc: '', items: [] };
      groups.push(cur);
      inItem = false;
      continue;
    }
    if (!cur) continue;

    const descMatch = line.match(/^\s*class_desc:\s*(.+)$/);
    if (descMatch) {
      cur.desc = descMatch[1].trim();
      continue;
    }
    const itemStart = line.match(/^\s*-\s*name:\s*(.+)$/);
    if (itemStart) {
      cur.items.push({ name: itemStart[1].trim().replace(/^['"]|['"]$/g, '') });
      inItem = true;
      continue;
    }
    if (inItem) {
      const kv = line.match(/^\s*([A-Za-z_]+):\s*(.*)$/);
      if (kv) {
        const item = cur.items[cur.items.length - 1];
        const key = kv[1].trim();
        const val = kv[2].trim().replace(/^['"]|['"]$/g, '');
        if (key === 'link') item.link = val;
        else if (key === 'avatar' || key === 'avatat') item.avatar = val;
        else if (key === 'descr' || key === 'desc') item.descr = val;
      }
    }
  }
  return groups.filter((g) => g.items.length);
}

function buildAbout() {
  const p = join(SRC, 'about', 'index.md');
  if (!existsSync(p)) return null;
  const { body } = parseFrontMatter(readFileSync(p, 'utf-8'));
  const html = marked.parse(stripHexoTags(body));
  return shell('关于店长', '一个菜菜的 ctfer', `<div class="panel">${html}</div>`);
}

function buildLink() {
  const groups = readLinkGroups();
  if (!groups.length) return null;
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  const body = groups
    .map((g) => {
      const items = g.items
        .map((it) => {
          const href = it.link && it.link !== '' ? it.link : '#';
          const fixed = href !== '#' && !/^https?:\/\//i.test(href) ? `https://${href}` : href;
          const avatar = it.avatar
            ? `<img src="${esc(it.avatar)}" alt="${esc(it.name)}" loading="lazy" onerror="this.style.visibility='hidden'">`
            : '<img alt="" aria-hidden="true">';
          return `<a class="item" href="${esc(fixed)}" target="_blank" rel="noopener">
${avatar}
<span class="txt"><span class="name">${esc(it.name)}</span><p class="note">${esc(it.descr || '')}</p></span>
</a>`;
        })
        .join('\n');
      return `<section class="group">
  <h2>${esc(g.name)}</h2>
  ${g.desc ? `<p class="desc">${esc(g.desc)}</p>` : ''}
  <div class="items">
${items}
  </div>
</section>`;
    })
    .join('\n');

  return shell('员工们', `一路同行的朋友们 · 共 ${total} 位`, body, LINK_CSS);
}

function buildComments() {
  return shell(
    '留言板',
    '想来一间足够舒适的房间？',
    `<div class="panel">
  <p>这里原本是评论系统所在的位置。当前站点由静态页面组成，留言功能需要一个评论后端才能使用。</p>
  <p>想开通的话，接入任意一种评论服务即可（Valine / Waline / Twikoo / Giscus 都行），
  接好之后我把这里替换成真正的留言板。</p>
  <p>暂时可以先通过主页的 <b>邮箱</b> 或 <b>QQ</b> 找到我 🙌</p>
</div>`
  );
}

const TASKS = [
  ['about', buildAbout],
  ['link', buildLink],
  ['comments', buildComments]
];

let built = 0;
for (const [dir, fn] of TASKS) {
  const html = fn();
  if (!html) {
    console.log(`跳过 ${dir}（缺少源文件）`);
    continue;
  }
  const outDir = join(PUBLIC, dir);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html, 'utf-8');
  built++;
}
console.log(`已生成静态子页面 ${built} 个（about / link / comments）`);
