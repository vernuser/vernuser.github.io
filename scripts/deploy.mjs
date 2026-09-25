/*
 * 把静态产物 out/ 发布到 remote 的指定分支（默认 gh-pages），用于 GitHub Pages 托管。
 * 用法：
 *   pnpm build          # 先构建，产出 out/
 *   pnpm deploy         # 发布到 origin/gh-pages
 *   node scripts/deploy.mjs --branch main --remote origin
 *
 * 实现：用临时 git worktree + 独立提交，不会影响当前分支的源码历史。
 */
import { execSync } from 'child_process';
import { existsSync, rmSync, mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const ROOT = process.cwd();
const OUT = join(ROOT, 'out');
const BRANCH = arg('branch', 'gh-pages');
const REMOTE = arg('remote', 'origin');
const WORK = mkdtempSync(join(tmpdir(), 'deploy-'));

function run(cmd, cwd = ROOT) {
  console.log(`$ ${cmd}`);
  return execSync(cmd, { cwd, stdio: 'inherit' });
}

function capture(cmd, cwd = ROOT) {
  return execSync(cmd, { cwd, encoding: 'utf-8' }).trim();
}

if (!existsSync(OUT)) {
  console.error('找不到 out/，请先执行 pnpm build');
  process.exit(1);
}

// 构建时生成的 .nojekyll（GitHub Pages 需要它才会保留 _next 目录）
const nojekyll = join(OUT, '.nojekyll');
if (!existsSync(nojekyll)) writeFileSync(nojekyll, '', 'utf-8');

try {
  // 分支已存在就直接 worktree，否则用孤儿分支新建
  let branchExists = false;
  try {
    capture(`git ls-remote --heads ${REMOTE} ${BRANCH}`);
    branchExists = !!capture(`git ls-remote --heads ${REMOTE} ${BRANCH}`);
  } catch {
    branchExists = false;
  }

  if (branchExists) {
    run(`git fetch ${REMOTE} ${BRANCH}`);
    run(`git worktree add --force --detach "${WORK}" ${REMOTE}/${BRANCH}`);
    run(`git checkout -B ${BRANCH}`, WORK);
  } else {
    run(`git worktree add --force --detach "${WORK}"`);
    run(`git checkout --orphan ${BRANCH}`, WORK);
  }

  // 清空工作区（保留 .git），再复制 out/ 内容
  run('git rm -rf . --quiet || true', WORK);
  run('git clean -fdx --quiet || true', WORK);

  // Windows 下用 robocopy / POSIX 下用 cp
  if (process.platform === 'win32') {
    run(`robocopy "${OUT}" "${WORK}" /E /NFL /NDL /NJH /NJS /NC /NS >NUL || exit 0`, ROOT);
  } else {
    run(`cp -R "${OUT}/." "${WORK}/"`, ROOT);
  }

  run('git add -A', WORK);
  const stamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  try {
    run(`git -c core.quotepath=false commit --no-verify -m "chore: deploy static site ${stamp}"`, WORK);
  } catch {
    console.log('没有需要提交的改动');
  }
  run(`git push --force ${REMOTE} ${BRANCH}`, WORK);

  console.log(`\n已发布到 ${REMOTE}/${BRANCH}`);
} finally {
  try {
    run(`git worktree remove --force "${WORK}"`);
  } catch {
    try { rmSync(WORK, { recursive: true, force: true }); } catch { /* ignore */ }
  }
}
