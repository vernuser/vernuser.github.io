/*
 * 站点配置读取
 * 说明：为支持静态导出（GitHub Pages 等纯静态托管），配置在构建期直接打包进产物，
 *      不再在运行时读盘 / 连接数据库。
 */
import { AppConfig, Site } from "@/config/config";
import { defaultAppConfig } from "./rules";
import siteConfig from "@/config/config.json";

export const IS_DATABASE = false;

/** 构建期解析好的配置（由打包器内联） */
export function getConfigSync(): AppConfig {
  return siteConfig as unknown as AppConfig;
}

export async function getConfig(throwError: boolean = false) {
  void throwError;
  return getConfigSync();
}

export async function setConfig(appConfig: AppConfig) {
  // 静态站点不支持在线写回配置，请在仓库里直接编辑 src/config/config.json
  void appConfig;
  console.log("静态站点：请直接编辑 src/config/config.json 后重新构建");
  return false;
}

export const transformConfig = (appConfig: AppConfig) => {
  const {
    sites = [],
    layoutConfig = {},
    sitesConfig = {},
    keywords,
    description,
    favicon,
    domain,
    bgConfig,
    globalStyle,
    footer,
    ...others
  } = appConfig;

  const primaryColor: string = globalStyle?.primaryColor || "#229fff";

  /** 布局配置结构于对象中 */
  const { istTransition = true, gapSize = "md", style } = layoutConfig;

  /** 样式变量及样式 */
  const varStyle: Record<string, string> = {
    "--primary-color": primaryColor,
  };

  /** 处理站点：没有 url 的那张卡作为「更多站点」入口，其后的卡片进弹窗 */
  const index = sites.findIndex((v: Site) => !v.url);
  let staticSites: Site[] = [],
    modalSites: Site[] = [];
  if (index > -1) {
    if (!sitesConfig.modal) {
      staticSites = sites.filter((_, i) => i !== index);
    } else {
      staticSites = sites.slice(0, index + 1);
      modalSites = sites.slice(index + 1);
    }
  } else {
    staticSites = sites;
  }

  /** 背景处理 */
  let bgs: string[] = [],
    mbgs: string[] = [];
  if (!bgConfig?.bg) {
    bgs.push("/SAO-bg.jpg");
  } else if (typeof bgConfig.bg === "string") {
    bgs.push(bgConfig.bg);
  } else if (Array.isArray(bgConfig.bg)) {
    bgs = bgConfig.bg;
  }
  if (!bgConfig?.mbg) {
    mbgs.push("/SAO-bg.jpg");
  } else if (typeof bgConfig.mbg === "string") {
    mbgs.push(bgConfig.mbg);
  } else if (Array.isArray(bgConfig.mbg)) {
    mbgs = bgConfig.mbg;
  }

  let footers = 0;
  if (typeof footer === "object" && footer.direction?.includes("col")) {
    if (footer.ICP) ++footers;
    if (footer.MPSICP) ++footers;
    if (footer.text) ++footers;
  }

  return {
    ...others,
    footers,
    footer,
    bgConfig: { ...bgConfig, bgs, mbgs },
    sitesConfig,
    primaryColor,
    globalStyle,
    istTransition,
    gapSize,
    style,
    varStyle,
    staticSites,
    modalSites,
    keywords,
    description,
    favicon,
    domain,
  };
};

export const mergeConfig = (appConfig: AppConfig) => {
  return Object.assign({ ...defaultAppConfig }, appConfig);
};
