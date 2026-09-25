/*
 * 生成博客版式首页 public/index.html —— 覆盖 Next 导出的主页
 *   左栏：个人信息 / 热门+最近+最新评论 三标签列表 / 分类 / 标签云 / 站点信息
 *   右栏：文章卡片墙（两栏，悬停放大、其余虚化）
 * 数据源：content/_posts（构建期读取）
 * 所有样式与结构为本站原创实现，配色取自本地背景插画。
 * 运行：node scripts/build-home.mjs（已挂在 prebuild）
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const POSTS_DIR = join(ROOT, 'content', '_posts');
const DATA_DIR = join(ROOT, 'content', '_data');
const PUBLIC = join(ROOT, 'public');
const GENERATED = join(ROOT, 'src', 'generated');

/* ------------------------------- 图床配置 ------------------------------- */
// 图片仓库：https://github.com/vernuser/acg-wallpaper （654 张 ACG 插画，长边 1600px）
// 主用 jsDelivr（国内较稳），加载失败时 onerror 回退到 raw.githubusercontent.com
// 主源用 raw.githubusercontent（jsDelivr 在部分网络下不稳/限流），失败再回退 jsDelivr
const WALLPAPER_REPO = 'vernuser/acg-wallpaper';
const WALLPAPER_BRANCH = 'main';
const WALLPAPER_RAW = (id) => `https://raw.githubusercontent.com/${WALLPAPER_REPO}/${WALLPAPER_BRANCH}/acg/${id}`;
const WALLPAPER_CDN = (id) => `https://cdn.jsdelivr.net/gh/${WALLPAPER_REPO}@${WALLPAPER_BRANCH}/acg/${id}`;

/** 读取横图清单（public/wallpaper-meta.json，由 scripts/build-wallpaper-meta.mjs 生成） */
function readWallpaperIds() {
  const p = join(PUBLIC, 'wallpaper-meta.json');
  if (!existsSync(p)) return [];
  try {
    const meta = JSON.parse(readFileSync(p, 'utf-8'));
    // 只取横图，且优先"更横"的（大卡片裁切更好看）
    return (meta.landscape || []).map((r) => r.id);
  } catch { return []; }
}

/** 稳定的字符串哈希（同一篇文章每次构建拿到同一张图） */
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0);
}

/** 本地是否已有该封面的镜像（public/covers/<id>.jpg） */
function hasLocalCover(id) {
  return existsSync(join(PUBLIC, 'covers', id.replace(/\.[^.]+$/, '.jpg')));
}

/** 为每篇文章分配横图封面：按列表顺序取，互不重复，且分配结果稳定 */
function assignWallpapers(articles, ids) {
  if (!ids.length) {
    console.log('未找到横图清单，保留原有封面');
    return articles;
  }
  const used = new Set();
  let local = 0;
  articles.forEach((a) => {
    // 起点由 slug 决定（同一篇固定），再顺延到下一个未被占用的横图
    let idx = hashStr(`${a.slug}#cover`) % ids.length;
    let guard = 0;
    while (used.has(idx) && guard < ids.length) { idx = (idx + 1) % ids.length; guard++; }
    used.add(idx);
    const id = ids[idx];
    if (hasLocalCover(id)) {
      // 同域本地封面：加载最快最稳
      a.cover = `/covers/${id.replace(/\.[^.]+$/, '.jpg')}`;
      a.coverFallback = WALLPAPER_RAW(id);
      local++;
    } else {
      a.cover = WALLPAPER_RAW(id);
      a.coverFallback = WALLPAPER_CDN(id);
    }
  });
  console.log(`已为 ${articles.length} 篇文章分配横图封面（候选 ${ids.length} 张，其中本地 ${local} 张）`);
  return articles;
}

const SITE = {
  name: '随波逐流の旅店',
  author: 'vernus',
  bio: '愿终有一天能与你重要的人重逢',
  avatar: '/icons/cards/avatar.png'
};

const DEAD_HOSTS = ['imgchr.com', 'imgse.com', 's2.loli.net', 'i.loli.net', 'imgtu.com'];

