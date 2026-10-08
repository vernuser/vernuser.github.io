/*
 * 生成站点内的静态子页面：关于店长 / 员工们（友链）/ 留言板
 * 数据来源：content 下的 about、link、comments 与 _data/link.yml
 * 输出：public/about/index.html、public/link/index.html、public/comments/index.html
 * 运行：node scripts/build-pages.mjs（已挂在 prebuild）
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { marked } from 'marked';
import { WIDGET_CSS, siteFooter, musicPlayer } from './site-widgets.mjs';

const ROOT = process.cwd();
const SRC = join(ROOT, 'content');
const PUBLIC = join(ROOT, 'public');
const GENERATED = join(ROOT, 'src', 'generated');
const SITE_TITLE = '艾恩葛朗特第一层の旅店';
const AUTHOR = 'vernus';
const GH_USER = 'vernuser';
const SINCE = '2023.04.12';

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

/* 关于店长页：主站同款背景 + 工牌卡片 + GitHub 打卡本 */
const ABOUT_CSS = `
:root{
  --glass-2:rgba(12,28,48,.55); --ink-brown:#eaf3ff; --ink-body:rgba(233,242,253,.88);
  --gold:#e0a545; --gold-soft:#d9a54e; --line-soft:rgba(255,255,255,.16); --tag-bg:rgba(255,255,255,.1);
  --lv0:rgba(255,255,255,.08); --lv1:#7a5c28; --lv2:#b98a34; --lv3:#dfa445; --lv4:#f5c86a;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{
  min-height:100vh; color:var(--ink-body);
  font:15px/1.9 "PingFang SC","Microsoft YaHei",system-ui,-apple-system,sans-serif;
  background:#0d2137 url('/SAO-bg.jpg') center/cover fixed no-repeat;
}
body::before{content:'';position:fixed;inset:0;background:rgba(8,20,36,.7);z-index:-1}
.topbar-in{background:rgba(78,86,120,.42)}
.nav-menu a{color:rgba(255,252,245,.9)}
.back{display:inline-flex;align-items:center;padding:7px 16px;border-radius:999px;background:rgba(226,236,248,.16);border:1px solid rgba(255,255,255,.22);color:#fff;text-decoration:none;font-size:14px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);transition:.3s}
.back:hover{background:rgba(58,163,227,.5);border-color:transparent}

.about-wrap{position:relative;z-index:1;max-width:1160px;margin:0 auto;padding:112px 22px 84px;display:flex;gap:36px;align-items:flex-start}

/* ---------- 左栏：工牌 ---------- */
.staff{flex:0 0 302px;width:302px;position:sticky;top:96px;margin-top:14px}
.tape{
  position:absolute;top:-11px;left:50%;width:104px;height:24px;z-index:3;
  background:rgba(224,165,69,.32);transform:translateX(-50%) rotate(-3.5deg);
  box-shadow:0 2px 7px rgba(4,12,24,.3);border-left:1px dashed rgba(255,255,255,.3);border-right:1px dashed rgba(255,255,255,.3);
  backdrop-filter:blur(2px);
}
.staff{background:var(--glass-2);border-radius:20px;overflow:visible;box-shadow:0 18px 44px rgba(4,12,24,.45);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(16px) saturate(140%);-webkit-backdrop-filter:blur(16px) saturate(140%)}
.staff-top{
  position:relative;height:118px;border-radius:20px 20px 0 0;overflow:hidden;
  background:linear-gradient(135deg,#31406e 0%,#4a3f8f 60%,#5d4a8a 100%);
}
.staff-top::after{content:'';position:absolute;inset:0;background:radial-gradient(220px 90px at 18% 12%, rgba(255,255,255,.22), transparent 60%),radial-gradient(180px 70px at 82% 85%, rgba(255,255,255,.14), transparent 55%)}
.staff-top .stars{position:absolute;left:22px;top:16px;z-index:1;color:rgba(255,255,255,.72);font-size:11px;letter-spacing:.18em}
.staff-top .badge-word{
  position:absolute;right:20px;top:50%;z-index:1;transform:translateY(-50%);
  color:rgba(255,255,255,.94);font:600 11.5px/1 Georgia,'Times New Roman',serif;letter-spacing:.26em;text-transform:uppercase;
  text-shadow:0 1px 6px rgba(30,20,60,.4);
}
.staff-body{padding:0 26px 24px;text-align:center}
.face{
  width:112px;height:112px;margin:-56px auto 0;border-radius:50%;overflow:hidden;position:relative;
  border:4px solid rgba(255,255,255,.92);box-shadow:0 0 0 3px var(--gold-soft),0 10px 22px rgba(4,12,24,.5);
  background:#16283f;transition:transform .35s ease;
}
.face:hover{transform:scale(1.05)}
.face img{width:100%;height:100%;object-fit:cover;display:block}
.staff-name{margin:12px 0 2px;font:700 26px/1.2 Georgia,'Times New Roman','Songti SC',serif;color:#fff;letter-spacing:.04em;text-shadow:0 2px 10px rgba(4,12,24,.5)}
.staff-role{margin:0;font-size:12.5px;color:rgba(233,242,253,.6);letter-spacing:.05em}
.staff-quote{margin:14px auto 6px;max-width:230px;font-size:12.5px;color:rgba(233,242,253,.75);line-height:1.7;padding:8px 12px;border-top:1px dashed var(--line-soft);border-bottom:1px dashed var(--line-soft)}
.staff-info{list-style:none;margin:14px 0 0;padding:0;text-align:left}
.staff-info li{display:flex;align-items:center;gap:9px;padding:6.5px 4px;border-bottom:1px dashed rgba(255,255,255,.14);font-size:12.8px}
.staff-info li:last-child{border-bottom:0}
.staff-info .ic{flex:none;width:17px;height:17px;color:var(--gold);display:inline-flex}
.staff-info .ic svg{width:100%;height:100%}
.staff-info .k{flex:none;color:rgba(233,242,253,.55);font-size:12px}
.staff-info .v{margin-left:auto;color:var(--ink-body);text-align:right}
.staff-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:15px}
.pill-tag{display:inline-block;padding:2.5px 11px;border-radius:999px;background:var(--tag-bg);border:1px solid rgba(255,255,255,.2);color:rgba(233,242,253,.85);font-size:11.5px;transition:.25s}
.pill-tag:hover{background:var(--gold-soft);color:#1a2438;border-color:transparent}
.staff-socials{display:flex;justify-content:center;gap:11px;margin-top:17px}
.staff-socials a{
  width:37px;height:37px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;
  background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);color:rgba(233,242,253,.8);
  transition:all .3s cubic-bezier(.075,.82,.165,1);
}
.staff-socials a:hover{background:rgba(58,163,227,.55);color:#fff;transform:translateY(-3px);box-shadow:0 8px 18px rgba(58,163,227,.35)}
.barcode{
  margin-top:19px;height:34px;border-radius:3px;
  background:repeating-linear-gradient(90deg,rgba(233,242,253,.82) 0 2px,transparent 2px 5px,rgba(233,242,253,.82) 5px 6px,transparent 6px 8px,rgba(233,242,253,.82) 8px 11px,transparent 11px 14px,rgba(233,242,253,.82) 14px 15px,transparent 15px 19px);
}
.staff-no{margin-top:6px;font:600 10.5px/1 Georgia,'Times New Roman',serif;letter-spacing:.42em;color:rgba(233,242,253,.55)}

/* ---------- 右栏 ---------- */
.about-main{flex:1 1 auto;min-width:0}
.crumb{display:flex;align-items:center;justify-content:space-between;gap:14px}
.crumb-no{font:700 12px/1 Georgia,'Times New Roman',serif;letter-spacing:.3em;color:var(--gold-soft)}
.about-title{
  margin:14px 0 4px;font-size:38px;line-height:1.2;color:#fff;
  font-family:Georgia,'Times New Roman','Songti SC',serif;letter-spacing:.02em;
  text-shadow:0 2px 14px rgba(6,20,36,.6);
}
.about-sub{margin:0 0 22px;font-size:13px;color:rgba(255,255,255,.75);text-shadow:0 1px 8px rgba(6,20,36,.6)}
.about-panel{
  background:var(--glass-2);border:1px solid rgba(255,255,255,.18);border-radius:18px;
  padding:30px 34px;box-shadow:0 12px 34px rgba(4,12,24,.4);
  backdrop-filter:blur(16px) saturate(140%);-webkit-backdrop-filter:blur(16px) saturate(140%);
}
.about-panel p{margin:.9em 0}
.about-panel h2{
  color:#fff;font-size:18px;margin:1.6em 0 .6em;
  border-left:3px solid var(--gold-soft);padding-left:12px;
}
.about-panel a{color:#7cc4ec}
.about-panel del{color:rgba(233,242,253,.45)}

/* GitHub 打卡本 */
.gh-card{margin-top:26px;background:var(--glass-2);border:1px solid rgba(255,255,255,.18);border-radius:18px;padding:24px 28px;box-shadow:0 12px 34px rgba(4,12,24,.4);backdrop-filter:blur(16px) saturate(140%);-webkit-backdrop-filter:blur(16px) saturate(140%)}
.gh-head{display:flex;align-items:center;gap:10px}
.gh-head h3{margin:0;font-size:16.5px;color:#fff}
.gh-head svg{color:#fff}
.gh-user{margin-left:auto;font-size:12.5px;color:var(--gold);text-decoration:none}
.gh-user:hover{text-decoration:underline}
.gh-stats{display:flex;gap:34px;margin:16px 2px 18px}
.gh-stats .stat{display:flex;flex-direction:column;gap:2px}
.gh-stats .stat b{font:700 24px/1.1 Georgia,'Times New Roman',serif;color:var(--gold)}
.gh-stats .stat span{font-size:11.5px;color:rgba(233,242,253,.55)}
.heat-scroll{overflow-x:auto;padding-bottom:4px;scrollbar-width:none}
.heat-scroll::-webkit-scrollbar{height:0;display:none}
.heat-months{display:grid;grid-template-columns:repeat(53,10px);gap:3px;margin-left:24px;margin-bottom:4px}
.heat-months span{font-size:10px;color:rgba(233,242,253,.5);white-space:nowrap}
.heat-body{display:flex;gap:5px}
.heat-days{display:grid;grid-template-rows:repeat(7,10px);gap:3px;margin-right:2px}
.heat-days span{font-size:9.5px;color:rgba(233,242,253,.45);line-height:10px;height:10px}
.heat-grid{display:grid;grid-template-rows:repeat(7,10px);grid-auto-flow:column;grid-auto-columns:10px;gap:3px}
.hc{width:10px;height:10px;border-radius:2px;background:var(--lv0)}
.hc.lv0{background:var(--lv0)}
.hc.lv1{background:var(--lv1)}
.hc.lv2{background:var(--lv2)}
.hc.lv3{background:var(--lv3)}
.hc.lv4{background:var(--lv4)}
.hc.empty{background:transparent}
.gh-legend{display:flex;align-items:center;gap:4px;justify-content:flex-end;margin-top:10px;font-size:11px;color:rgba(233,242,253,.55)}
.gh-legend .hc{width:10px;height:10px}

/* 底部星光横幅 */
.night-banner{
  position:relative;margin-top:26px;border-radius:18px;padding:30px 34px;overflow:hidden;
  background:linear-gradient(135deg,#31406e 0%,#4c3d7d 55%,#5d4a8a 100%);
  box-shadow:0 16px 40px rgba(60,50,100,.28);
}
.night-banner::after{
  content:'';position:absolute;inset:0;pointer-events:none;
  background:
    radial-gradient(3px 3px at 12% 26%, rgba(255,255,255,.85) 45%, transparent 55%),
    radial-gradient(2px 2px at 34% 68%, rgba(255,255,255,.6) 45%, transparent 55%),
    radial-gradient(2.5px 2.5px at 55% 22%, rgba(255,255,255,.75) 45%, transparent 55%),
    radial-gradient(2px 2px at 72% 55%, rgba(255,255,255,.55) 45%, transparent 55%),
    radial-gradient(3px 3px at 88% 30%, rgba(255,255,255,.8) 45%, transparent 55%),
    radial-gradient(2px 2px at 22% 82%, rgba(255,255,255,.5) 45%, transparent 55%),
    radial-gradient(2px 2px at 64% 86%, rgba(255,255,255,.6) 45%, transparent 55%);
}
.nb-stars{position:relative;z-index:1;color:rgba(255,255,255,.55);font-size:11px;letter-spacing:.2em}
.nb-en{position:relative;z-index:1;margin:10px 0 6px;font:italic 600 21px/1.4 Georgia,'Times New Roman',serif;color:#fff;letter-spacing:.01em}
.nb-zh{position:relative;z-index:1;margin:0;font-size:12.5px;color:rgba(255,255,255,.72);letter-spacing:.06em}

@media(max-width:900px){
  .about-wrap{flex-direction:column;padding:96px 16px 60px}
  .staff{position:static;width:100%;flex:none}
  .about-title{font-size:30px}
  .about-panel,.gh-card{padding:22px 18px}
  .gh-stats{gap:22px}
}
@media(max-width:640px){
  .heat-months,.heat-days,.heat-grid{display:none}
  .heat-scroll::after{content:'（打卡日历请在宽屏查看）';font-size:11.5px;color:rgba(233,242,253,.55)}
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
<style>${TOPBAR_CSS}${BASE_CSS}${extraCss}${WIDGET_CSS}</style>
</head>
<body>
<header class="topbar">
  <div class="topbar-in">
    <a class="brand" href="/"><span class="mark">剑</span><span class="word">${esc(SITE_TITLE)}</span></a>
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
${siteFooter()}
${musicPlayer()}
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

/* ------------------------- 关于店长：GitHub 打卡本 ------------------------- */

const GH_CACHE = join(GENERATED, 'github-contributions.json');

/** 构建期拉取最近数年的贡献数据，成功后写入缓存；失败时回退到上次缓存 */
async function fetchGithubContributions() {
  const url = `https://github-contributions-api.jogruber.de/v4/${GH_USER}`;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'remio-home-build' } });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.contributions) && data.contributions.length) {
        const out = { fetchedAt: new Date().toISOString(), user: GH_USER, contributions: data.contributions };
        mkdirSync(dirname(GH_CACHE), { recursive: true });
        writeFileSync(GH_CACHE, JSON.stringify(out), 'utf-8');
        console.log(`GitHub 打卡本：已更新（${data.contributions.length} 天）`);
        return out;
      }
    }
    console.log(`GitHub 贡献接口返回异常（${res.status}），尝试使用缓存`);
  } catch (e) {
    console.log(`GitHub 贡献接口不可达（${e.message}），尝试使用缓存`);
  }
  try {
    const cached = JSON.parse(readFileSync(GH_CACHE, 'utf-8'));
    console.log(`GitHub 打卡本：使用缓存（${cached.fetchedAt}）`);
    return cached;
  } catch {
    console.log('GitHub 打卡本：无缓存，本次不渲染热力图');
    return null;
  }
}

