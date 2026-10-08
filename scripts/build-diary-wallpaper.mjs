/*
 * 生成两个页面：
 *   public/diary/index.html     随心记 —— 时间轴动态流（左侧竖线 + 发光节点 + 半透明卡片）
 *   public/wallpaper/index.html 壁纸墙 —— 瀑布流图墙（CSS columns 真瀑布流 + 悬停放大 + 角标）
 * 数据源：src/generated/articles.json（文章）与 public/wallpaper-meta.json（图片尺寸清单）
 * 所有样式为本站原创实现；配色取自本地背景插画。
 * 运行：node scripts/build-diary-wallpaper.mjs（已挂在 prebuild）
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { WIDGET_CSS, siteFooter, musicPlayer } from './site-widgets.mjs';

const ROOT = process.cwd();
const PUBLIC = join(ROOT, 'public');
const GENERATED = join(ROOT, 'src', 'generated');

const SITE = {
  name: '艾恩葛朗特第一层の旅店',
  author: 'vernus',
  avatar: '/icons/cards/avatar.png'
};

// 图库已镜像到站点本地（public/acg/），同域加载不依赖外网；
// 万一本地缺失则回退到图床仓库直链。
const WALLPAPER_REPO = 'vernuser/acg-wallpaper';
const WALLPAPER_BRANCH = 'main';
const REMOTE = (id) => `https://raw.githubusercontent.com/${WALLPAPER_REPO}/${WALLPAPER_BRANCH}/acg/${id}`;
function imgSrc(id) {
  return existsSync(join(PUBLIC, 'acg', id)) ? `/acg/${id}` : REMOTE(id);
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/* ------------------------------ 公共样式 ------------------------------ */

const SHELL_CSS = `:root{
  --ink:#eaf3ff; --muted:rgba(233,242,253,.72); --line:rgba(255,255,255,.16);
  --glass:rgba(12,28,48,.44); --sky:#3aa3e3; --sky-deep:#1d6fb8; --grass:#62a33d;
  --radius:18px; --shadow:0 16px 40px rgba(6,20,36,.34);
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{
  min-height:100vh;color:var(--ink);
  font:15px/1.8 "PingFang SC","Microsoft YaHei",system-ui,-apple-system,sans-serif;
  background:#0d2137 url('/SAO-bg.jpg') center/cover fixed no-repeat;
}
body::before{content:"";position:fixed;inset:0;background:rgba(8,20,36,.6);z-index:-1}
a{color:inherit}

/* 顶栏：与首页一致的胶囊玻璃条 */
.topbar{position:fixed;top:0;left:0;right:0;z-index:60;padding:14px 20px}
.topbar-in{
  max-width:1120px;margin:0 auto;height:56px;padding:0 8px 0 18px;
  display:flex;align-items:center;justify-content:space-between;gap:18px;
  border-radius:999px;border:1px solid rgba(255,255,255,.22);background:rgba(78,86,120,.42);
  backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);
  box-shadow:0 12px 34px rgba(6,18,34,.32);
}
.brand{display:flex;align-items:center;gap:9px;text-decoration:none;white-space:nowrap;color:#fff}
.brand .mark{
  width:28px;height:28px;flex:none;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;
  background:linear-gradient(140deg,var(--sky),var(--grass));font:700 15px/1 Georgia,"Times New Roman",serif;color:#fff;
}
.brand .word{font:700 17px/1 Georgia,"Times New Roman",serif}
.nav-menu{display:flex;align-items:center;gap:24px;list-style:none;margin:0;padding:0}
.nav-menu a{position:relative;color:rgba(255,255,255,.88);text-decoration:none;font-size:14.5px;white-space:nowrap;transition:color .25s ease}
.nav-menu a::after{
  content:"";position:absolute;left:50%;bottom:-6px;width:0;height:2px;border-radius:2px;background:#fff;
  transform:translateX(-50%);transition:width .3s cubic-bezier(.4,0,.2,1);
}
.nav-menu a:hover{color:#fff}
.nav-menu a:hover::after{width:60%}
.nav-menu a.active{color:#fff;font-weight:600}
.nav-menu a.active::after{width:60%}
.topbar .avatar-btn{
  width:34px;height:34px;border-radius:50%;overflow:hidden;flex:none;
  border:2px solid rgba(255,255,255,.85);box-shadow:0 4px 14px rgba(6,20,36,.4);transition:transform .25s ease;
}
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

function topbar(active) {
  const items = [
    ['/', '首页', 'home'],
    ['/diary/', '随心记', 'diary'],
    ['/wallpaper/', '壁纸墙', 'wallpaper'],
    ['/link/', '友人帐', 'link'],
    ['/about/', '关于我', 'about']
  ];
  return `<header class="topbar">
  <div class="topbar-in">
    <a class="brand" href="/"><span class="mark">剑</span><span class="word">${esc(SITE.name)}</span></a>
    <nav>
      <ul class="nav-menu">