/* ------------------------------- 工具函数 ------------------------------- */

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function parseFrontMatter(raw) {
  const m = raw.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const li = line.match(/^\s+-\s+(.*)$/);
    if (li && key) {
      const v = li[1].trim().replace(/^['"]|['"]$/g, '');
      if (!Array.isArray(data[key])) data[key] = [];
      data[key].push(v);
      continue;
    }
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (kv) {
      key = kv[1];
      const v = kv[2].trim();
      if (v === '') data[key] = '';
      else if (v.startsWith('[') && v.endsWith(']')) {
        data[key] = v.slice(1, -1).split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
      } else data[key] = v.replace(/^['"]|['"]$/g, '');
    }
  }
  return { data, body: m[2] };
}

/** 已知失效的图床（优先用黑名单，避免逐个探测） */
function usable(url) {
  if (!url || !/^https?:\/\//i.test(url)) return false;
  try {
    const host = new URL(url).host;
    return !DEAD_HOSTS.some((d) => host.includes(d));
  } catch { return false; }
}

/**
 * 图片可用性体检（结果持久化到 src/generated/image-health.json）
 * - 探测成功：直接标记可用
 * - 连续失败 2 次：标记失效，后续构建不再探测，封面走渐变兜底
 * 这样多次构建的封面结果保持稳定，不会因为网络抖动来回变。
 */
const HEALTH_FILE = join(GENERATED, 'image-health.json');
let health = {};
try { if (existsSync(HEALTH_FILE)) health = JSON.parse(readFileSync(HEALTH_FILE, 'utf-8')); } catch { health = {}; }

const PROBE_TIMEOUT = 6000;
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function probeOnce(url) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), PROBE_TIMEOUT);
    // 用 GET 且带浏览器 UA / 图片 Accept：部分图床对 HEAD 或无 UA 的请求会返回 200 占位内容
    const res = await fetch(url, {
      method: 'GET',
      signal: ctrl.signal,
      redirect: 'follow',
      headers: { 'User-Agent': BROWSER_UA, Accept: 'image/avif,image/webp,image/*,*/*;q=0.8' }
    });
    clearTimeout(timer);

    // 1) 状态码必须为 2xx（注意：部分图床对失效图片会返回 404 + image/png 的错误占位图，
    //    所以不能只看 content-type，必须先用状态码判定）
    if (res.status < 200 || res.status >= 300) {
      // 4xx 属于「明确失效」，不需要重试；5xx 视为服务端临时问题
      return { ok: false, hard: res.status < 500 };
    }

    // 2) 必须是图片类型，HTML 一律视为失效（多为图床的错误提示页）
    // 2) 明确是网页（HTML）才算失效；其他类型放宽，避免误杀图床
    const type = (res.headers.get('content-type') || '').toLowerCase();
    if (type.includes('text/html') || type.includes('application/json')) {
      return { ok: false, hard: true };
    }

    // 3) 最终地址若换到了别的域名（或已知失效图床），按失效处理
    try {
      const finalHost = new URL(res.url || url).host;
      const origHost = new URL(url).host;
      // 只有跳到「已知失效图床」才判死；跳到 CDN/其他域名属于正常加速，放行
      if (DEAD_HOSTS.some((d) => finalHost.includes(d))) return { ok: false, hard: true };
      void origHost;
    } catch {
      /* 地址解析失败则忽略该判定 */
    }
    return { ok: true, hard: false };
  } catch {
    return { ok: false, hard: false }; // 超时/网络错误：软失败，允许重试
  }
}

/** 有限并发，避免一次性开太多连接 */
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return out;
}

async function ensureHealth(urls) {
  const unknown = urls.filter((u) => !health[u]);
  if (unknown.length) {
    console.log(`封面体检：探测 ${unknown.length} 个新链接…`);
    await mapLimit(unknown, 6, async (u) => {
      const r = await probeOnce(u);
      const rec = health[u] || { fails: 0, ok: false };
      if (r.ok) health[u] = { fails: 0, ok: true };
      else if (r.hard) health[u] = { fails: 99, ok: false }; // 明确失效，直接判死
      else health[u] = { fails: (rec.fails || 0) + 1, ok: false };
    });
    mkdirSync(GENERATED, { recursive: true });
    writeFileSync(HEALTH_FILE, JSON.stringify(health, null, 2), 'utf-8');
  }
  return health;
}

/** 根据体检结果剔除失效封面 */
async function filterCovers(articles) {
  const urls = [...new Set(articles.map((a) => a.cover).filter(Boolean))];
  const h = await ensureHealth(urls);
  const dead = (u) => h[u] && h[u].ok === false && (h[u].fails || 0) >= 2;
  let dropped = 0;
  for (const a of articles) {
    if (a.cover && dead(a.cover)) { a.cover = ''; dropped++; }
  }
  console.log(`封面体检：${urls.length} 个链接，${urls.filter((u) => !dead(u)).length} 个可用，${dropped} 篇改用渐变兜底`);
  return articles;
}

function firstImage(body) {
  const re = /!\[[^\]]*\]\(([^)\s]+)/g;
  let m;
  while ((m = re.exec(body))) if (usable(m[1])) return m[1];
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

function readArticles() {
  if (!existsSync(POSTS_DIR)) return [];
  const list = [];
  for (const file of readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))) {
    const slug = file.replace(/\.md$/, '');
    const raw = readFileSync(join(POSTS_DIR, file), 'utf-8');
    const { data, body } = parseFrontMatter(raw);
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
        .slice(0, 70);
    }

    const text = body.replace(/```[\s\S]*?```/g, ' ').replace(/\s+/g, ' ');

    const coverRaw = String(data.cover || data.top_img || '');
    list.push({
      slug,
      title: String(data.title || slug),
      url: `/article/${encodeURIComponent(slug)}/`,
      desc: desc.slice(0, 90),
      cover: usable(coverRaw) ? coverRaw : firstImage(body),
      categories: cats,
      tags,
      date: normalizeDate(data.date || data.datas || data.updated || ''),
      weight: text.length
    });
  }
  list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return list;
}

/* ------------------------------- 页面区块 ------------------------------- */