const fmtDay = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;

/** 把贡献数据整理成 53 周 × 7 天的格子，并算出三项统计 */
function heatData(contrib) {
  const byDate = new Map(contrib.contributions.map((c) => [c.date, c]));
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dow = (today.getDay() + 6) % 7; // 周一 = 0
  const end = new Date(today); end.setDate(today.getDate() + (6 - dow)); // 本周日
  const start = new Date(end); start.setDate(end.getDate() - 52 * 7 - 6); // 53 周前的周一

  const cols = [];
  let total = 0, max = 0;
  for (let w = 0; w < 53; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dt = new Date(start); dt.setDate(start.getDate() + w * 7 + d);
      const key = fmtDay(dt);
      const future = dt > today;
      const rec = byDate.get(key);
      const count = rec ? rec.count : 0;
      if (!future && count) { total += count; if (count > max) max = count; }
      week.push({ key, future, count, level: future ? -1 : (rec ? rec.level : 0) });
    }
    cols.push(week);
  }

  // 最长连续打卡（截至今天）
  let streak = 0, run = 0;
  const done = contrib.contributions
    .filter((c) => c.date <= fmtDay(today))
    .sort((a, b) => a.date.localeCompare(b.date));
  for (const c of done) {
    if (c.count > 0) { run++; if (run > streak) streak = run; } else run = 0;
  }
  return { cols, total, max, streak };
}

