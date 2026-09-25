# 随波逐流の旅店

个人站点。基于 Next.js 14 + remio-home 框架改造，静态导出后托管在 GitHub Pages。

- 线上地址：<https://vernus.top>
- 写作与发布说明见 [GUIDE.md](./GUIDE.md)

## 页面

| 路径 | 内容 |
|---|---|
| `/` | 首页：4 张置顶大图卡 + 每行一整张的最新文章，每页 12 条 |
| `/diary/` | 随心记：时间轴动态流 |
| `/wallpaper/` | 壁纸墙：瀑布流图墙，滚动增量加载 |
| `/about/` | 关于我 |
| `/link/` | 友人帐 |
| `/comments/` | 留言板 |
| `/article/<slug>/` | 文章详情（左侧栏 + 封面大图 + 暗色正文） |

## 常用命令

```powershell
pnpm build      # 生成全部页面
pnpm deploy     # 发布到 gh-pages
pnpm dev        # 本地开发预览
pnpm covers     # 重新生成封面镜像
```

## 目录

```
content/          内容源（Markdown 与数据）
  _posts/         文章
  _data/link.yml  友链
  about/ link/ comments/
public/           静态资源与最终产物
  acg/            图床插画（654 张）
  covers/         封面横图（278 张）
scripts/          构建脚本
src/              框架源码与站点配置
```