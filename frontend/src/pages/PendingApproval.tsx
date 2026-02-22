import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const PendingApproval = () => {
  const { profile, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Approval Pending</CardTitle>
          <CardDescription className="text-base mt-2">
            Hi {profile?.name}, your request to join the organization is pending admin approval. You'll be notified once approved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              Your admin has been notified of your request. Please wait for them to approve your access.
            </p>
          </div>
          <Button variant="outline" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApproval;
