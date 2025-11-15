import { 
  LayoutDashboard, 
  CheckSquare, 
  Building2, 
  Mail, 
  Activity,
  Settings,
  HelpCircle
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Overview", url: "/app", icon: LayoutDashboard },
  { title: "Tasks", url: "/app/tasks", icon: CheckSquare },
  { title: "Suppliers", url: "/app/suppliers", icon: Building2 },
  { title: "Emails", url: "/app/emails", icon: Mail },
  { title: "Agent Activity", url: "/app/agents", icon: Activity },
  { title: "Settings", url: "/app/settings", icon: Settings },
  { title: "Help", url: "/app/help", icon: HelpCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/app"}
                      className="hover:bg-sidebar-accent transition-smooth"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}