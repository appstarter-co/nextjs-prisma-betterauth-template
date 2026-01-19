import {
  Copy,
  LayoutDashboard,
  Database,
  FileText,
  Folder,
  Home,
  BarChart3,
  Settings,
  User,
  Calendar,
  Trash2,
  Share,
} from "lucide-react";
import { SidebarMenuType } from "@/config/schema";
import { openDrawer } from "@/context/use-drawer";

export const sidebarMenuData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    } as SidebarMenuType,
    {
      title: "Account",
      url: "/account",
      icon: User,
    } as SidebarMenuType,
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    } as SidebarMenuType,
    {
      title: "Setting",
      url: "#",
      icon: Settings,
      submenu: [
        {
          title: "General",
          url: '/setting',
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Plan & Usage",
          url: "#",
        },
        {
          title: "Notifications",
          url: "#",
        },
      ],
    } as SidebarMenuType, 
  ],
  navSecondary: [
    {
      title: "Developers",
      url: "#",
      icon: Home,
    } as SidebarMenuType,
    {
      title: "API Keys",
      url: "#",
      icon: Copy,
    } as SidebarMenuType,
  ],
  documents: [
    {title: "Open Drawer", 
      url: ()=>openDrawer({
          id: "my-drawer",
          description: "open drawer overview",
        }), 
      icon: FileText 
    },
    {
      title: "Dropdown Menu",
      url: "#",
      icon: Database,
      dropdownMenu: [
        { title: "Open", url: "#", icon: Folder },
        { title: "Share", url: "#", icon: Share },
        { title: "Delete", url: "#", icon: Trash2 },
      ],
    } as SidebarMenuType,
    {
      title: "Collapsible Menu",
      url: "#",
      icon: BarChart3,
      submenu: [
        {
          title: "Pinned",
          url: "#",
        },
        {
          title: "New submenu",
          url: "#",
        },
      ],
    } as SidebarMenuType
  ]
};