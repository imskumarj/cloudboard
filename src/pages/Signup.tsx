import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { FolderKanban } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { sendOtp, verifyOtpAndSignup } from "@/services/auth.service";

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

  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await sendOtp(email, name);
      toast.success("Verification code sent to your email!");
      setStep("otp");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to send verification email"
      );
    }

    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    setLoading(true);

    try {
      await verifyOtpAndSignup({
        name,
        email,
        password,
        orgName,
        inviteCode,
        role,
        otp,
      });

      toast.success("Account created successfully!");
      await refreshProfile();
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Invalid or expired code. Please try again."
      );
    }

    setLoading(false);
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
            {step === "form"
              ? "Start managing projects with your team"
              : `Enter the 6-digit code sent to ${email}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Your Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      Admin (Create Organization)
                    </SelectItem>
                    <SelectItem value="manager">
                      Manager (Join Organization)
                    </SelectItem>
                    <SelectItem value="member">
                      Member (Join Organization)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {role === "admin" ? (
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input
                    placeholder="Acme Corp"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Organization Invite Code</Label>
                  <Input
                    placeholder="AB12CD34"
                    value={inviteCode}
                    onChange={(e) =>
                      setInviteCode(e.target.value.toUpperCase())
                    }
                    required
                    className="uppercase tracking-widest font-mono"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                className="w-full"
                onClick={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? "Verifying…" : "Verify & Create Account"}
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep("form");
                  setOtp("");
                }}
              >
                Back
              </Button>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;