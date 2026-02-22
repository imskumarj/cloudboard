import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
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
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>We'll send you a link to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <span className="text-accent text-xl">✓</span>
              </div>
              <p className="text-sm text-muted-foreground">If an account exists for <strong>{email}</strong>, you'll receive a reset link shortly.</p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/login"><ArrowLeft className="mr-2 h-4 w-4" /> Back to login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Send Reset Link</Button>
              <Button variant="ghost" asChild className="w-full">
                <Link to="/login"><ArrowLeft className="mr-2 h-4 w-4" /> Back to login</Link>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
