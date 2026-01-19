import { AppConfigType } from "./schema";
import { sidebarMenuData } from "./sidebar";
import { siteConfigData } from "./site";
import configJson from './config.json';

let cached: any | null = null;

export async function loadAppConfig(): Promise<any> {
  if (cached) return cached;
  cached = configJson as AppConfigType;
  cached.sidebarMenu = sidebarMenuData;
  cached.siteConfig = siteConfigData;
  return cached;
}
