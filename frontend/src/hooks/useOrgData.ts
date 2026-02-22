import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useProjects() {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["projects", profile?.org_id],
    queryFn: async () => {
      if (!profile?.org_id) return [];
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("org_id", profile.org_id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.org_id,
  });
}

export function useTasks(projectId?: string) {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["tasks", profile?.org_id, projectId],
    queryFn: async () => {
      if (!profile?.org_id) return [];
      let query = supabase.from("tasks").select("*");
      if (projectId && projectId !== "all") {
        query = query.eq("project_id", projectId);
      }
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.org_id,
  });
}

export function useTeamMembers() {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["team", profile?.org_id],
    queryFn: async () => {
      if (!profile?.org_id) return [];
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("org_id", profile.org_id);
      if (error) throw error;

      // Fetch roles for all members
      const userIds = profiles.map((p) => p.user_id);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("*")
        .in("user_id", userIds);

      return profiles.map((p) => ({
        ...p,
        role: roles?.find((r) => r.user_id === p.user_id)?.role || "member",
      }));
    },
    enabled: !!profile?.org_id,
  });
}

export function useFiles() {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["files", profile?.org_id],
    queryFn: async () => {
      if (!profile?.org_id) return [];
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("org_id", profile.org_id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.org_id,
  });
}

export function useActivities() {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["activities", profile?.org_id],
    queryFn: async () => {
      if (!profile?.org_id) return [];
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("org_id", profile.org_id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.org_id,
  });
}

export function useProjectMembers(projectId?: string) {
  return useQuery({
    queryKey: ["project-members", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("project_members")
        .select("*")
        .eq("project_id", projectId);
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
}