/** 渲染 GitHub 打卡本卡片（无数据时返回空串） */
function heatCard(contrib) {
  if (!contrib) return '';
  const { cols, total, max, streak } = heatData(contrib);

  // 月标签：每列取周一日期，该月第一次出现的列上标注
  const seen = new Set();
  const months = cols
    .map((week) => {
      const dt = new Date(week[0].key + 'T00:00:00');
      const m = dt.getMonth();
      if (seen.has(m)) return '';
      seen.add(m);
      return `${m + 1}月`;
    })
    .map((s) => `<span>${s}</span>`)
    .join('');

  const cells = cols
    .flatMap((week) => week.map((c) => {
      if (c.future) return `<i class="hc empty" aria-hidden="true"></i>`;
      return `<i class="hc lv${c.level < 0 ? 0 : c.level}" title="${c.key} · ${c.count} 次贡献"></i>`;
    }))
    .join('');

  return `<section class="gh-card">
  <div class="gh-head">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0C17.7 4.7 18.7 5 18.7 5c.6 1.5.2 2.7.1 3 .8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>
    <h3>GitHub 打卡本</h3>
    <a class="gh-user" href="https://github.com/${GH_USER}" target="_blank" rel="noopener">@${GH_USER}</a>
  </div>
  <div class="gh-stats">
    <div class="stat"><b>${total.toLocaleString('en-US')}</b><span>最近一年贡献</span></div>
    <div class="stat"><b>${streak}</b><span>最长连续打卡</span></div>
    <div class="stat"><b>${max}</b><span>单日最多</span></div>
  </div>
  <div class="heat-scroll">
    <div class="heat-months">${months}</div>
    <div class="heat-body">
      <div class="heat-days"><span>一</span><span></span><span>三</span><span></span><span>五</span><span></span><span></span></div>
      <div class="heat-grid">${cells}</div>
    </div>
  </div>
  <div class="gh-legend"><span>少</span><i class="hc lv0"></i><i class="hc lv1"></i><i class="hc lv2"></i><i class="hc lv3"></i><i class="hc lv4"></i><span>多</span></div>
</section>`;
}

