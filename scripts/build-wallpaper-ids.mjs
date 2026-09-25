/*
 * 从图床仓库的 manifest.json 生成 public/wallpaper-ids.json（只保留文件名）
 * 数据源：https://cdn.jsdelivr.net/gh/vernuser/acg-wallpaper@main/manifest.json
 * 重新生成：node scripts/build-wallpaper-ids.mjs
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const MANIFEST = 'https://cdn.jsdelivr.net/gh/vernuser/acg-wallpaper@main/manifest.json';
const FALLBACK = 'https://raw.githubusercontent.com/vernuser/acg-wallpaper/main/manifest.json';

async function load(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

let data;
try {
  data = await load(MANIFEST);
} catch (e) {
  console.warn('jsDelivr 取 manifest 失败，回退 raw：', e.message);
  data = await load(FALLBACK);
}

const ids = (data.images || [])
  .map((u) => String(u).split('/').pop())
  .filter(Boolean);

mkdirSync(join(ROOT, 'public'), { recursive: true });
writeFileSync(
  join(ROOT, 'public', 'wallpaper-ids.json'),
  JSON.stringify({ generated: new Date().toISOString(), count: ids.length, ids }, null, 2),
  'utf-8'
);
console.log(`已生成 public/wallpaper-ids.json（${ids.length} 张）`);
