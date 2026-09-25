/*
 * 读取图床仓库图片的原始尺寸，输出 public/wallpaper-meta.json
 *   - 直接解析 JPEG SOF 段与 PNG IHDR，不依赖任何外部库或工具
 *   - 只保留横图（宽/高 >= minRatio）作为封面候选，避免竖图被裁得很难看
 * 需要本地有 acg-wallpaper 仓库副本（默认 ../acg-wallpaper）
 * 运行：node scripts/build-wallpaper-meta.mjs
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, openSync, readSync, closeSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const REPO = process.env.WALLPAPER_REPO_DIR || join(ROOT, '..', 'acg-wallpaper');
const IMG_DIR = join(REPO, 'acg');
const OUT = join(ROOT, 'public', 'wallpaper-meta.json');
const MIN_RATIO = 1.3; // 宽高比下限，1.3 约等于 4:3

/** JPEG：扫描段直到 SOF0/1/2，取出高宽 */
function jpegSize(buf) {
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    // SOF0..SOF3 / SOF5..SOF7 / SOF9..SOF11 / SOF13..SOF15
    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd9)) { i += 2; continue; }
    const len = buf.readUInt16BE(i + 2);
    if (len < 2) return null;
    i += 2 + len;
  }
  return null;
}

/** PNG：IHDR 固定在第 16 字节起 */
function pngSize(buf) {
  if (buf.length < 24) return null;
  if (buf.toString('ascii', 12, 16) !== 'IHDR') return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

/** WebP（VP8/VP8L/VP8X） */
function webpSize(buf) {
  const tag = buf.toString('ascii', 12, 16);
  if (tag === 'VP8X') {
    const w = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
    const h = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
    return { w, h };
  }
  if (tag === 'VP8 ') {
    return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
  }
  if (tag === 'VP8L') {
    const bits = buf.readUInt32LE(21);
    return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}

function readSize(file) {
  const fd = openSync(file, 'r');
  try {
    const size = statSync(file).size;
    const buf = Buffer.alloc(Math.min(size, 65536));
    readSync(fd, buf, 0, buf.length, 0);
    if (buf[0] === 0xff && buf[1] === 0xd8) return jpegSize(buf);
    if (buf[0] === 0x89 && buf.toString('ascii', 1, 4) === 'PNG') return pngSize(buf);
    if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return webpSize(buf);
    return null;
  } catch {
    return null;
  } finally {
    closeSync(fd);
  }
}

if (!existsSync(IMG_DIR)) {
  console.error('找不到图片目录：', IMG_DIR);
  console.error('请确认 acg-wallpaper 仓库副本存在，或用 WALLPAPER_REPO_DIR 指定路径');
  process.exit(1);
}

const files = readdirSync(IMG_DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
const all = [];
const landscape = [];
const portrait = [];
const unreadable = [];

for (const name of files) {
  const size = readSize(join(IMG_DIR, name));
  if (!size || !size.w || !size.h) { unreadable.push(name); continue; }
  const ratio = +(size.w / size.h).toFixed(3);
  const rec = { id: name, w: size.w, h: size.h, ratio };
  all.push(rec);
  if (ratio >= MIN_RATIO) landscape.push(rec);
  else portrait.push(rec);
}

// 横图按比例从宽到窄排序，最"横"的优先用在大卡片上
landscape.sort((a, b) => b.ratio - a.ratio);

writeFileSync(
  OUT,
  JSON.stringify(
    {
      generated: new Date().toISOString(),
      minRatio: MIN_RATIO,
      total: all.length,
      landscapeCount: landscape.length,
      portraitCount: portrait.length,
      unreadableCount: unreadable.length,
      landscape: landscape.map((r) => ({ id: r.id, w: r.w, h: r.h, ratio: r.ratio })),
      all: all.map((r) => ({ id: r.id, w: r.w, h: r.h, ratio: r.ratio }))
    },
    null,
    2
  ),
  'utf-8'
);

console.log(`尺寸索引完成：共 ${all.length} 张`);
console.log(`  横图（宽高比 >= ${MIN_RATIO}）：${landscape.length} 张 → 用作封面`);
console.log(`  竖图/方图：${portrait.length} 张（不参与封面）`);
if (unreadable.length) console.log(`  无法解析：${unreadable.length} 张`);
console.log('  public/wallpaper-meta.json');
