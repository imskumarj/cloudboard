import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeamMembers } from "@/hooks/useOrgData";
import { useQueryClient } from "@tanstack/react-query";
import { UserPlus, Shield, Mail, Copy, Check, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import {
  approveMember,
  declineMember,
  changeRole,
} from "@/services/team.service";
import { useAuth } from "@/contexts/AuthContext";

const roleColors: Record<string, string> = {
  admin: "bg-primary/20 text-primary",
  manager: "bg-accent/20 text-accent",
  member: "bg-muted text-muted-foreground",
};

const permissions = [
  { key: "manage_projects", label: "Manage Projects" },
  { key: "manage_members", label: "Manage Members" },
  { key: "manage_billing", label: "Manage Billing" },
  { key: "delete_tasks", label: "Delete Tasks" },
  { key: "upload_files", label: "Upload Files" },
  { key: "view_analytics", label: "View Analytics" },
];

const rolePermissions: Record<string, Record<string, boolean>> = {
  admin: { manage_projects: true, manage_members: true, manage_billing: true, delete_tasks: true, upload_files: true, view_analytics: true },
  manager: { manage_projects: true, manage_members: false, manage_billing: false, delete_tasks: true, upload_files: true, view_analytics: true },
  member: { manage_projects: false, manage_members: false, manage_billing: false, delete_tasks: false, upload_files: true, view_analytics: false },
};

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const Team = () => {
  const { role: currentUserRole, user, organization } = useAuth();
  const { data: members = [], isLoading } = useTeamMembers();
  console.log("Members:", members);
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [codeCopied, setCodeCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isAdmin = currentUserRole === "admin";
  const approvedMembers = members.filter((m: any) => m.approved);
  const pendingMembers = members.filter((m: any) => !m.approved);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail);

  const copyInviteCode = () => {
    if (organization?.inviteCode) {
      navigator.clipboard.writeText(organization.inviteCode);
      setCodeCopied(true);
      toast.success("Invite code copied!");
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleInvite = async () => {
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteOpen(false);
    setInviteEmail("");
  };

  const handleApprove = async (userId: string, name: string) => {
    try {
      setActionLoading(userId);
      await approveMember(userId);
      toast.success(`${name} approved`);
      queryClient.invalidateQueries({ queryKey: ["team"] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to approve member");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (userId: string, name: string) => {
    try {
      setActionLoading(userId);
      await declineMember(userId);
      toast.success(`${name} declined`);
      queryClient.invalidateQueries({ queryKey: ["team"] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to decline member");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!isAdmin) {
      toast.error("Only admins can change roles");
      return;
    }

    try {
      setActionLoading(userId);
      await changeRole(userId, newRole);
      toast.success("Role updated");
      queryClient.invalidateQueries({ queryKey: ["team"] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update role");
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Team</h1>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className="text-muted-foreground text-sm">{approvedMembers.length} members in your organization</p>
        </div>
        {isAdmin && (
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><UserPlus className="h-4 w-4 mr-1" /> Invite Member</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Invite a Team Member</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@company.com" className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleInvite} className="w-full" disabled={!isValidEmail}>
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Invite Code Card (Admin Only) */}
      {isAdmin && organization?.inviteCode && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Organization Invite Code</p>
              <p className="text-xs text-muted-foreground mt-0.5">Share this code with team members to let them join</p>
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-background px-4 py-2 rounded-lg text-lg font-mono font-bold tracking-widest border border-border">
                {organization.inviteCode}
              </code>
              <Button variant="outline" size="icon" onClick={copyInviteCode}>
                {codeCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Approval Requests (Admin Only) */}
      {isAdmin && pendingMembers.length > 0 && (
        <Card className="border-amber-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Pending Approval ({pendingMembers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingMembers.map((m: any) => (
                <div key={m._id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-amber-500/10 text-amber-600 text-sm">{getInitials(m.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </div>
                  <Badge className="capitalize text-[10px] bg-muted text-muted-foreground">{m.role}</Badge>
                  <div className="flex gap-1.5">
                    <Button disabled={actionLoading === m._id} size="sm" variant="outline" className="h-8 text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleApprove(m._id, m.name)}>
                      <UserCheck className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                    <Button disabled={actionLoading === m._id} size="sm" variant="outline" className="h-8 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleDecline(m._id, m.name)}>
                      <UserX className="h-3.5 w-3.5 mr-1" /> Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {approvedMembers.map((m: any) => (
              <div key={m._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">{getInitials(m.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
                {isAdmin && m._id !== user?.id ? (
                  <Select
                    value={m.role}
                    disabled={actionLoading === m._id}
                    onValueChange={(v) => handleRoleChange(m._id, v)}
                  >
                    <SelectTrigger className="w-28 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={`capitalize text-[10px] ${roleColors[m.role]}`}>{m.role}</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Permission</th>
                  <th className="text-center py-2 px-4 font-medium">Admin</th>
                  <th className="text-center py-2 px-4 font-medium">Manager</th>
                  <th className="text-center py-2 px-4 font-medium">Member</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((p) => (
                  <tr key={p.key} className="border-b border-border/50">
                    <td className="py-3 pr-4 text-muted-foreground">{p.label}</td>
                    {(["admin", "manager", "member"] as const).map((role) => (
                      <td key={role} className="text-center py-3 px-4">
                        <Switch checked={rolePermissions[role][p.key]} disabled className="mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Team;