/** 左栏：工牌式个人卡片 */
function staffCard() {
  const info = [
    ['pin', '坐标', '飘忽不定 · 天南海北'],
    ['target', '主攻', '网安 / CTF / Python'],
    ['id', '身份', '一个菜菜的 ctfer'],
    ['cal', '开店', SINCE],
    ['heart', '状态', '人长在肝身上（绝铁崩鸣尘）']
  ];
  const icons = {
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
    id: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><circle cx="8.4" cy="11" r="2"/><path d="M5.4 16.2c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4M14.5 9.5h4.2M14.5 13h4.2"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 2.8V6M16 2.8V6"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20.5S3.5 15.4 3.5 9.3A4.8 4.8 0 0 1 12 6.4a4.8 4.8 0 0 1 8.5 2.9c0 6.1-8.5 11.2-8.5 11.2Z"/></svg>'
  };
  const rows = info
    .map(([ic, k, v]) => `<li><span class="ic">${icons[ic]}</span><span class="k">${k}</span><span class="v">${esc(v)}</span></li>`)
    .join('\n');
  const pills = ['python', '靶场', '网安', 'galgame', '二次元', '崩铁', '崩三', '绝区零', '读书', 'GitHub']
    .map((t) => `<span class="pill-tag">${esc(t)}</span>`)
    .join('');

  return `<aside class="staff">
  <div class="tape" aria-hidden="true"></div>
  <div class="staff-top">
    <span class="stars" aria-hidden="true">✦&nbsp;·&nbsp;˚&nbsp;✧&nbsp;·&nbsp;✦&nbsp;·&nbsp;˚&nbsp;✧&nbsp;·&nbsp;✦</span>
    <span class="badge-word">AINCRAD 1F · STAFF</span>
  </div>
  <div class="staff-body">
    <div class="face"><img src="/icons/cards/avatar.png" alt="${esc(AUTHOR)}"></div>
    <h2 class="staff-name">${esc(AUTHOR)}</h2>
    <p class="staff-role">艾恩葛朗特第一层 店长 · No.${SINCE.replaceAll('.', '')}</p>
    <blockquote class="staff-quote">「愿终有一天能与你重要的人重逢」</blockquote>
    <ul class="staff-info">${rows}</ul>
    <div class="staff-tags">${pills}</div>
    <div class="staff-socials">
      <a href="https://github.com/${GH_USER}" target="_blank" rel="noopener" title="GitHub" aria-label="GitHub"><svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0C17.7 4.7 18.7 5 18.7 5c.6 1.5.2 2.7.1 3 .8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg></a>
      <a href="https://space.bilibili.com/348470293" target="_blank" rel="noopener" title="BiliBili" aria-label="BiliBili"><svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M17.8 4.6h2.7c1 0 1.8.8 1.8 1.8v10.4c0 1-.8 1.8-1.8 1.8H3.5c-1 0-1.8-.8-1.8-1.8V6.4c0-1 .8-1.8 1.8-1.8h2.7L4.9 3.3c-.3-.3-.3-.7 0-1 .3-.3.7-.3 1 0l2.4 2.3h7.4l2.4-2.3c.3-.3.7-.3 1 0 .3.3.3.7 0 1l-1.3 1.3zM7.2 10.6c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm9.6 0c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"/></svg></a>
      <a href="mailto:vernuser@foxmail.com" title="邮箱" aria-label="邮箱"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 6.5 9 6.5 9-6.5"/></svg></a>
      <a href="http://wpa.qq.com/msgrd?v=3&uin=840683056&site=qq&menu=yes" target="_blank" rel="noopener" title="QQ" aria-label="QQ"><svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M12 2c3 0 5.2 2.3 5.2 5.4 0 1 .3 1.6.9 2.6.9 1.5 1.9 3 1.9 5.1 0 1.4-.5 2.3-1.3 2.3-.6 0-1.1-.5-1.5-1.3-.8 1.4-2.2 2.4-3.9 2.4h-2.6c-1.7 0-3.1-1-3.9-2.4-.4.8-.9 1.3-1.5 1.3-.8 0-1.3-.9-1.3-2.3 0-2.1 1-3.6 1.9-5.1.6-1 .9-1.6.9-2.6C6.8 4.3 9 2 12 2z"/></svg></a>
    </div>
    <div class="barcode" aria-hidden="true"></div>
    <div class="staff-no">NO.${SINCE.replaceAll('.', '')}</div>
  </div>
</aside>`;
}

