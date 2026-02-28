import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Projects", url: "/projects", icon: Briefcase },
  { title: "Kanban Board", url: "/kanban", icon: FolderKanban },
  { title: "Team", url: "/team", icon: Users },
  { title: "Files", url: "/files", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export function AppSidebar() {
  const { profile, organization, role, logout } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="p-4 flex items-center gap-2 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <FolderKanban className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="overflow-hidden group-data-[collapsible=icon]:hidden">
          <p className="text-sm font-semibold truncate">{organization?.name || "CloudBoard"}</p>
          <p className="text-xs text-sidebar-foreground/60 truncate capitalize">{organization?.plan || "free"} plan</p>
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/dashboard"} activeClassName="bg-sidebar-accent text-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {profile ? getInitials(profile.name) : "CB"}
            </AvatarFallback>
          </Avatar>
          <div className="overflow-hidden group-data-[collapsible=icon]:hidden flex-1">
            <p className="text-sm font-medium truncate">{profile?.name}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate capitalize">{role || "member"}</p>
          </div>
          <button onClick={logout} className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-foreground transition-colors group-data-[collapsible=icon]:hidden" title="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
