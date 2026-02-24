import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { FolderKanban } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { sendResetOtp, resetPassword } from "@/services/auth.service";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetStep, setResetStep] = useState<"email" | "otp">("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // 🔹 Login submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await login(email, password);

    setLoading(false);

    if (error) {
      toast.error(error);
    } else {
      navigate("/dashboard");
    }
  };

  // 🔹 Send reset OTP
  const handleSendResetOtp = async () => {
    if (!resetEmail) {
      toast.error("Enter your email");
      return;
    }

    try {
      await sendResetOtp(resetEmail);
      toast.success("Verification code sent to your email");
      setResetStep("otp");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to send verification code"
      );
    }
  };

  // 🔹 Verify + Reset Password
  const handleResetPassword = async () => {
    if (resetOtp.length !== 6) {
      toast.error("Enter 6-digit code");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await resetPassword({
        email: resetEmail,
        otp: resetOtp,
        newPassword,
      });

      toast.success("Password updated successfully!");
      setForgotOpen(false);
      setResetStep("email");
      setResetOtp("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Invalid or expired code"
      );
    }
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
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => setForgotOpen(true)}
                >
                  Forgot password?
                </button>
              </div>

              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>

      {/* 🔹 Forgot Password Modal */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {resetStep === "email"
                ? "Reset Password"
                : "Verify Email"}
            </DialogTitle>
            <DialogDescription>
              {resetStep === "email"
                ? "Enter your email to receive a verification code."
                : "Enter the 6-digit code sent to your email."}
            </DialogDescription>
          </DialogHeader>

          {resetStep === "email" ? (
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="you@company.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <Button className="w-full" onClick={handleSendResetOtp}>
                Send Code
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={resetOtp} onChange={setResetOtp}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <Button className="w-full" onClick={handleResetPassword}>
                Reset Password
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;