const CSS = String.raw`:root{
  --ink:#eaf3ff; --muted:rgba(233,242,253,.72); --line:rgba(255,255,255,.16);
  --glass:rgba(12,28,48,.44); --glass-strong:rgba(10,24,42,.62);
  --sky:#3aa3e3; --sky-deep:#1d6fb8; --grass:#62a33d; --gold:#e0a545;
  --radius:18px; --shadow:0 16px 40px rgba(6,20,36,.34);
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{
  min-height:100vh; color:var(--ink);
  font:15px/1.8 "PingFang SC","Microsoft YaHei",system-ui,-apple-system,sans-serif;
  background:#0d2137 url('/SAO-bg.jpg') center/cover fixed no-repeat;
}
body::before{content:'';position:fixed;inset:0;background:rgba(8,20,36,.58);z-index:-1}

/* 顶栏：悬浮胶囊玻璃条 */
.topbar{position:fixed;top:0;left:0;right:0;z-index:60;padding:14px 20px;pointer-events:none}
.topbar-in{
  pointer-events:auto;
  max-width:1120px;margin:0 auto;height:56px;padding:0 8px 0 18px;
  display:flex;align-items:center;justify-content:space-between;gap:18px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.22);
  background:rgba(78,86,120,.42);
  backdrop-filter:blur(18px) saturate(160%);
  -webkit-backdrop-filter:blur(18px) saturate(160%);
  box-shadow:0 12px 34px rgba(6,18,34,.32);
  transition:background .35s ease,box-shadow .35s ease;
}
.topbar.scrolled .topbar-in{background:rgba(60,68,100,.6);box-shadow:0 16px 40px rgba(4,14,28,.45)}
.brand{display:flex;align-items:center;gap:9px;text-decoration:none;white-space:nowrap;color:#fff}
.brand .mark{
  width:28px;height:28px;flex:none;border-radius:50%;
  display:inline-flex;align-items:center;justify-content:center;
  background:linear-gradient(140deg,var(--sky),var(--grass));
  font:700 15px/1 Georgia,'Times New Roman',serif;color:#fff;
  box-shadow:0 4px 12px rgba(6,20,36,.35);
}
.brand .word{font:700 17px/1 Georgia,'Times New Roman',serif;letter-spacing:.02em}
.menu{display:flex;align-items:center;gap:24px;list-style:none;margin:0;padding:0}
.menu a{
  position:relative;color:rgba(255,255,255,.88);text-decoration:none;font-size:14.5px;white-space:nowrap;
  transition:color .25s ease,opacity .25s ease;
}
.menu a::after{
  content:'';position:absolute;left:50%;bottom:-6px;width:0;height:2px;border-radius:2px;
  background:#fff;transform:translateX(-50%);transition:width .3s cubic-bezier(.4,0,.2,1);
}
.menu a:hover{color:#fff}
.menu a:hover::after{width:60%}
.menu a.active{color:#fff;font-weight:600}
.menu a.active::after{width:60%}
.topbar .right{display:flex;align-items:center;gap:12px}
.icon-btn{
  width:32px;height:32px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;
  border:0;background:transparent;color:#fff;cursor:pointer;transition:transform .25s ease,background .25s ease;
}
.icon-btn:hover{background:rgba(255,255,255,.16);transform:scale(1.08)}
.avatar-btn{
  width:34px;height:34px;border-radius:50%;overflow:hidden;flex:none;text-decoration:none;
  border:2px solid rgba(255,255,255,.85);box-shadow:0 4px 14px rgba(6,20,36,.4);
  transition:transform .25s ease;
}
.avatar-btn img{width:100%;height:100%;object-fit:cover;display:block}
.avatar-btn:hover{transform:scale(1.1)}
.menu-toggle{display:none;width:32px;height:32px;border:0;background:transparent;color:#fff;cursor:pointer}
.menu-toggle span{display:block;width:18px;height:1.6px;background:#fff;margin:4px auto;transition:transform .3s ease,opacity .3s ease}
.topbar.open .menu-toggle span:nth-child(1){transform:translateY(5.6px) rotate(45deg)}
.topbar.open .menu-toggle span:nth-child(2){opacity:0}
.topbar.open .menu-toggle span:nth-child(3){transform:translateY(-5.6px) rotate(-45deg)}

/* 主体 */
.layout{max-width:1180px;margin:0 auto;padding:96px 20px 90px;display:flex;gap:22px;align-items:flex-start}
.side{
  flex:0 0 250px;width:250px;position:sticky;top:96px;
  max-height:calc(100vh - 108px);overflow-y:auto;overflow-x:hidden;
  /* 隐藏滚动条但保留滚动（鼠标滚轮/触摸板仍可滚） */
  scrollbar-width:none;-ms-overflow-style:none;
}
.side::-webkit-scrollbar{width:0;height:0;display:none}
.main{flex:1 1 auto;min-width:0}
.card{
  background:var(--glass); border:1px solid var(--line); border-radius:var(--radius);
  box-shadow:var(--shadow); backdrop-filter:blur(16px) saturate(140%);
  -webkit-backdrop-filter:blur(16px) saturate(140%);
  margin-bottom:18px; padding:18px 16px;
}

/* 个人信息 */
.profile{text-align:center;padding:22px 16px 18px}
.profile .avatar{
  width:104px;height:104px;margin:0 auto;border-radius:50%;overflow:hidden;
  box-shadow:0 10px 26px rgba(6,20,36,.4);
}
.profile .avatar img{width:100%;height:100%;object-fit:cover;display:block}
.profile .name{position:relative;display:inline-block;margin:12px auto 4px;padding-bottom:5px;font-size:17px;font-weight:700;color:#fff}
.profile .name::after{content:'';position:absolute;left:50%;bottom:0;width:0;height:2px;background:var(--sky);transform:translateX(-50%);transition:width .3s ease}
.profile .name:hover::after{width:52%}
.profile .bio{margin:6px 0 0;font-size:13px;color:var(--muted)}
.profile .socials{display:flex;justify-content:center;gap:10px;margin-top:14px}
.profile .socials a{
  width:38px;height:38px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;
  background:rgba(255,255,255,.12);border:1px solid var(--line);color:#fff;text-decoration:none;font-size:15px;
  transition:all .3s cubic-bezier(.075,.82,.165,1);
}
.profile .socials a:hover{background:rgba(58,163,227,.5);transform:translateY(-3px)}

/* 区块标题 */
.sec-title{
  position:relative;display:flex;align-items:center;gap:8px;
  margin:0 0 12px;padding-left:11px;font-size:15px;font-weight:600;color:#fff;
}
.sec-title::before{content:'';position:absolute;left:0;top:50%;width:3px;height:54%;border-radius:2px;background:var(--sky);transform:translateY(-50%);transition:height .3s ease-in-out}
.card:hover .sec-title::before{height:86%}
.sec-title .sub{margin-left:auto;font-size:12px;font-weight:400;color:var(--muted)}

/* 三标签 */
.tabs{display:flex;align-items:center;border-bottom:1px solid var(--line);padding-bottom:9px;margin-bottom:12px}
.tab{
  position:relative;flex:1 1 0;height:32px;border:0;background:none;color:rgba(255,255,255,.6);
  font-size:14px;cursor:pointer;transition:color .3s ease;
}
.tab+.tab::before{content:'';position:absolute;left:0;top:50%;width:1px;height:15px;background:var(--line);transform:translateY(-50%)}
.tab:hover{color:#fff}
.tab.on{color:#fff}
.tab.on::after{content:'';position:absolute;left:50%;bottom:-10px;width:6px;height:6px;border-radius:50%;background:var(--sky);box-shadow:0 0 9px rgba(58,163,227,.9);transform:translateX(-50%)}
.list{
  display:flex;flex-direction:column;gap:7px;max-height:318px;overflow-y:auto;
  scrollbar-width:none;-ms-overflow-style:none;
}
.list::-webkit-scrollbar{width:0;height:0;display:none}
.list a{display:flex;align-items:center;gap:9px;text-decoration:none;opacity:.9;transition:opacity .3s ease,transform .3s ease}
.list a:hover{opacity:1;transform:translateX(2px)}
.list .thumb{
  flex:none;width:34px;height:34px;border-radius:50%;overflow:hidden;border:1px solid rgba(255,255,255,.3);
  background:linear-gradient(135deg,rgba(58,163,227,.55),rgba(98,163,61,.55));
  background-size:cover;background-position:center;
}
.list .txt{min-width:0;flex:1 1 auto}
.list .thumb img{width:100%;height:100%;object-fit:cover;display:block}
.list .t{display:block;font-size:13px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.5}
.list .m{display:block;font-size:11.5px;color:var(--muted);margin-top:1px}
.empty{padding:14px 4px;text-align:center;font-size:12.5px;color:var(--muted)}

/* 分类 / 标签 / 站点信息 */
.cat{list-style:none;margin:0;padding:0}
.cat .row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:7px 6px;border-radius:10px;color:rgba(255,255,255,.9);font-size:13.5px;transition:background .3s ease,transform .3s ease;cursor:default}
.cat .row:hover{background:rgba(255,255,255,.12);transform:translateX(2px)}
.cat .n{flex:none;min-width:26px;padding:1px 8px;border-radius:999px;background:rgba(255,255,255,.15);border:1px solid var(--line);font-size:11.5px;text-align:center;color:#fff}
.cloud{display:flex;flex-wrap:wrap;gap:8px}
.cloud .tagpill{display:inline-block;padding:3px 11px;border-radius:999px;background:rgba(255,255,255,.13);border:1px solid var(--line);font-size:12px;color:rgba(255,255,255,.9);transition:all .3s ease;cursor:default}
.cloud .tagpill:hover{background:rgba(58,163,227,.4);color:#fff}
.info{display:flex;flex-direction:column;gap:8px;font-size:13px}
.info div{display:flex;align-items:center;justify-content:space-between;color:rgba(255,255,255,.9)}
.info b{font-weight:600;color:#fff}

/* 置顶区：2 行 × 2 列大图卡 */
.featured{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-bottom:18px}
.pt{
  position:relative;display:flex;flex-direction:column;height:238px;overflow:hidden;text-decoration:none;
  border-radius:var(--radius);border:1px solid rgba(255,255,255,.24);background:var(--glass);
  box-shadow:var(--shadow);backdrop-filter:blur(12px) saturate(140%);
  -webkit-backdrop-filter:blur(12px) saturate(140%);
  transition:transform .45s cubic-bezier(.4,0,.2,1),box-shadow .45s ease,filter .45s ease;
}
.pt .cover,.pr .cover{position:absolute;inset:0;background:linear-gradient(135deg,rgba(58,163,227,.5),rgba(98,163,61,.5));overflow:hidden}
.pt .cover img,.pr .cover img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .8s cubic-bezier(.22,.61,.36,1)}
.pt:hover .cover img{transform:scale(1.07)}
.pt .veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(6,18,32,.94) 0%,rgba(6,18,32,.5) 46%,rgba(6,18,32,.12) 100%)}
.pt .body{position:relative;z-index:2;margin-top:auto;padding:18px 20px 20px}
.pt h2{margin:0;font-size:18px;line-height:1.45;font-weight:700;color:#fff;text-shadow:0 2px 12px rgba(4,14,26,.7);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pt p{margin:7px 0 0;font-size:12.5px;line-height:1.65;color:rgba(255,255,255,.78);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
/* 置顶卡：入场动画（依次浮出）+ 悬浮放大、同心层微旋 */
.pt{opacity:0;transform:translateY(28px) scale(.97)}
.pt.in{opacity:1;transform:none;transition:opacity .8s cubic-bezier(.23,1,.32,1),transform .8s cubic-bezier(.23,1,.32,1),box-shadow .6s ease,filter .45s ease}
.pt .inner{position:absolute;inset:0;border-radius:inherit;transition:transform 1s cubic-bezier(.445,.05,.55,.95),box-shadow 2s ease}
.pt::after{
  content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.16);
  transition:box-shadow .6s ease;
}
.pt:hover{z-index:6;transform:translateY(-6px) scale(1.035);box-shadow:0 30px 64px rgba(5,16,30,.5)}
.pt:hover .inner{transform:rotate(.6deg) scale(1.01)}
.pt:hover::after{box-shadow:inset 0 0 0 1px rgba(255,255,255,.42),0 0 34px rgba(255,255,255,.16)}
.pt .cover img{transform:scale(1.01)}
.pt.in .cover img{transition:transform 1s cubic-bezier(.22,.61,.36,1)}
.pt:hover .cover img{transform:scale(1.07)}
/* 逐张延迟（依次浮出） */
.pt.in:nth-child(1){transition-delay:.05s}
.pt.in:nth-child(2){transition-delay:.17s}
.pt.in:nth-child(3){transition-delay:.29s}
.pt.in:nth-child(4){transition-delay:.41s}
@media(prefers-reduced-motion:reduce){
  .pt{opacity:1!important;transform:none!important}
  .pt .inner,.pt::after,.pt .cover img{transition:none!important}
}

/* 列表区：一行一整张（整图铺满 + 顶部文字 + 底部玻璃条） */
.rows{display:flex;flex-direction:column;gap:18px}
.pr{
  position:relative;display:block;height:258px;overflow:hidden;text-decoration:none;
  border-radius:var(--radius);border:1px solid rgba(255,255,255,.22);background:var(--glass);
  box-shadow:var(--shadow);backdrop-filter:blur(12px) saturate(140%);
  -webkit-backdrop-filter:blur(12px) saturate(140%);
  transition:transform .4s cubic-bezier(.4,0,.2,1),box-shadow .4s ease,filter .45s ease;
}
.pr .cover{position:absolute;inset:0;background:linear-gradient(135deg,rgba(58,163,227,.55),rgba(98,163,61,.55));overflow:hidden}
.pr .cover img{width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.01);transition:transform .9s cubic-bezier(.22,.61,.36,1)}
.pr .veil{
  position:absolute;inset:0;z-index:1;pointer-events:none;
  background:
    linear-gradient(to bottom,rgba(4,12,24,.78) 0%,rgba(4,12,24,.52) 22%,rgba(4,12,24,.06) 48%,rgba(4,12,24,.18) 68%,rgba(4,12,24,.62) 100%);
}
.pr .body{position:absolute;top:0;left:0;right:0;z-index:2;padding:22px 26px 0}
.pr h2{
  margin:0 0 8px;font-size:23px;line-height:1.4;font-weight:700;color:#fff;
  text-shadow:0 2px 14px rgba(4,12,24,.85),0 1px 3px rgba(4,12,24,.6);
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}
.pr p{
  margin:0;max-width:78%;font-size:13.5px;line-height:1.75;color:rgba(255,255,255,.88);
  text-shadow:0 1px 10px rgba(4,12,24,.75);
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}
/* 底部玻璃条：头像 + 作者 + 日期 + 查看详情 */
.pr .bar{
  position:absolute;left:12px;right:12px;bottom:12px;z-index:3;
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  padding:8px 8px 8px 10px;border-radius:14px;
  background:rgba(12,26,44,.42);
  border:1px solid rgba(255,255,255,.2);
  backdrop-filter:blur(10px) saturate(140%);
  -webkit-backdrop-filter:blur(10px) saturate(140%);
}
.pr .who{display:flex;align-items:center;gap:9px;min-width:0}
.pr .who .av{
  flex:none;width:34px;height:34px;border-radius:50%;overflow:hidden;
  border:1px solid rgba(255,255,255,.4);box-shadow:0 3px 10px rgba(4,12,24,.4);
}
.pr .who .av img{width:100%;height:100%;object-fit:cover;display:block}
.pr .who .nm{font-size:13px;color:#fff;white-space:nowrap}
.pr .who .dt{
  font-size:12px;color:rgba(255,255,255,.72);white-space:nowrap;
  padding-left:10px;margin-left:2px;border-left:1px solid rgba(255,255,255,.22);
}
.pr .goto{
  flex:none;display:inline-flex;align-items:center;gap:5px;
  padding:6px 15px;border-radius:999px;
  background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.24);
  font-size:12.5px;font-weight:600;color:#fff;
  transition:background .3s ease,transform .3s ease;
}
.pr .goto svg{width:11px;height:11px;transition:transform .3s ease}
.pr:hover{z-index:5;transform:translateY(-4px);box-shadow:0 26px 54px rgba(6,20,36,.46)}
.pr:hover .cover img{transform:scale(1.06)}
.pr:hover .goto{background:rgba(58,163,227,.62);transform:translateX(2px)}
.pr:hover .goto svg{transform:translateX(2px)}
.ph{
  display:flex;align-items:center;justify-content:center;width:100%;height:100%;
  font-size:11.5px;letter-spacing:.14em;color:rgba(255,255,255,.55);
}
.meta{display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:11.5px}
.chip{padding:1px 9px;border-radius:999px;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.26);color:#fff}
.date{color:rgba(255,255,255,.72)}
#feed.hovering .pt:not(:hover),#feed.hovering .pr:not(:hover){filter:blur(1.2px)}

.pager{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:7px;margin-top:28px}
.pager button{
  min-width:38px;height:38px;padding:0 12px;border-radius:10px;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;
  font-size:13.5px;color:#fff;background:var(--glass);border:1px solid var(--line);
  backdrop-filter:blur(10px);transition:background .25s ease,transform .25s ease,box-shadow .25s ease;
}
.pager button:hover:not(:disabled){background:rgba(58,163,227,.5);transform:translateY(-2px)}
.pager button.cur{background:var(--sky-deep);border-color:transparent;font-weight:600;box-shadow:0 8px 20px rgba(29,111,184,.45)}
.pager button:disabled{opacity:.45;cursor:not-allowed}
.pager .gap{color:rgba(255,255,255,.55);padding:0 4px}

@media(max-width:1080px){
  .layout{flex-direction:column;padding-top:18px}
  .side{position:static;width:100%;flex:none;max-height:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;align-items:start}
  .side .card{margin-bottom:0}
  .side .profile{grid-column:1/-1}
}
@media(max-width:820px){
  .topbar{padding:10px 12px}
  .topbar-in{padding:0 6px 0 12px}
  .brand .word{font-size:15px}
  .menu{
    position:absolute;top:66px;left:12px;right:12px;flex-direction:column;gap:2px;align-items:stretch;
    padding:10px;border-radius:18px;background:rgba(50,58,88,.82);border:1px solid rgba(255,255,255,.2);
    backdrop-filter:blur(18px);display:none;
  }
  .topbar.open .menu{display:flex}
  .menu a{padding:9px 12px;border-radius:10px}
  .menu a::after{display:none}
  .menu a:hover{background:rgba(255,255,255,.12)}
  .menu-toggle{display:block}
  .featured{grid-template-columns:minmax(0,1fr)}
  .side{grid-template-columns:minmax(0,1fr)}
  .menu{display:none}
  .pr{height:230px}
  .pr h2{font-size:19px}
  .pr p{max-width:100%;font-size:12.5px}
  .pr .body{padding:18px 18px 0}
  .pr .bar{left:8px;right:8px;bottom:8px;padding:6px 6px 6px 8px}
  .pr .who .dt{display:none}
  .pr .goto{padding:5px 12px;font-size:12px}
  .pt{height:220px}
}
`;

