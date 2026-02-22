import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useProjects, useTasks, useTeamMembers, useFiles, useActivities } from "@/hooks/useOrgData";
import { Briefcase, CheckSquare, Users, FileText, TrendingUp, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const PIE_COLORS = ["hsl(262, 83%, 58%)", "hsl(174, 72%, 46%)", "hsl(45, 93%, 58%)", "hsl(142, 71%, 45%)"];

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const Dashboard = () => {
  const { data: projects = [], isLoading: loadingProjects } = useProjects();
  const { data: tasks = [], isLoading: loadingTasks } = useTasks();
  const { data: members = [], isLoading: loadingMembers } = useTeamMembers();
  const { data: files = [] } = useFiles();
  const { data: activities = [] } = useActivities();

  const stats = [
    { label: "Total Projects", value: projects.length, icon: Briefcase, color: "text-primary" },
    { label: "Active Tasks", value: tasks.filter((t: any) => t.status !== "done").length, icon: CheckSquare, color: "text-accent" },
    { label: "Team Members", value: members.length, icon: Users, color: "text-primary" },
    { label: "Files Uploaded", value: files.length, icon: FileText, color: "text-accent" },
  ];

  const tasksByStatus = [
    { name: "To Do", value: tasks.filter((t: any) => t.status === "todo").length },
    { name: "In Progress", value: tasks.filter((t: any) => t.status === "in-progress").length },
    { name: "In Review", value: tasks.filter((t: any) => t.status === "in-review").length },
    { name: "Done", value: tasks.filter((t: any) => t.status === "done").length },
  ];

  const projectProgress = projects.slice(0, 4).map((p: any) => ({
    name: p.name.split(" ").slice(0, 2).join(" "),
    progress: p.progress,
  }));

  const isLoading = loadingProjects || loadingTasks || loadingMembers;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Loading your workspace…</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  // Look up member name from activities
  const getMemberName = (userId: string) => {
    const m = members.find((m: any) => m.user_id === userId);
    return m?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Project Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectProgress.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={projectProgress}>
                  <XAxis dataKey="name" tick={{ fill: "hsl(220, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(220, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(230, 25%, 10%)", border: "1px solid hsl(230, 20%, 18%)", borderRadius: 8, color: "hsl(220, 20%, 93%)" }} />
                  <Bar dataKey="progress" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground py-10 text-center">No projects yet. Create one to see progress.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-accent" /> Tasks by Status
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            {tasks.length > 0 ? (
              <>
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={tasksByStatus} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                      {tasksByStatus.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(230, 25%, 10%)", border: "1px solid hsl(230, 20%, 18%)", borderRadius: 8, color: "hsl(220, 20%, 93%)" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {tasksByStatus.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-2 text-sm">
                      <div className="h-3 w-3 rounded-full" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-muted-foreground">{s.name}</span>
                      <span className="font-medium ml-auto">{s.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground py-10 text-center w-full">No tasks yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" /> Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((a: any) => (
                <div key={a.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-0.5">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {getInitials(getMemberName(a.user_id))}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{getMemberName(a.user_id)}</span>{" "}
                      <span className="text-muted-foreground">{a.action}</span>{" "}
                      <span className="font-medium">{a.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">No activity yet. Start by creating a project!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