function buildAbout(contrib) {
  const p = join(SRC, 'about', 'index.md');
  if (!existsSync(p)) return null;
  const { body } = parseFrontMatter(readFileSync(p, 'utf-8'));
  const html = marked.parse(stripHexoTags(body));

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>关于店长 · ${esc(SITE_TITLE)}</title>
<link rel="icon" href="/favicon.ico">
<style>${TOPBAR_CSS}${ABOUT_CSS}${WIDGET_CSS}</style>
</head>
<body>
<header class="topbar">
  <div class="topbar-in">
    <a class="brand" href="/"><span class="mark">剑</span><span class="word">${esc(SITE_TITLE)}</span></a>
    <nav>
      <ul class="nav-menu">
        <li><a href="/">首页</a></li>
        <li><a href="/diary/">随心记</a></li>
        <li><a href="/wallpaper/">壁纸墙</a></li>
        <li><a href="/link/">友人帐</a></li>
        <li><a class="active" href="/about/">关于我</a></li>
      </ul>
    </nav>
    <a class="avatar-btn" href="/about/" title="${esc(AUTHOR)}"><img src="/icons/cards/avatar.png" alt="${esc(AUTHOR)}"></a>
  </div>
</header>
<div class="about-wrap">
  ${staffCard()}
  <div class="about-main">
    <div class="crumb"><span class="crumb-no">✦ 01 / PROFILE</span><a class="back" href="/">← 返回主页</a></div>
    <h1 class="about-title">关于店长</h1>
    <p class="about-sub">怎么说呢 —— 唔，很高兴你能来到这间艾恩葛朗特第一层的旅店 😀</p>
    <div class="about-panel">${html}</div>
    ${heatCard(contrib)}
    <div class="night-banner">
      <div class="nb-stars" aria-hidden="true">✦&nbsp;&nbsp;·&nbsp;&nbsp;✧&nbsp;&nbsp;·&nbsp;&nbsp;✦&nbsp;&nbsp;·&nbsp;&nbsp;˚&nbsp;&nbsp;·&nbsp;&nbsp;✧</div>
      <p class="nb-en">May we meet once more in the shining future.</p>
      <p class="nb-zh">愿终有一天能与你重要的人重逢 —— ${esc(SITE_TITLE)}</p>
    </div>
  </div>
</div>
${siteFooter()}
${musicPlayer()}
</body>
</html>`;
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

const contrib = await fetchGithubContributions();
const pages = [
  ['about', () => buildAbout(contrib)],
  ['link', buildLink],
  ['comments', buildComments]
];

let built = 0;
for (const [dir, fn] of pages) {
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