const ICON_LOGO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/></svg>`;

function profileBlock(articleCount, catCount, tagCount) {
  return `<aside class="card profile">
  <div class="avatar"><img src="${esc(SITE.avatar)}" alt="${esc(SITE.author)}"></div>
  <div class="name">${esc(SITE.name)}</div>
  <p class="bio">${esc(SITE.bio)}</p>
  <div class="socials">
    <a href="https://github.com/vernuser" target="_blank" rel="noopener" title="GitHub" aria-label="GitHub">
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0C17.7 4.7 18.7 5 18.7 5c.6 1.5.2 2.7.1 3 .8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>
    </a>
    <a href="https://space.bilibili.com/348470293" target="_blank" rel="noopener" title="BiliBili" aria-label="BiliBili">
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M17.8 4.6h2.7c1 0 1.8.8 1.8 1.8v10.4c0 1-.8 1.8-1.8 1.8H3.5c-1 0-1.8-.8-1.8-1.8V6.4c0-1 .8-1.8 1.8-1.8h2.7L4.9 3.3c-.3-.3-.3-.7 0-1 .3-.3.7-.3 1 0l2.4 2.3h7.4l2.4-2.3c.3-.3.7-.3 1 0 .3.3.3.7 0 1l-1.3 1.3zM7.2 10.6c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm9.6 0c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"/></svg>
    </a>
    <a href="mailto:vernuser@foxmail.com" title="邮箱" aria-label="邮箱">
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 6.5 9 6.5 9-6.5"/></svg>
    </a>
    <a href="http://wpa.qq.com/msgrd?v=3&uin=840683056&site=qq&menu=yes" target="_blank" rel="noopener" title="QQ" aria-label="QQ">
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M12 2c3 0 5.2 2.3 5.2 5.4 0 1 .3 1.6.9 2.6.9 1.5 1.9 3 1.9 5.1 0 1.4-.5 2.3-1.3 2.3-.6 0-1.1-.5-1.5-1.3-.8 1.4-2.2 2.4-3.9 2.4h-2.6c-1.7 0-3.1-1-3.9-2.4-.4.8-.9 1.3-1.5 1.3-.8 0-1.3-.9-1.3-2.3 0-2.1 1-3.6 1.9-5.1.6-1 .9-1.6.9-2.6C6.8 4.3 9 2 12 2z"/></svg>
    </a>
  </div>
