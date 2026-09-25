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
  // 静态导出：next build 直接产出 out/ 目录，可托管在 GitHub Pages 等纯静态服务
  output: "export",
  trailingSlash: true,
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