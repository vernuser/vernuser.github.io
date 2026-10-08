/*
 * remio-home 站点配置
 * 作者信息与站点数据见 src/config/config.json
 */
/** @type {import('next').NextConfig} */
import nextPWA from "next-pwa";

const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: !isProd,
});

/*
 * 仅 dev 生效：把目录式静态页 URL 解析到 public/ 里的 index.html。
 * 生产环境是静态导出（out/），GitHub Pages 天然支持 /xxx/ -> /xxx/index.html，无需此规则。
 */
const devStaticPages = [
  ["/", "/index.html"],
  ["/article/:slug", "/article/:slug/index.html"],
  ["/about", "/about/index.html"],
  ["/link", "/link/index.html"],
  ["/comments", "/comments/index.html"],
  ["/diary", "/diary/index.html"],
  ["/wallpaper", "/wallpaper/index.html"],
];

const nextConfig = {
  // 静态导出：next build 直接产出 out/ 目录，可托管在 GitHub Pages 等纯静态服务
  output: "export",
  trailingSlash: true,
  async rewrites() {
    if (!isDev) return { beforeFiles: [] };
    // beforeFiles：先于文件系统路由生效，否则 / 会被 app 路由抢先
    return {
      beforeFiles: devStaticPages.flatMap(([source, destination]) => [
        { source, destination },
        { source: source + "/", destination },
      ]),
    };
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    minimumCacheTTL: 60,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.staticaly.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "pixiv.re" },
      { protocol: "https", hostname: "pic.imgdb.cn" },
      { protocol: "https", hostname: "s41.ax1x.com" },
    ],
  },
};

export default withPWA(nextConfig);