</aside>`;
}

function tabsBlock(articles) {
  const hot = [...articles].sort((a, b) => b.weight - a.weight).slice(0, 5);
  const recent = articles.slice(0, 5);

  const item = (a) => `<a href="${a.url}" title="${esc(a.title)}">
  <span class="thumb">${a.cover ? `<img src="${esc(a.cover)}" alt="" loading="lazy" onerror="this.remove()">` : ''}</span>
  <span class="txt"><span class="t">${esc(a.title)}</span><span class="m">${a.date ? esc(a.date) + ' · ' : ''}${a.weight.toLocaleString('en-US')} 字</span></span>
</a>`;

  return `<section class="card">
  <div class="tabs" id="tabs">
    <button class="tab on" data-k="hot" type="button">热门</button>
    <button class="tab" data-k="recent" type="button">最近</button>
    <button class="tab" data-k="comment" type="button">评论</button>
  </div>
  <div class="list" id="list">${hot.map(item).join('\n')}</div>
  <script type="application/json" id="feed-data">${JSON.stringify({
    hot: hot.map((a) => ({ t: a.title, u: a.url, d: a.date, w: a.weight, c: a.cover || '' })),
    recent: recent.map((a) => ({ t: a.title, u: a.url, d: a.date, w: a.weight, c: a.cover || '' }))
  })}</script>
