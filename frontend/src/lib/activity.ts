import { supabase } from "@/integrations/supabase/client";

export async function logActivity(orgId: string, userId: string, action: string, target: string) {
  await supabase.from("activities").insert({ org_id: orgId, user_id: userId, action, target });
}
