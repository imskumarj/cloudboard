import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects, useTeamMembers } from "@/hooks/useOrgData";
import {
  getTasks,
  createTask,
  updateTask,
} from "@/services/task.service";
import { Plus, Calendar, Filter } from "lucide-react";
import { toast } from "sonner";
import { socket } from "@/services/socket";

type TaskStatus = "todo" | "in-progress" | "in-review" | "done";
type TaskPriority = "low" | "medium" | "high" | "urgent";

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: "todo", title: "To Do", color: "bg-muted-foreground" },
  { id: "in-progress", title: "In Progress", color: "bg-primary" },
  { id: "in-review", title: "In Review", color: "bg-yellow-500" },
  { id: "done", title: "Done", color: "bg-accent" },
];

const priorityColors: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-primary/20 text-primary",
  high: "bg-yellow-500/20 text-yellow-500",
  urgent: "bg-destructive/20 text-destructive",
};

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const KanbanBoard = () => {
  const { profile, user } = useAuth();
  const { data: projects = [] } = useProjects();
  const { data: members = [] } = useTeamMembers();

  const [tasks, setTasks] = useState<any[]>([]);
  const [filterProject, setFilterProject] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as TaskPriority,
    assignee_id: "",
    project_id: "",
  });

  useEffect(() => {
    if (!profile?.orgId) return;

    socket.emit("join-org", profile.orgId);
  }, [profile?.orgId]);

  useEffect(() => {
    socket.on("task-created", (task) => {
      setTasks((prev) => [task, ...prev]);
    });

    socket.on("task-updated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === updatedTask.id ? updatedTask : t
        )
      );
    });

    socket.on("task-deleted", ({ id }) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    });

    return () => {
      socket.off("task-created");
      socket.off("task-updated");
      socket.off("task-deleted");
    };
  }, []);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);

      try {
        const data = await getTasks(
          filterProject === "all" ? undefined : filterProject
        );
        setTasks(data);
      } catch {
        toast.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filterProject]);

  // Set defaults when data loads
  useEffect(() => {
    if (projects.length > 0 && !newTask.project_id) {
      setNewTask((t) => ({ ...t, project_id: projects[0].id }));
    }
    if (user && !newTask.assignee_id) {
      setNewTask((t) => ({ ...t, assignee_id: user.id }));
    }
  }, [projects, user, newTask.project_id, newTask.assignee_id]);

  const filteredTasks = filterProject === "all" ? tasks : tasks.filter((t) => t.project_id === filterProject);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    if (result.destination.droppableId === result.source.droppableId)
      return;

    const newStatus = result.destination.droppableId as TaskStatus;
    const taskId = result.draggableId;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    );

    try {
      await updateTask(taskId, { status: newStatus });
    } catch {
      toast.error("Failed to update task");

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status: result.source.droppableId }
            : t
        )
      );
    }
  };

  const handleAddTask = async () => {
    try {
      await createTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        projectId: newTask.project_id,
        assignedTo: newTask.assignee_id,
        status: "todo",
        dueDate: new Date(Date.now() + 7 * 86400000),
      });

      toast.success("Task created!");

      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        assignee_id: user?.id || "",
        project_id: projects[0]?.id || "",
      });

      setAddOpen(false);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to create task"
      );
    }
  };

  const getAssigneeName = (userId: string) => {
    const m = members.find(
      (m: any) => (m.id || m._id)?.toString() === userId?.toString()
    );
    return m?.name || "Unassigned";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Kanban Board</h1>
          <p className="text-muted-foreground text-sm">Loading tasks…</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kanban Board</h1>
          <p className="text-muted-foreground text-sm">Drag and drop tasks between columns</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterProject} onValueChange={setFilterProject}>
              <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" disabled={projects.length === 0}>
                <Plus className="h-4 w-4 mr-1" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create New Task</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task title" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Task description" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v as TaskPriority })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Project</Label>
                    <Select value={newTask.project_id} onValueChange={(v) => setNewTask({ ...newTask, project_id: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {projects.map((p: any) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <Select value={newTask.assignee_id} onValueChange={(v) => setNewTask({ ...newTask, assignee_id: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {members.map((m: any) => (
                        <SelectItem key={m.id || m._id} value={m.id || m._id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddTask} disabled={!newTask.title || !newTask.project_id} className="w-full">Create Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Create a project first to start adding tasks.</p>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                  <h3 className="text-sm font-semibold">{col.title}</h3>
                  <span className="text-xs text-muted-foreground ml-auto">{colTasks.length}</span>
                </div>
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[200px] space-y-2 rounded-lg p-2 transition-colors ${snapshot.isDraggingOver ? "bg-primary/5" : "bg-muted/30"}`}
                    >
                      {colTasks.map((task, idx) => (
                        <Draggable key={task.id} draggableId={task.id} index={idx}>
                          {(prov) => (
                            <Card ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                              <CardContent className="p-3 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-sm font-medium leading-snug">{task.title}</p>
                                  <Badge className={`text-[10px] px-1.5 py-0 shrink-0 ${priorityColors[task.priority]}`}>
                                    {task.priority}
                                  </Badge>
                                </div>
                                {task.tags && task.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {task.tags.map((tag: string) => (
                                      <span key={tag} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{tag}</span>
                                    ))}
                                  </div>
                                )}
                                <div className="flex items-center justify-between pt-1">
                                  <div className="flex items-center gap-1.5">
                                    <Avatar className="h-5 w-5">
                                      <AvatarFallback className="bg-primary/10 text-primary text-[8px]">
                                        {getInitials(getAssigneeName(task.assignee_id))}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-[11px] text-muted-foreground">{getAssigneeName(task.assignee_id).split(" ")[0]}</span>
                                  </div>
                                  {task.due_date && (
                                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