</section>`;
}

function categoriesBlock(articles) {
  const counter = new Map();
  for (const a of articles) {
    const name = a.categories[0] || '未分类';
    counter.set(name, (counter.get(name) || 0) + 1);
  }
  const rows = [...counter.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 10)
    .map(([name, n]) => `<li><span class="row"><span>${esc(name)}</span><span class="n">${n}</span></span></li>`)
    .join('\n');
  return `<section class="card">
  <h3 class="sec-title">分类<span class="sub">${counter.size} 个</span></h3>
  <ul class="cat">${rows}</ul>
</section>`;
}

function tagsBlock(articles) {
  const counter = new Map();
  for (const a of articles) for (const t of a.tags) counter.set(t, (counter.get(t) || 0) + 1);
  const tags = [...counter.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 34);
  return `<section class="card">
  <h3 class="sec-title">标签云<span class="sub">${counter.size} 个</span></h3>
  <div class="cloud">${tags.map(([t]) => `<span class="tagpill">${esc(t)}</span>`).join('')}</div>
</section>`;
}

function infoBlock(articles) {
  const words = articles.reduce((n, a) => n + a.weight, 0);
  const cats = new Set(articles.map((a) => a.categories[0] || '未分类')).size;
  const tags = new Set(articles.flatMap((a) => a.tags)).size;
  const since = articles.length ? [...articles].sort((a, b) => (a.date || '').localeCompare(b.date || ''))[0].date : '';
  const days = since ? Math.max(1, Math.ceil((Date.now() - new Date(since).getTime()) / 86400000)) : 0;
  return `<section class="card">
  <h3 class="sec-title">站点信息</h3>
  <div class="info">
    <div><span>文章</span><b>${articles.length}</b></div>
    <div><span>分类</span><b>${cats}</b></div>
    <div><span>标签</span><b>${tags}</b></div>
    <div><span>总字数</span><b>${(words / 1000).toFixed(1)}k</b></div>
    <div><span>运行天数</span><b>${days}</b></div>
  </div>
