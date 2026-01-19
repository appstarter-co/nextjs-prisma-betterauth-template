export interface SidebarMenuType {
  title: string;
  url: string | Function;
  icon?: any;
  dropdownMenu?: {
    title: string;
    url: string;
    icon?: any;
  }[];
  submenu?: {
    title: string;
    url: string;
    icon?: any;
  }[];
}

export interface AppConfigType {
  version: string;
  environment: "development" | "staging" | "production";
  
  api: {
    baseUrl: string;
    authEndpoint: string;
    userEndpoint: string;
  };
  
  features: Record<string, boolean>;
  
  branding: {
    appName: string;
    logoUrl: string;
    faviconUrl: string;
  };
  
  layout: {
    showSidebar: boolean;
    showFooter: boolean;
    sidebarPosition: "left" | "right";
    defaultPage: string;
  };
  
  sidebarMenu?: any;
  siteConfig?: any;
}