${items.map(([href, label, key]) => `        <li><a href="${href}"${key === active ? ' class="active"' : ''}>${label}</a></li>`).join('\n')}
      </ul>
    </nav>
    <a class="avatar-btn" href="/about/" title="${esc(SITE.author)}"><img src="${esc(SITE.avatar)}" alt="${esc(SITE.author)}"></a>
  </div>
</header>`;
}

function shell(title, description, css, body, active) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · ${esc(SITE.name)}</title>
<meta name="description" content="${esc(description)}">
<link rel="icon" href="/favicon.ico">
<style>${SHELL_CSS}${css}${WIDGET_CSS}</style>
</head>
<body>
${topbar(active)}
${body}
${siteFooter()}
${musicPlayer()}
</body>
</html>`;
}

/* ------------------------------ 随心记 ------------------------------ */

/* 随心记：写作账本 + 便签卡片墙（形式取自参考设计，配色适配站点深色玻璃风格） */
const DIARY_CSS = `
.d-wrap{position:relative;z-index:1;max-width:1180px;margin:0 auto;padding:104px 20px 84px}
.d-head{display:flex;align-items:flex-start;gap:26px;margin-bottom:28px}
.d-crumb{font:700 12px/1 Georgia,"Times New Roman",serif;letter-spacing:.3em;color:#e0a545}
.d-title{margin:12px 0 6px;font-size:36px;line-height:1.25;color:#fff;text-shadow:0 2px 14px rgba(6,20,36,.6)}
.d-title .hl{background:linear-gradient(transparent 64%,rgba(224,165,69,.36) 64%);padding:0 4px}
.d-sub{margin:0;font-size:13px;color:var(--muted)}

/* 草稿箱便签 */
.d-sticky{
  margin-left:auto;flex:none;width:228px;padding:15px 16px 12px;position:relative;
  background:linear-gradient(165deg,#e9f3e6,#d3e7d1);border-radius:3px;
  transform:rotate(2.2deg);box-shadow:0 14px 30px rgba(6,20,36,.4);
}
.d-sticky::before{content:'';position:absolute;top:-9px;left:50%;width:78px;height:18px;transform:translateX(-50%) rotate(-2deg);background:rgba(255,255,255,.55);border:1px dashed rgba(120,150,120,.35)}
.d-sticky .s-label{font-size:11.5px;color:#5c7a5f;letter-spacing:.06em}
.d-sticky .s-big{margin:7px 0 12px;font-size:15px;font-weight:600;color:#3e5a42;line-height:1.5}
.d-sticky .s-bar{height:7px;border-radius:4px;background:rgba(90,120,95,.28);position:relative;overflow:hidden}
.d-sticky .s-bar i{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:4px;background:#8fbc8f}
.d-sticky .s-pct{margin-top:4px;text-align:right;font-size:10.5px;color:#5c7a5f}

/* 冒险记录 */
.d-ledger{
  background:var(--glass);border:1px solid var(--line);border-radius:var(--radius);
  box-shadow:var(--shadow);backdrop-filter:blur(16px) saturate(140%);
  -webkit-backdrop-filter:blur(16px) saturate(140%);
  padding:20px 26px 18px;margin-bottom:30px;
}
.d-ledger .lg-head{display:flex;align-items:center;gap:10px;font:600 12px/1 Georgia,"Times New Roman",serif;letter-spacing:.24em;color:rgba(233,242,253,.8)}
.d-ledger .lg-head .till{margin-left:auto;font-family:"PingFang SC","Microsoft YaHei",sans-serif;font-weight:400;letter-spacing:.08em}
.d-ledger .lg-stats{display:flex;flex-wrap:wrap;margin:18px 0 6px}
.d-ledger .lg-stat{flex:1 1 0;min-width:140px;padding:2px 20px;border-left:1px dashed rgba(255,255,255,.16)}
.d-ledger .lg-stat:first-child{border-left:0;padding-left:0}
.d-ledger .lg-stat b{font:700 30px/1.15 Georgia,"Times New Roman",serif;color:#fff;font-variant-numeric:tabular-nums}
.d-ledger .lg-stat b i{font:600 13px/1 Georgia,"Times New Roman",serif;font-style:normal;color:#e0a545;margin-left:3px}
.d-ledger .lg-stat span{display:block;margin-top:5px;font-size:12px;color:var(--muted)}
.d-chart{display:flex;align-items:flex-end;gap:12px;margin-top:14px;padding-top:14px;border-top:1px dashed rgba(255,255,255,.14)}
.d-chart .bar{flex:1 1 0;max-width:72px;text-align:center}
.d-chart .bar em{display:block;font:600 11px/1 Georgia,"Times New Roman",serif;font-style:normal;color:#e0a545;margin-bottom:5px}
.d-chart .bar i{display:block;margin:0 auto;width:22px;border-radius:5px 5px 2px 2px;background:linear-gradient(180deg,#e8c47c,#c08f42);box-shadow:0 0 12px rgba(224,165,69,.25)}
.d-chart .bar span{display:block;margin-top:6px;font-size:11px;color:var(--muted)}

/* 便签卡片墙 */
.d-grid{column-count:3;column-gap:18px}
@media(max-width:1080px){.d-grid{column-count:2}}
@media(max-width:680px){.d-grid{column-count:1}}
.d-note{
  position:relative;break-inside:avoid;margin-bottom:18px;
  background:var(--glass);border:1px solid var(--line);border-radius:14px;
  box-shadow:0 10px 28px rgba(6,20,36,.3);backdrop-filter:blur(14px) saturate(140%);
  -webkit-backdrop-filter:blur(14px) saturate(140%);
  padding:17px 18px 12px;
  transition:transform .35s cubic-bezier(.4,0,.2,1),box-shadow .35s ease,border-color .35s ease;
}
.d-note::before{
  content:'';position:absolute;top:-9px;left:50%;width:88px;height:18px;
  transform:translateX(-50%) rotate(-2deg);
  background:rgba(224,165,69,.30);border:1px dashed rgba(255,255,255,.28);
}
.d-note:nth-child(3n)::before{transform:translateX(-50%) rotate(2.4deg);background:rgba(125,196,236,.26)}
.d-note:nth-child(3n+1)::before{width:70px;background:rgba(255,255,255,.18)}
.d-note:hover{transform:translateY(-4px);border-color:rgba(224,165,69,.45);box-shadow:0 22px 46px rgba(6,20,36,.44)}
.d-note .n-top{display:flex;align-items:center;gap:10px;font-size:11px}
.d-note .n-cat{color:#e0a545;letter-spacing:.14em}
.d-note .n-date{margin-left:auto;color:var(--muted);font-variant-numeric:tabular-nums}
.d-note h3{margin:10px 0 0;font-size:16px;line-height:1.55;color:#fff;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.d-note h3 a{color:inherit;text-decoration:none;transition:color .25s ease}
.d-note h3 a:hover{color:#7cc4ec}
.d-note .n-desc{margin:9px 0 0;padding-bottom:10px;border-bottom:1px dashed rgba(255,255,255,.16);font-size:13px;line-height:1.8;color:rgba(233,242,253,.72);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.d-note .n-foot{display:flex;align-items:center;gap:10px;margin-top:9px;font-size:11.5px;min-width:0}
.d-note .n-tags{color:rgba(233,242,253,.55);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.d-note .n-tags span{margin-right:8px}
.d-note .n-read{margin-left:auto;flex:none;color:#e0a545;text-decoration:none;font-weight:600;transition:transform .3s ease}
.d-note .n-read:hover{transform:translateX(3px);color:#f0bd68}
@media(max-width:820px){
  .d-wrap{padding:96px 14px 70px}
  .d-head{flex-direction:column;gap:18px}
  .d-sticky{margin-left:0;transform:rotate(1.2deg)}
  .d-title{font-size:27px}
  .d-ledger{padding:18px 16px 14px}
  .d-ledger .lg-stat{min-width:44%;padding:2px 12px;margin-bottom:8px}
  .d-ledger .lg-stat b{font-size:24px}
  .d-chart{gap:7px}
  .d-chart .bar i{width:14px}
}
`;

