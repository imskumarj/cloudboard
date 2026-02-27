import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import {
  getProfile,
  updateProfile,
  getNotificationPrefs,
  updateNotificationPrefs,
} from "@/services/settings.service";
import { User, Bell, Moon, Trash2 } from "lucide-react";
import { toast } from "sonner";

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const Settings = () => {
  const { profile, user, logout, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [saving, setSaving] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({
    email_notifications: true,
    push_notifications: true,
    task_assignments: true,
    mentions: true,
  });
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const data = await getNotificationPrefs();
        setNotifPrefs({
          email_notifications: data.emailNotifications,
          push_notifications: data.pushNotifications,
          task_assignments: data.taskAssignments,
          mentions: data.mentions,
        });
      } catch {
        toast.error("Failed to load preferences");
      }
    };

    loadPrefs();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateProfile({ name, email });
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const updateNotifPref = async (key: string, value: boolean) => {
    const updated = { ...notifPrefs, [key]: value };
    setNotifPrefs(updated);

    try {
      await updateNotificationPrefs({
        emailNotifications: updated.email_notifications,
        pushNotifications: updated.push_notifications,
        taskAssignments: updated.task_assignments,
        mentions: updated.mentions,
      });
    } catch {
      toast.error("Failed to save preference");
    }
  };

  useEffect(() => {
    if (notifPrefs.push_notifications) {
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, [notifPrefs.push_notifications]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-lg">{profile ? getInitials(profile.name) : "CB"}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">Change Avatar</Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" /></div>
          </div>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4 text-primary" /> Notifications</CardTitle>
          <CardDescription>Choose what you want to be notified about</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {([
            { key: "email_notifications", label: "Email Notifications", desc: "Receive email updates about your projects" },
            { key: "push_notifications", label: "Push Notifications", desc: "Browser notifications for real-time updates" },
            { key: "task_assignments", label: "Task Assignments", desc: "Notify when you're assigned a new task" },
            { key: "mentions", label: "Mentions", desc: "Notify when someone mentions you" },
          ] as const).map((n) => (
            <div key={n.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{n.label}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <Switch
                checked={notifPrefs[n.key]}
                onCheckedChange={(v) => updateNotifPref(n.key, v)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-destructive"><Trash2 className="h-4 w-4" /> Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Sign Out</p>
              <p className="text-xs text-muted-foreground">Sign out of your account</p>
            </div>
            <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={logout}>
              Sign Out
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently delete your account and data</p>
            </div>
            <Button variant="destructive" size="sm">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
