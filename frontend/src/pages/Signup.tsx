import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { FolderKanban } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type AppRole = "admin" | "manager" | "member";

const Signup = () => {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [role, setRole] = useState<AppRole>("admin");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupData, setSignupData] = useState<{ userId: string } | null>(null);
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // For non-admin, validate invite code first
    if (role !== "admin") {
      if (!inviteCode.trim()) {
        toast.error("Invite code is required to join an organization");
        return;
      }
      const { data: org } = await supabase
        .from("organizations")
        .select("id")
        .eq("invite_code", inviteCode.trim().toUpperCase())
        .maybeSingle();
      if (!org) {
        toast.error("Invalid invite code. Please check and try again.");
        return;
      }
    }

    setLoading(true);

    // Send OTP email
    try {
      const res = await supabase.functions.invoke("send-email", {
        body: { type: "otp", to: email, name },
      });
      if (res.error) {
        toast.error("Failed to send verification email");
        setLoading(false);
        return;
      }
      toast.success("Verification code sent to your email!");
      setStep("otp");
    } catch {
      toast.error("Failed to send verification email");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    setLoading(true);

    // Verify OTP
    const { data: verifyData, error: verifyError } = await supabase.functions.invoke("send-email", {
      body: { type: "verify-otp", email, otp },
    });
    if (verifyError || !verifyData?.valid) {
      toast.error("Invalid or expired code. Please try again.");
      setLoading(false);
      return;
    }

    // Now do the actual signup
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) {
      toast.error(authError.message);
      setLoading(false);
      return;
    }
    if (!authData.user) {
      toast.error("Signup failed");
      setLoading(false);
      return;
    }

    const userId = authData.user.id;

    if (role === "admin") {
      // Create organization
      const orgId = crypto.randomUUID();
      const { error: orgError } = await supabase.from("organizations").insert({ id: orgId, name: orgName });
      if (orgError) { toast.error(orgError.message); setLoading(false); return; }

      // Create profile (approved = true for admin)
      const { error: profileError } = await supabase.from("profiles").insert({ user_id: userId, name, email, org_id: orgId, approved: true });
      if (profileError) { toast.error(profileError.message); setLoading(false); return; }

      // Assign admin role
      const { error: roleError } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      if (roleError) { toast.error(roleError.message); setLoading(false); return; }

      toast.success("Organization created! Welcome aboard!");
    } else {
      // Join existing org via invite code
      const { data: org } = await supabase
        .from("organizations")
        .select("id")
        .eq("invite_code", inviteCode.trim().toUpperCase())
        .maybeSingle();

      if (!org) { toast.error("Invalid invite code"); setLoading(false); return; }

      // Create profile (approved = false, needs admin approval)
      const { error: profileError } = await supabase.from("profiles").insert({ user_id: userId, name, email, org_id: org.id, approved: false });
      if (profileError) { toast.error(profileError.message); setLoading(false); return; }

      // Assign role
      const { error: roleError } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (roleError) { toast.error(roleError.message); setLoading(false); return; }

      // Create notification for org admins
      // We'll just create a generic notification — admins will see pending members on Team page
      toast.success("Request sent! Waiting for admin approval.");
    }

    // Refresh profile data so AuthContext picks up the new role/org
    await refreshProfile();
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <FolderKanban className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CloudBoard</span>
          </Link>
          <CardTitle className="text-2xl">
            {step === "form" ? "Create your account" : "Verify your email"}
          </CardTitle>
          <CardDescription>
            {step === "form" ? "Start managing projects with your team" : `Enter the 6-digit code sent to ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Your Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin (Create Organization)</SelectItem>
                    <SelectItem value="manager">Manager (Join Organization)</SelectItem>
                    <SelectItem value="member">Member (Join Organization)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {role === "admin" ? (
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input id="orgName" placeholder="Acme Corp" value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Organization Invite Code</Label>
                  <Input id="inviteCode" placeholder="e.g. AB12CD34" value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())} required className="uppercase tracking-widest font-mono" />
                  <p className="text-xs text-muted-foreground">Ask your organization admin for the invite code</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending verification…" : "Continue"}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button className="w-full" onClick={handleVerifyOtp} disabled={loading || otp.length !== 6}>
                {loading ? "Verifying…" : "Verify & Create Account"}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => { setStep("form"); setOtp(""); }}>
                Back
              </Button>
            </div>
          )}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
