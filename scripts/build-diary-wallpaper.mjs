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

const ROOT = process.cwd();
const PUBLIC = join(ROOT, 'public');
const GENERATED = join(ROOT, 'src', 'generated');

const SITE = {
  name: '随波逐流の旅店',
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
    <a class="brand" href="/"><span class="mark">随</span><span class="word">${esc(SITE.name)}</span></a>
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
<style>${SHELL_CSS}${css}</style>
</head>
<body>
${topbar(active)}
${body}
</body>
</html>`;
}

/* ------------------------------ 随心记 ------------------------------ */

const DIARY_CSS = `
.wrap{max-width:864px;margin:0 auto;padding:104px 20px 90px}
.headline{display:flex;align-items:center;gap:14px;margin-bottom:30px}
.headline h1{margin:0;font-size:30px;color:#fff;text-shadow:0 2px 14px rgba(6,20,36,.6)}
.headline .tag{
  padding:3px 13px;border-radius:999px;font-size:12.5px;
  background:rgba(58,163,227,.28);border:1px solid rgba(120,196,240,.5);color:#dff0ff;
  box-shadow:0 0 16px rgba(58,163,227,.35);
}
.headline .count{margin-left:auto;font-size:13px;color:var(--muted)}

/* 时间轴：左侧竖线 + 每个条目一个发光节点 */
.tl{position:relative;padding-left:38px}
.tl::before{
  content:"";position:absolute;left:11px;top:8px;bottom:8px;width:2px;border-radius:2px;
  background:linear-gradient(to bottom,rgba(255,255,255,.05),rgba(255,255,255,.34) 12%,rgba(255,255,255,.34) 88%,rgba(255,255,255,.05));
}
.entry{position:relative;margin-bottom:22px}
.entry::before{
  content:"";position:absolute;left:-33px;top:22px;width:12px;height:12px;border-radius:50%;
  background:#eaf6ff;border:2px solid rgba(58,163,227,.85);
  box-shadow:0 0 14px rgba(120,196,240,.9),0 0 30px rgba(58,163,227,.5);
  transition:transform .3s ease,box-shadow .3s ease;
}
.entry:hover::before{transform:scale(1.25);box-shadow:0 0 20px rgba(160,216,255,1),0 0 40px rgba(58,163,227,.7)}
.card{
  position:relative;border-radius:16px;border:1px solid rgba(255,255,255,.2);
  background:rgba(12,28,48,.42);backdrop-filter:blur(14px) saturate(140%);
  -webkit-backdrop-filter:blur(14px) saturate(140%);
  box-shadow:0 12px 30px rgba(6,20,36,.28);
  padding:16px 20px 15px;transition:transform .35s cubic-bezier(.4,0,.2,1),box-shadow .35s ease,background .35s ease;
}
.entry:hover .card{transform:translateX(5px);background:rgba(20,42,68,.52);box-shadow:0 18px 40px rgba(6,20,36,.38)}
.card .top{display:flex;align-items:center;gap:10px;margin-bottom:9px}
.card .av{
  width:34px;height:34px;flex:none;border-radius:50%;overflow:hidden;
  border:1px solid rgba(255,255,255,.34);box-shadow:0 3px 10px rgba(4,12,24,.4);
}
.card .av img{width:100%;height:100%;object-fit:cover;display:block}
.card .nm{font-size:13.5px;color:#fff}
.card .time{margin-left:auto;font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
.card .text{margin:0;font-size:14.5px;line-height:1.85;color:rgba(255,255,255,.9)}
.card .text a{color:#cfe9fb;text-decoration:none;border-bottom:1px dashed rgba(207,233,251,.5)}
.card .text a:hover{color:#fff}
.card .foot{display:flex;align-items:center;gap:12px;margin-top:12px;padding-top:10px;border-top:1px dashed rgba(255,255,255,.16)}
.card .chip{
  padding:2px 11px;border-radius:999px;font-size:11.5px;color:rgba(255,255,255,.82);
  background:rgba(255,255,255,.11);border:1px solid rgba(255,255,255,.18);
}
.card .chip:hover{background:rgba(58,163,227,.4);color:#fff}
.card .like{margin-left:auto;display:inline-flex;align-items:center;gap:5px;font-size:12px;color:rgba(255,255,255,.55)}
.card .like svg{width:13px;height:13px}
.empty{padding:36px;text-align:center;color:var(--muted)}
@media(max-width:640px){
  .wrap{padding:92px 14px 70px}
  .headline h1{font-size:23px}
  .tl{padding-left:30px}
  .entry::before{left:-26px;width:10px;height:10px}
  .card{padding:14px 16px}
  .card .time{font-size:11px}
}
`;

function diaryPage(articles) {
  const entries = articles
    .map((a) => {
      const cat = (a.categories && a.categories[0]) || '随笔';
      const body = a.desc
        ? esc(a.desc)
        : `<a href="${a.url}">${esc(a.title)}</a>`;
      return `<article class="entry">
  <div class="card">
    <div class="top">
      <span class="av"><img src="${esc(SITE.avatar)}" alt="${esc(SITE.author)}" loading="lazy"></span>
      <span class="nm">${esc(SITE.author)}</span>
      ${a.date ? `<time class="time">${esc(a.date)}</time>` : ''}
    </div>
    <p class="text">${body}</p>
    <div class="foot">
      <a class="chip" href="/article-list/">「${esc(cat)}」</a>
      <a class="chip" href="${a.url}">${esc(a.title)}</a>
      <span class="like" title="评论数需接入评论系统后显示">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 9 9 0 0 1-3.8-.8L3 21l1.9-5.4a8.2 8.2 0 0 1-.9-3.7A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/></svg>
        —
      </span>
    </div>
  </div>
</article>`;
    })
    .join('\n');

  return shell(
    '随心记',
    '旅店里的碎碎念与近况',
    DIARY_CSS,
    `<div class="wrap">
  <div class="headline">
    <span class="tag">我的动态</span>
    <h1>随心记</h1>
    <span class="count">共 ${articles.length} 条</span>
  </div>
  <div class="tl">
${entries}
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
`;

function wallpaperPage(meta) {
  const all = (meta.all || []).slice();
  // 竖图优先排前面（瀑布流视觉更好），横图在后
  all.sort((a, b) => a.ratio - b.ratio || a.id.localeCompare(b.id));

  const tiles = all
    .map((r) => {
      const src = imgSrc(r.id);
      const label = r.id.replace(/\.[^.]+$/, '');
      return `<a class="tile" href="${src}" target="_blank" rel="noopener" data-ratio="${r.ratio}" title="${esc(r.id)} ${r.w}×${r.h}">
  <img src="${src}" alt="${esc(r.id)}" width="${r.w}" height="${r.h}" loading="lazy" decoding="async" onerror="this.closest('.tile').remove()">
  <span class="who">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z"/><circle cx="9" cy="10" r="1.6"/><path d="m5 17 4.5-4.5 3 3L16 12l4 4.5"/></svg>
    ${esc(label)}
  </span>
</a>`;
    })
    .join('\n');

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
  <div class="wall" id="wall">
${tiles}
  </div>
</div>
<script>
(function () {
  var wall = document.getElementById('wall');
  var tiles = Array.prototype.slice.call(wall.querySelectorAll('.tile'));
  var btns = { v: document.getElementById('onlyV'), h: document.getElementById('onlyH'), all: document.getElementById('allBtn') };
  function setMode(mode) {
    tiles.forEach(function (t) {
      var ratio = parseFloat(t.dataset.ratio || '1');
      var show = mode === 'all' || (mode === 'v' && ratio < 1.3) || (mode === 'h' && ratio >= 1.3);
      t.style.display = show ? '' : 'none';
    });
    Object.keys(btns).forEach(function (k) { btns[k].classList.toggle('on', k === mode); });
  }
  btns.v.addEventListener('click', function () { setMode('v'); });
  btns.h.addEventListener('click', function () { setMode('h'); });
  btns.all.addEventListener('click', function () { setMode('all'); });
})();
</script>`;

  return shell('壁纸墙', '精选 ACG 插画收藏', WALL_CSS, body, 'wallpaper');
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
