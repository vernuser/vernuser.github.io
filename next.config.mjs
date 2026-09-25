/*
 * remio-home 站点配置
 * 作者信息与站点数据见 src/config/config.json
 */
/** @type {import('next').NextConfig} */
import nextPWA from "next-pwa";

const isProd = process.env.NODE_ENV === "production";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: !isProd,
});

const nextConfig = {
  // standalone：可用 `next start` 本地预览 / Node 环境部署
  // 如需纯静态托管（GitHub Pages），改为 output: "export" 并移除中间件与 /config
  output: "standalone",
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // public/ 下的目录式静态页（/article-list/、/article/<slug>/）在 next start 下需要显式重写
  async rewrites() {
    return [
      { source: "/article-list", destination: "/article-list/index.html" },
      { source: "/article-list/", destination: "/article-list/index.html" },
      { source: "/article/:slug", destination: "/article/:slug/index.html" },
      { source: "/article/:slug/", destination: "/article/:slug/index.html" },
    ];
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