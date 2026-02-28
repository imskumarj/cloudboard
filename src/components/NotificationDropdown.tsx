import { useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotificationById,
} from "@/services/notification.service";

export function NotificationDropdown() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const markRead = async (id: string) => {
    await markNotificationRead(id);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const markAllRead = async () => {
    await markAllNotificationsRead();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const deleteNotification = async (id: string) => {
    await deleteNotificationById(id);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const typeIcons: Record<string, string> = {
    approval: "🟢",
    rejection: "🔴",
    task: "📋",
    project: "📁",
    info: "ℹ️",
    member_joined: "👋",
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-md hover:bg-muted transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-bold flex items-center justify-center text-accent-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={markAllRead}
            >
              <Check className="h-3 w-3 mr-1" /> Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No notifications yet
            </p>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((n: any) => (
                <div
                  key={n._id}
                  className={`px-4 py-3 flex gap-3 hover:bg-muted/50 transition-colors cursor-pointer ${
                    !n.read ? "bg-primary/5" : ""
                  }`}
                  onClick={() => !n.read && markRead(n._id)}
                >
                  <span className="text-lg shrink-0 mt-0.5">
                    {typeIcons[n.type] || "📌"}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? "font-semibold" : ""}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n._id);
                    }}
                    className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}