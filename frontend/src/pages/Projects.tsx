import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects, useTasks } from "@/hooks/useOrgData";
import { createProject } from "@/services/project.service";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, LayoutGrid, List, Briefcase } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  active: "bg-accent/20 text-accent",
  completed: "bg-primary/20 text-primary",
  "on-hold": "bg-yellow-500/20 text-yellow-500",
};

const Projects = () => {
  const { profile, user, role } = useAuth();
  const { data: projects = [], isLoading } = useProjects();
  const { data: tasks = [] } = useTasks();
  const queryClient = useQueryClient();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [addOpen, setAddOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  const canCreate = role === "admin" || role === "manager";

  const handleAdd = async () => {
    try {
      await createProject({
        name: newProject.name,
        description: newProject.description,
      });

      toast.success("Project created!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      setNewProject({ name: "", description: "" });
      setAddOpen(false);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to create project"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm">{projects.length} total projects</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-md">
            <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-muted" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
            <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-muted" : ""}`}><List className="h-4 w-4" /></button>
          </div>
          {canCreate && (
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> New Project</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create New Project</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Name</Label><Input value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} placeholder="Project name" /></div>
                  <div className="space-y-2"><Label>Description</Label><Textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Brief description" /></div>
                  <Button onClick={handleAdd} disabled={!newProject.name} className="w-full">Create Project</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No projects yet</p>
          <p className="text-sm">{canCreate ? "Create your first project to get started." : "Your admin or manager will create projects for you."}</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p: any) => {
            const taskCount = tasks.filter((t: any) => t.projectId === p.id).length;
            return (
              <Card key={p.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{p.name}</h3>
                        <p className="text-xs text-muted-foreground">{taskCount} tasks</p>
                      </div>
                    </div>
                    <Badge className={`text-[10px] capitalize ${statusColors[p.status]}`}>{p.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{p.progress}%</span>
                    </div>
                    <Progress value={p.progress} className="h-1.5" />
                  </div>
                  <span className="text-[11px] text-muted-foreground">Updated {new Date(p.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((p: any) => (
            <Card key={p.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{p.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                </div>
                <Badge className={`text-[10px] capitalize hidden sm:inline-flex ${statusColors[p.status]}`}>{p.status}</Badge>
                <div className="w-24 hidden md:block">
                  <Progress value={p.progress} className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground text-right mt-0.5">{p.progress}%</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
