# 写作与发布指南

## 一、新文章写在哪里

```
content/_posts/你的文章名.md
```

文件名就是网址的一部分。例如 `content/_posts/内存马.md` → 网址 `/article/内存马/`。
**文件名不要用空格**，用中文或英文都行。

## 二、文章格式

```markdown
---
title: 文章标题
date: 2026-09-25
categories:
  - 代码审计
tags:
  - php
  - 审计
description: 一句话摘要，会显示在首页卡片和随心记里
---

正文 Markdown 内容……
```

字段说明：

| 字段 | 是否必填 | 作用 |
|---|---|---|
| `title` | 必填 | 文章标题 |
| `date` | 建议填 | 排序、卡片和随心记上显示的日期（`YYYY-MM-DD`） |
| `categories` | 可选 | 分类，会出现在卡片与文章页标签上 |
| `tags` | 可选 | 标签 |
| `description` | **建议填** | 首页卡片的摘要，同时作为随心记那条动态的正文 |

**不要写 `cover` 字段**。封面由构建脚本从图床自动分配（按文件名做确定性随机，同一篇每次都是同一张图）。
如果手写了 `cover`，会被自动覆盖掉。

## 三、随心记怎么更新

**不用单独写。** 每发布一篇文章，随心记（`/diary/`）就会自动多一条动态：

- 头像与作者：固定为 vernus
- 日期：取文章的 `date`
- 正文：取文章的 `description`
- 底部两个胶囊：「分类」和文章标题（点击进入文章）

所以想发一条碎碎念，最简单的办法就是**发一篇短文，把 `description` 写清楚**。

## 四、怎么发布到线上

在 `remio-home` 目录下执行：

```powershell
pnpm build      # 生成全部页面（文章 / 首页 / 随心记 / 壁纸墙）
pnpm deploy     # 发布到 gh-pages 分支
```

`pnpm build` 会自动依次完成：解析文章 → 分配封面 → 生成文章页 → 生成随心记与壁纸墙 → 生成首页 → Next 导出。**不需要手动跑任何单独脚本。**

想同时保留源码历史，再补一条：

```powershell
git add -A
git commit -m "新文章：xxx"
git push origin remio-home
```

## 五、其它内容改在哪

| 想改什么 | 改这个文件 |
|---|---|
| 站点名 / 签名 / 头像 / 社交链接 / 技能条 / 页脚 | `src/config/config.json` |
| 关于我 | `content/about/index.md` |
| 友人帐（友链） | `content/_data/link.yml` |
| 留言板文案 | `content/comments/index.md` |
| 首页布局 / 卡片样式 | `scripts/build-blog-index.mjs`（含 CSS） |
| 随心记与壁纸墙 | `scripts/build-diary-wallpaper.mjs` |
| 文章页样式 | `scripts/build-articles.mjs` |

## 六、图床

| 目录 | 内容 |
|---|---|
| `public/acg/` | 654 张插画原图（壁纸墙用） |
| `public/covers/` | 278 张横图封面（首页与文章页封面用） |

图床源仓库：<https://github.com/vernuser/acg-wallpaper>

图库有更新时（需要本地有 `acg-wallpaper` 仓库副本）：

```powershell
pnpm wallpaper-meta   # 重新读取图片尺寸，生成横图清单
pnpm covers           # 重新生成封面镜像
pnpm build
pnpm deploy
```