</section>`;
}

/** 封面占位：无可用封面时用渐变 + 一个淡淡的字母，避免出现破图占位 */
function coverInner(a) {
  if (a.cover) {
    const fb = a.coverFallback
      ? `this.onerror=null;this.src='${esc(a.coverFallback)}'`
      : 'this.remove()';
    return `<img src="${esc(a.cover)}" alt="" decoding="async" fetchpriority="high" onerror="${fb}">`;
  }
  const letter = (a.title || '·').trim().charAt(0) || '·';
  return `<span class="ph" aria-hidden="true">${esc(letter)}</span>`;
}

function metaLine(a) {
  return `<div class="meta">
      ${a.categories[0] ? `<span class="chip">${esc(a.categories[0])}</span>` : ''}
      ${a.date ? `<span class="date">${esc(a.date)}</span>` : ''}
    </div>`;
}

/** 置顶区：前四篇，两行两列 */
function featuredBlock(articles) {
  const cards = articles
    .map((a) => `<a class="pt" href="${a.url}" title="${esc(a.title)}">
  <span class="inner"></span>
  <span class="cover">${coverInner(a)}</span>
  <span class="veil"></span>
  <div class="body">
    ${metaLine(a)}
    <h2>${esc(a.title)}</h2>
    ${a.desc ? `<p>${esc(a.desc)}</p>` : ''}
  </div>
</a>`)
    .join('\n');
  return `<div class="featured">${cards}</div>`;
}

/** 列表区：其余文章，一行一整张（左文右图） */
function rowsBlock(articles) {
  const cards = articles
    .map((a) => {
      return `<a class="pr" href="${a.url}" title="${esc(a.title)}">
  <span class="cover">${coverInner(a)}</span>
  <span class="veil"></span>
  <div class="body">
    <h2>${esc(a.title)}</h2>
    ${a.desc ? `<p>${esc(a.desc)}</p>` : ''}
  </div>
  <div class="bar">
    <span class="who">
      <span class="av"><img src="${esc(SITE.avatar)}" alt="${esc(SITE.author)}"></span>
      <span class="nm">${esc(SITE.author)}</span>
      ${a.date ? `<span class="dt">${esc(a.date)}</span>` : ''}
    </span>
    <span class="goto">查看详情
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>
    </span>
  </div>
</a>`;
    })
    .join('\n');
  return `<div class="rows">${cards}</div>`;
}

function feedBlock(articles) {
  const featured = articles.slice(0, 4);
  const rows = articles.slice(4);
  return `${featuredBlock(featured)}
