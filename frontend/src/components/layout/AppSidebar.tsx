import { 
  LayoutDashboard, 
  CheckSquare, 
  Building2, 
  Mail, 
  Activity,
  Settings,
  HelpCircle,
  Home
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
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                          : "hover:bg-sidebar-accent transition-smooth"
                      }
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

        {/* ---- Home Button at Bottom ---- */}
        <div className="mt-auto p-4">
          <NavLink
            to="/"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 
                       text-white px-3 py-2 rounded-lg transition-colors"
          >
            <Home className="h-4 w-4" />
            {!collapsed && <span>Home</span>}
          </NavLink>
        </div>

      </SidebarContent>
    </Sidebar>
  );
}
