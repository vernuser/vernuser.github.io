/*
 * 把封面用的横图镜像到站点本地 public/covers/
 *   来源：../acg-wallpaper/acg/<id>（图床仓库副本）
 *   规格：长边 1280px / JPEG q80，约 90KB 一张
 *   清单：public/wallpaper-meta.json 的 landscape 列表
 * 目的：封面从站点同域加载，不依赖境外图床，速度与稳定性都由自己掌控
 * 运行：node scripts/build-covers.mjs（已挂在 prebuild；已有文件会跳过）
 */
import { readFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';

const ROOT = process.cwd();
const REPO = process.env.WALLPAPER_REPO_DIR || join(ROOT, '..', 'acg-wallpaper');
const SRC = join(REPO, 'acg');
const OUT = join(ROOT, 'public', 'covers');
const META = join(ROOT, 'public', 'wallpaper-meta.json');

if (!existsSync(META)) {
  console.log('跳过封面镜像：缺少 public/wallpaper-meta.json');
  process.exit(0);
}
if (!existsSync(SRC)) {
  console.log(`跳过封面镜像：找不到图床仓库副本 ${SRC}`);
  console.log('（封面将回退为远端图床直链）');
  process.exit(0);
}

const meta = JSON.parse(readFileSync(META, 'utf-8'));
const ids = (meta.landscape || []).map((r) => r.id);
if (!ids.length) {
  console.log('跳过封面镜像：横图清单为空');
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });
const todo = ids.filter((id) => !existsSync(join(OUT, id.replace(/\.[^.]+$/, '.jpg'))));

if (!todo.length) {
  const n = readdirSync(OUT).length;
  console.log(`封面已是最新（本地 ${n} 张），无需转换`);
  process.exit(0);
}

console.log(`需要转换 ${todo.length} 张封面（长边 1280px / q80）…`);

// 用 PowerShell + System.Drawing 批量转换，避免引入图像库依赖
const ps = `
Add-Type -AssemblyName System.Drawing
$src = '${SRC.replace(/'/g, "''")}'
$out = '${OUT.replace(/'/g, "''")}'
$ids = @(${todo.map((i) => `'${i}'`).join(',')})
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$maxSide = 1280
$ok = 0; $fail = 0
foreach ($id in $ids) {
  $p = Join-Path $src $id
  if (-not (Test-Path $p)) { $fail++; continue }
  try {
    $img = [System.Drawing.Image]::FromFile($p)
    $scale = [Math]::Min(1.0, $maxSide / [Math]::Max($img.Width, $img.Height))
    $w = [Math]::Max(1, [int]($img.Width * $scale))
    $h = [Math]::Max(1, [int]($img.Height * $scale))
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = 'HighQualityBicubic'
    $g.PixelOffsetMode = 'HighQuality'
    $g.DrawImage($img, 0, 0, $w, $h)
    $g.Dispose()
    $ps = New-Object System.Drawing.Imaging.EncoderParameters 1
    $ps.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 80L
    $dest = Join-Path $out ([IO.Path]::GetFileNameWithoutExtension($id) + '.jpg')
    $bmp.Save($dest, $codec, $ps)
    $bmp.Dispose(); $img.Dispose()
    $ok++
  } catch { $fail++ }
}
Write-Host "converted=$ok failed=$fail"
`;

const out = execFileSync('pwsh', ['-NoProfile', '-Command', ps], { encoding: 'utf-8' });
console.log(out.trim());

const made = readdirSync(OUT).filter((f) => f.endsWith('.jpg'));
const bytes = made.reduce((n, f) => n + statSync(join(OUT, f)).size, 0);
console.log(`public/covers/ 现有 ${made.length} 张，共 ${(bytes / 1048576).toFixed(1)} MB`);
