import { useQuery } from "@tanstack/react-query";
import {
  getProjects,
  getTasks,
  getTeamMembers,
  getFiles,
  getActivities,
  getProjectMembers,
} from "@/services/org.service";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
}

export function useTasks(projectId?: string) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasks(projectId),
    enabled: true,
  });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ["team"],
    queryFn: getTeamMembers,
  });
}

export function useFiles() {
  return useQuery({
    queryKey: ["files"],
    queryFn: getFiles,
  });
}

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
  });
}

export function useProjectMembers(projectId?: string) {
  return useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () =>
      projectId ? getProjectMembers(projectId) : Promise.resolve([]),
    enabled: !!projectId,
  });
}