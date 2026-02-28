import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useFiles, useProjects } from "@/hooks/useOrgData";
import { getFiles, getUploadUrl, saveFileMeta, deleteFile as deleteFileService } from "@/services/file.service";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Image, FileArchive, File, Upload, LayoutGrid, List, Trash2 } from "lucide-react";
import { toast } from "sonner";

const fileIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  png: Image,
  jpg: Image,
  jpeg: Image,
  gif: Image,
  webp: Image,
  svg: Image,
  zip: FileArchive,
  rar: FileArchive,
  md: FileText,
  txt: FileText,
  docx: FileText,
  xlsx: FileText,
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const Files = () => {
  const { profile, user, role } = useAuth();
  const { data: files = [], isLoading } = useFiles();
  const { data: projects = [] } = useProjects();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [uploading, setUploading] = useState(false);

  const canDelete = role === "admin" || role === "manager";

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return "General";
    const p = projects.find((p: any) => p.id === projectId);
    return p?.name || "Unknown";
  };

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList) return;

    setUploading(true);

    for (const file of Array.from(fileList)) {
      try {
        const { uploadUrl, key, publicUrl } = await getUploadUrl({
          fileName: file.name,
          contentType: file.type,
        });

        // Upload directly to S3
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        // Save metadata
        await saveFileMeta({
          name: file.name,
          key,
          url: publicUrl,
          size: file.size,
          type: file.name.split(".").pop(),
        });

      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    toast.success("Files uploaded!");
    queryClient.invalidateQueries({ queryKey: ["files"] });
    setUploading(false);
  };

  const handleDelete = async (
    fileId: string,
    fileName: string
  ) => {
    try {
      setUploading(true);

      await deleteFileService(fileId);

      toast.success(`${fileName} deleted successfully`);

      queryClient.invalidateQueries({ queryKey: ["files"] });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to delete file"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (uploading) return;

    const files = e.dataTransfer.files;
    handleUpload(files);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Files</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Files</h1>
          <p className="text-muted-foreground text-sm">{files.length} files across all projects</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-md">
            <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-muted" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
            <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-muted" : ""}`}><List className="h-4 w-4" /></button>
          </div>
          <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload className="h-4 w-4 mr-1" /> {uploading ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </div>

      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={handleDrop}
      >
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium">Drop files here or click to upload</p>
        <p className="text-xs text-muted-foreground mt-1">Files are stored securely in cloud storage</p>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No files uploaded yet.</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {files.map((f: any) => {
            const Icon = fileIcons[f.type] || File;
            return (
              <Card key={f.id} className="hover:border-primary/30 transition-colors group relative">
                <CardContent className="p-4 space-y-2">
                  <div className="h-20 rounded-md bg-muted/50 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium truncate">{f.name}</p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{formatSize(f.size)}</span>
                    <span>{getProjectName(f.project_id)}</span>
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(f._id || f.id, f.name)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-1">
          {files.map((f: any) => {
            const Icon = fileIcons[f.type] || File;
            return (
              <Card key={f.id} className="group">
                <CardContent className="p-3 flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.name}</p>
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:inline">{getProjectName(f.project_id)}</span>
                  <span className="text-xs text-muted-foreground">{formatSize(f.size)}</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">{new Date(f.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(f._id || f.id, f.name)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Files;