${rows.length ? rowsBlock(rows) : ''}`;
}

function page(articles) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(SITE.name)}</title>
<meta name="description" content="${esc(SITE.bio)}">
<link rel="icon" href="/favicon.ico">
<link rel="manifest" href="/manifest.json">
<style>${CSS}</style>
</head>
<body>
<header class="topbar" id="topbar">
  <div class="topbar-in">
    <a class="brand" href="/">
      <span class="mark">随</span>
      <span class="word">${esc(SITE.name)}</span>
    </a>
    <nav>
      <ul class="menu" id="menu">
        <li><a class="active" href="/">首页</a></li>
        <li><a href="/diary/">随心记</a></li>
        <li><a href="/wallpaper/">壁纸墙</a></li>
        <li><a href="/link/">友人帐</a></li>
        <li><a href="/about/">关于我</a></li>
      </ul>
    </nav>
    <div class="right">
      <button class="icon-btn" id="theme" type="button" title="切换深浅色" aria-label="切换深浅色">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6"/></svg>
      </button>
      <a class="avatar-btn" href="/about/" title="${esc(SITE.author)}"><img src="${esc(SITE.avatar)}" alt="${esc(SITE.author)}"></a>
      <button class="menu-toggle" id="menuToggle" type="button" aria-label="菜单"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>

<div class="layout">
  <div class="side">
    ${profileBlock()}
    ${tabsBlock(articles)}
    ${categoriesBlock(articles)}
    ${tagsBlock(articles)}
    ${infoBlock(articles)}
  </div>

  <main class="main">
    <div id="feed">${feedBlock(articles)}</div>
    <nav class="pager" id="pager" aria-label="分页"></nav>
  </main>
</div>

<script>
(function () {
  // 三标签切换
  var data = JSON.parse(document.getElementById('feed-data').textContent);
  var list = document.getElementById('list');
  function render(k) {
    var rows = data[k] || [];
    if (!rows.length) { list.innerHTML = '<div class="empty">还没有接入评论系统</div>'; return; }
    list.innerHTML = rows.map(function (a) {
      return '<a href="' + a.u + '" title="' + a.t + '">' +
        '<span class="thumb">' + (a.c ? '<img src="' + a.c + '" alt="" loading="lazy" onerror="this.remove()">' : '') + '</span>' +
        '<span class="txt"><span class="t">' + a.t + '</span><span class="m">' +
        (a.d ? a.d + ' · ' : '') + a.w.toLocaleString('en-US') + ' 字</span></span></a>';
    }).join('');
  }
  document.getElementById('tabs').addEventListener('click', function (e) {
    var btn = e.target.closest('.tab');
    if (!btn) return;
    Array.prototype.forEach.call(this.children, function (b) { b.classList.toggle('on', b === btn); });
    render(btn.dataset.k);
  });

  // 卡片墙：悬停放大，其余虚化
  var feed = document.getElementById('feed');
  feed.addEventListener('mouseover', function (e) {
    if (e.target.closest('.post')) feed.classList.add('hovering');
  });
  feed.addEventListener('mouseleave', function () { feed.classList.remove('hovering'); });

  // 深浅色切换（仅切换本页配色变量）
  var btn = document.getElementById('theme');
  var KEY = 'sao-theme';
  function apply(mode) {
    var dark = mode === 'dark';
    var r = document.documentElement.style;
    r.setProperty('--ink', dark ? '#e9f2fd' : '#eaf3ff');
    r.setProperty('--glass', dark ? 'rgba(8,20,36,.6)' : 'rgba(12,28,48,.44)');
    document.body.style.setProperty('background-color', dark ? '#071322' : '#0d2137');
    document.body.style.setProperty('background-image', dark
      ? "linear-gradient(rgba(4,12,22,.7),rgba(4,12,22,.7)), url('/SAO-bg.jpg')"
      : "url('/SAO-bg.jpg')");
    try { localStorage.setItem(KEY, mode); } catch (err) {}
  }
  var saved = 'light';
  try { saved = localStorage.getItem(KEY) || 'light'; } catch (err) {}
  apply(saved);
  btn.addEventListener('click', function () {
    saved = saved === 'light' ? 'dark' : 'light';
    apply(saved);
  });

  // 顶栏：滚动后加深背景
  var bar = document.getElementById('topbar');
  function onScroll() {
    if (window.scrollY > 12) bar.classList.add('scrolled');
    else bar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 移动端菜单
  var toggle = document.getElementById('menuToggle');
  if (toggle) {
    toggle.addEventListener('click', function () { bar.classList.toggle('open'); });
    document.getElementById('menu').addEventListener('click', function (e) {
      if (e.target.tagName === 'A') bar.classList.remove('open');
    });
  }

  // 客户端分页：每页 12 条（4 张置顶 + 8 篇最新），显示普通页码
  var PER_PAGE = 12;
  var feed = document.getElementById('feed');
  var pager = document.getElementById('pager');
  if (feed && pager) {
    var posts = Array.prototype.slice.call(feed.querySelectorAll('.pt, .pr'));
    var pages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
    var page = 1;
    function drawPager() {
      var html = '';
      html += '<button type="button" data-go="' + (page - 1) + '"' + (page === 1 ? ' disabled' : '') + '>上一页</button>';
      for (var i = 1; i <= pages; i++) {
        if (pages > 7 && i > 2 && i < pages - 1 && Math.abs(i - page) > 1) {
          if (!html.endsWith('<span class="gap">…</span>')) html += '<span class="gap">…</span>';
          continue;
        }
        html += '<button type="button" data-go="' + i + '"' + (i === page ? ' class="cur"' : '') + '>' + i + '</button>';
      }
      html += '<button type="button" data-go="' + (page + 1) + '"' + (page === pages ? ' disabled' : '') + '>下一页</button>';
      pager.innerHTML = html;
    }
    function render(smooth) {
      posts.forEach(function (el, i) {
        var show = Math.floor(i / PER_PAGE) + 1 === page;
        el.style.display = show ? '' : 'none';
      });
      drawPager();
      if (smooth) window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    pager.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-go]');
      if (!btn || btn.disabled) return;
      var next = parseInt(btn.dataset.go, 10);
      if (!next || next < 1 || next > pages || next === page) return;
      page = next;
      render(true);
    });
    render(false);
  }

  // 置顶卡入场动画：进入视口后依次浮出
  var featured = document.querySelectorAll('.pt');
  if (!featured.length) return;
  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(featured, function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries, self) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); self.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  Array.prototype.forEach.call(featured, function (el) { io.observe(el); });
})();
</script>
</body>
</html>`;
}

/* --------------------------------- 入口 --------------------------------- */

if (!existsSync(POSTS_DIR)) {
  console.error('找不到文章目录：', POSTS_DIR);
  process.exit(1);
}
const articles = assignWallpapers(await filterCovers(readArticles()), readWallpaperIds());
if (!articles.length) {
  console.error('没有读到任何文章');
  process.exit(1);
}
mkdirSync(GENERATED, { recursive: true });
writeFileSync(join(GENERATED, 'articles.json'), JSON.stringify(articles, null, 2), 'utf-8');

// 首页同时写到 public/（dev 预览用）与 out/（静态导出产物，覆盖 Next 的主页）
const html = page(articles);
writeFileSync(join(PUBLIC, 'index.html'), html, 'utf-8');
const OUT = join(ROOT, 'out');
if (existsSync(OUT)) {
  writeFileSync(join(OUT, 'index.html'), html, 'utf-8');
  console.log(`已生成博客版式首页（文章 ${articles.length} 篇）`);
  console.log('  public/index.html');
  console.log('  out/index.html');
} else {
  console.log(`已生成博客版式首页（文章 ${articles.length} 篇）`);
  console.log('  public/index.html');
}
