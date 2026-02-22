import { useAuth } from "@/contexts/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationDropdown } from "@/components/NotificationDropdown";

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export function Header() {
  const { profile, role } = useAuth();

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground" />
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects, tasks…" className="pl-9 w-64 h-9 bg-muted/50 border-none" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <NotificationDropdown />
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {profile ? getInitials(profile.name) : "CB"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">{profile?.name}</p>
            <Badge variant="secondary" className="mt-0.5 text-[10px] px-1.5 py-0 capitalize">{role || "member"}</Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