function diaryPage(articles) {
  const now = new Date();
  const till = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
  const DAY = 864e5;
  const ts = (d) => new Date(d + 'T00:00:00+08:00').getTime();

  const posts = articles.length;
  const words = articles.reduce((n, a) => n + (a.weight || 0), 0);
  const dated = articles.filter((a) => a.date).sort((a, b) => b.date.localeCompare(a.date));
  const latest = dated[0];
  const oldest = dated[dated.length - 1];
  const daysAgo = latest ? Math.max(0, Math.round((now.getTime() - ts(latest.date)) / DAY)) : '—';
  const yearsSpan = oldest ? ((now.getTime() - ts(oldest.date)) / (365.25 * DAY)).toFixed(1) : '—';

  const byYear = new Map();
  for (const a of dated) byYear.set(a.date.slice(0, 4), (byYear.get(a.date.slice(0, 4)) || 0) + 1);
  const yearRows = [...byYear.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const maxYear = Math.max(1, ...yearRows.map((r) => r[1]));
  const chart = yearRows
    .map(([y, n]) => `<div class="bar"><em>${n}</em><i style="height:${8 + Math.round((n / maxYear) * 44)}px"></i><span>'${y.slice(2)}</span></div>`)
    .join('\n');

  const wordsW = words ? (words / 10000).toFixed(1) : '0';

  const notes = articles
    .map((a) => {
      const cat = (a.categories && a.categories[0]) || '随笔';
      const tags = (a.tags || []).slice(0, 3).map((t) => `<span>#${esc(t)}</span>`).join('');
      return `<article class="d-note">
  <div class="n-top"><span class="n-cat">${esc(cat)}</span>${a.date ? `<time class="n-date">${esc(a.date)}</time>` : ''}</div>
  <h3><a href="${a.url}">${esc(a.title)}</a></h3>
  ${a.desc ? `<p class="n-desc">${esc(a.desc)}</p>` : ''}
  <div class="n-foot"><span class="n-tags">${tags || '<span>#SAO</span>'}</span><a class="n-read" href="${a.url}">读一读 →</a></div>
</article>`;
    })
    .join('\n');

  return shell(
    '随心记',
    '旅店里的碎碎念与近况',
    DIARY_CSS,
    `<div class="d-wrap">
  <div class="d-head">
    <div>
      <div class="d-crumb">✦ DIARY / WRITINGS</div>
      <h1 class="d-title"><span class="hl">随心记</span></h1>
      <p class="d-sub">旅店里的碎碎念与近况</p>
    </div>
    <aside class="d-sticky">
      <div class="s-label">✎ 草稿箱 · 下一篇在写……</div>
      <p class="s-big">暂无，随时起笔</p>
      <div class="s-bar"><i></i></div>
      <div class="s-pct">0%</div>
    </aside>
  </div>

  <section class="d-ledger">
    <div class="lg-head"><span>艾恩葛朗特第一层 · 随心记账本</span><span class="till">截至 ${till}</span></div>
    <div class="lg-stats">
      <div class="lg-stat"><b>${posts}<i>篇</i></b><span>已上架</span></div>
      <div class="lg-stat"><b>${wordsW}<i>万字</i></b><span>累计字数</span></div>
      <div class="lg-stat"><b>${daysAgo}<i>天前</i></b><span>最近一篇</span></div>
      <div class="lg-stat"><b>${yearsSpan}<i>年</i></b><span>动笔至今</span></div>
    </div>
    <div class="d-chart">
${chart}
    </div>
  </section>

  <div class="d-grid">
${notes}
  </div>
</div>`,
    'diary'
  );
}

/* ------------------------------ 壁纸墙 ------------------------------ */

const WALL_CSS = `
.wrap{max-width:1280px;margin:0 auto;padding:104px 20px 90px}
.headline{display:flex;flex-wrap:wrap;align-items:flex-end;gap:14px;margin-bottom:26px}
.headline h1{margin:0;font-size:30px;color:#fff;text-shadow:0 2px 14px rgba(6,20,36,.6)}
.headline p{margin:0;font-size:13px;color:var(--muted)}
.headline .acts{margin-left:auto;display:flex;gap:8px}
.headline button{
  padding:7px 16px;border-radius:999px;cursor:pointer;font-size:13px;color:#fff;
  background:var(--glass);border:1px solid var(--line);backdrop-filter:blur(10px);
  transition:background .25s ease,transform .25s ease;
}
.headline button:hover{background:rgba(58,163,227,.5);transform:translateY(-2px)}
.headline button.on{background:var(--sky-deep);border-color:transparent;font-weight:600}

/* 瀑布流：CSS columns 实现真瀑布流（每列独立堆叠） */
.wall{column-count:5;column-gap:16px}
@media(max-width:1400px){.wall{column-count:4}}
@media(max-width:1080px){.wall{column-count:3}}
@media(max-width:720px){.wall{column-count:2;column-gap:12px}}
@media(max-width:460px){.wall{column-count:1}}
.tile{
  position:relative;display:block;width:100%;margin:0 0 16px;overflow:hidden;
  border-radius:14px;border:1px solid rgba(255,255,255,.18);background:rgba(12,28,48,.4);
  box-shadow:0 10px 26px rgba(6,20,36,.26);break-inside:avoid;
  transition:transform .4s cubic-bezier(.4,0,.2,1),box-shadow .4s ease;
}
.tile img{display:block;width:100%;height:auto;transition:transform .8s cubic-bezier(.22,.61,.36,1)}
.tile::after{
  content:"";position:absolute;left:0;right:0;bottom:0;height:42%;pointer-events:none;
  background:linear-gradient(to top,rgba(6,18,32,.72),transparent);
  opacity:0;transition:opacity .4s ease;
}
.tile .who{
  position:absolute;left:11px;bottom:10px;z-index:2;
  display:inline-flex;align-items:center;gap:5px;
  padding:3px 10px;border-radius:999px;font-size:11.5px;color:#fff;
  background:rgba(12,26,44,.5);border:1px solid rgba(255,255,255,.24);
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  opacity:0;transform:translateY(6px);transition:opacity .35s ease,transform .35s ease;
}
.tile .who svg{width:10px;height:10px}
.tile:hover{transform:translateY(-4px);box-shadow:0 20px 44px rgba(6,20,36,.42);z-index:3}
.tile:hover img{transform:scale(1.06)}
.tile:hover::after,.tile:hover .who{opacity:1}
.tile:hover .who{transform:translateY(0)}
.tile.loading{min-height:220px}
.tile.loading::before{
  content:"";position:absolute;inset:0;
  background:linear-gradient(100deg,rgba(255,255,255,.05) 30%,rgba(255,255,255,.13) 50%,rgba(255,255,255,.05) 70%);
  background-size:200% 100%;animation:shimmer 1.4s linear infinite;
}
@keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}
.msg{padding:40px;text-align:center;color:var(--muted)}
.wall-more{
  margin-top:22px;padding:14px;text-align:center;font-size:13px;color:var(--muted);
  border-radius:14px;border:1px dashed rgba(255,255,255,.18);background:rgba(12,28,48,.3);
  transition:opacity .3s ease;
}
.wall-more.done{opacity:.7;border-style:solid}
`;

function wallpaperPage(meta) {
  const all = (meta.all || []).slice();
  // 竖图优先排前面（瀑布流视觉更好），横图在后
  all.sort((a, b) => a.ratio - b.ratio || a.id.localeCompare(b.id));

  const items = all.map((r) => ({ id: r.id.replace(/\.[^.]+$/, ''), s: imgSrc(r.id), w: r.w, h: r.h, r: r.ratio }));

  const wallData = `<script>window.__WALL__=${JSON.stringify(items)}<\/script>`;
  const body = `<div class="wrap">
  <div class="headline">
    <div>
      <h1>壁纸墙</h1>
      <p>精选插画收藏 · 共 ${all.length} 张 · 点击可看原图</p>
    </div>
    <div class="acts">
      <button type="button" id="onlyV" class="">只看竖图</button>
      <button type="button" id="onlyH" class="">只看横图</button>
      <button type="button" id="allBtn" class="on">全部</button>
    </div>
  </div>
  <div class="wall" id="wall"></div>
  <div class="wall-more" id="wallMore">向下滚动继续加载…</div>
</div>
<script>
(function () {
  // 分块增量渲染：首屏只放一部分，滚动到底再加载下一块
  var CHUNK = 40;
  var wall = document.getElementById('wall');
  var more = document.getElementById('wallMore');
  var data = window.__WALL__ || [];
  var btns = { v: document.getElementById('onlyV'), h: document.getElementById('onlyH'), all: document.getElementById('allBtn') };
  var mode = 'all';
  var ptr = 0;

  function matches(item) {
    if (mode === 'all') return true;
    if (mode === 'v') return item.r < 1.3;
    return item.r >= 1.3;
  }

  function appendChunk() {
    var added = 0;
    var frag = document.createDocumentFragment();
    while (ptr < data.length && added < CHUNK) {
      var it = data[ptr++];
      if (!matches(it)) continue;
      var a = document.createElement('a');
      a.className = 'tile';
      a.href = it.s;
      a.target = '_blank';
      a.rel = 'noopener';
      a.dataset.ratio = it.r;
      a.title = it.id + ' ' + it.w + '×' + it.h;
      var img = document.createElement('img');
      img.src = it.s;
      img.alt = it.id;
      img.width = it.w;
      img.height = it.h;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = function () { var p = this.closest('.tile'); if (p) p.remove(); };
      a.appendChild(img);
      frag.appendChild(a);
      added++;
    }
    wall.appendChild(frag);
    if (ptr >= data.length) {
      more.textContent = '已经到底啦 · 共 ' + wall.children.length + ' 张';
      more.classList.add('done');
    } else {
      more.textContent = '向下滚动继续加载 · 已显示 ' + wall.children.length + ' / ' + data.length;
    }
  }

  function reset() {
    ptr = 0;
    wall.innerHTML = '';
    more.classList.remove('done');
    appendChunk();
  }

  function setMode(m) {
    mode = m;
    Object.keys(btns).forEach(function (k) { btns[k].classList.toggle('on', k === m); });
    reset();
  }

  // 滚动到底部自动加载下一块
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (ptr >= data.length) return;
      var rect = more.getBoundingClientRect();
      if (rect.top <= window.innerHeight + 400) appendChunk();
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  btns.v.addEventListener('click', function () { setMode('v'); });
  btns.h.addEventListener('click', function () { setMode('h'); });
  btns.all.addEventListener('click', function () { setMode('all'); });

  reset();
})();
</script>`;

  return shell('壁纸墙', '精选 ACG 插画收藏', WALL_CSS, wallData + body, 'wallpaper');
}

/* -------------------------------- 入口 -------------------------------- */

function readJson(p, fallback) {
  try { return JSON.parse(readFileSync(p, 'utf-8')); } catch { return fallback; }
}

const articles = readJson(join(GENERATED, 'articles.json'), []);
const meta = readJson(join(PUBLIC, 'wallpaper-meta.json'), { all: [] });

if (!articles.length) {
  console.error('缺少 src/generated/articles.json，请先运行 build-articles');
  process.exit(1);
}

mkdirSync(join(PUBLIC, 'diary'), { recursive: true });
writeFileSync(join(PUBLIC, 'diary', 'index.html'), diaryPage(articles), 'utf-8');
console.log(`已生成 随心记（${articles.length} 条动态）`);

if (!meta.all || !meta.all.length) {
  console.warn('缺少图片尺寸清单，跳过壁纸墙');
} else {
  mkdirSync(join(PUBLIC, 'wallpaper'), { recursive: true });
  writeFileSync(join(PUBLIC, 'wallpaper', 'index.html'), wallpaperPage(meta), 'utf-8');
  console.log(`已生成 壁纸墙（${meta.all.length} 张，其中横图 ${meta.landscapeCount} / 竖图 ${meta.portraitCount}）`);
}
