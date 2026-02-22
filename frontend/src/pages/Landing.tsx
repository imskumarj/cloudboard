import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard, Users, FolderKanban, Upload, Zap, Shield, ArrowRight, Check } from "lucide-react";

const features = [
  { icon: FolderKanban, title: "Kanban Boards", desc: "Drag-and-drop task management with customizable columns and priorities." },
  { icon: Users, title: "Team Collaboration", desc: "Real-time updates, comments, and notifications to keep everyone in sync." },
  { icon: Upload, title: "File Sharing", desc: "Seamless file uploads with S3 storage and organized project folders." },
  { icon: Shield, title: "Multi-Tenant Orgs", desc: "Isolated workspaces with role-based access control for every team." },
  { icon: Zap, title: "Real-Time Updates", desc: "Instant task and project updates powered by WebSocket connections." },
  { icon: LayoutDashboard, title: "Analytics Dashboard", desc: "Track progress with charts, KPIs, and exportable reports." },
];

const pricing = [
  { name: "Free", price: "$0", period: "/month", features: ["Up to 3 projects", "5 team members", "1 GB storage", "Basic Kanban board", "Email support"], cta: "Get Started", highlight: false },
  { name: "Pro", price: "$12", period: "/user/month", features: ["Unlimited projects", "50 team members", "50 GB storage", "Advanced Kanban + filters", "Priority support", "Analytics dashboard", "Custom roles"], cta: "Start Free Trial", highlight: true },
  { name: "Enterprise", price: "Custom", period: "", features: ["Everything in Pro", "Unlimited members", "Unlimited storage", "SSO & SAML", "Dedicated support", "Custom integrations", "SLA guarantee", "On-premise option"], cta: "Contact Sales", highlight: false },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <FolderKanban className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CloudBoard</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
            <Button asChild><Link to="/signup">Get Started <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 md:py-32 text-center">
        <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
          <Zap className="mr-2 h-3.5 w-3.5" /> Now with real-time collaboration
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
          Manage projects at <span className="text-primary">cloud speed</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          CloudBoard is the multi-tenant SaaS platform that brings your teams, tasks, and files together — with Kanban boards, real-time updates, and powerful organization management.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="text-base px-8 h-12" asChild>
            <Link to="/signup">Start Free Trial <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base px-8 h-12" asChild>
            <Link to="/login">View Demo</Link>
          </Button>
        </div>
        {/* Hero visual placeholder */}
        <div className="mt-16 mx-auto max-w-5xl rounded-xl border border-border/50 bg-card/50 p-2 shadow-2xl shadow-primary/5">
          <div className="rounded-lg bg-muted/50 h-[340px] md:h-[420px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <LayoutDashboard className="h-16 w-16 mx-auto mb-4 text-primary/50" />
              <p className="text-lg font-medium">Dashboard Preview</p>
              <p className="text-sm">Sign in to explore the full platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Everything your team needs</h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">Powerful features to keep your projects organized and your team productive.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors group">
              <CardContent className="p-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Simple, transparent pricing</h2>
          <p className="mt-4 text-muted-foreground text-lg">Start free. Scale as you grow.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricing.map((p) => (
            <Card key={p.name} className={`relative ${p.highlight ? "border-primary shadow-lg shadow-primary/10" : "border-border/50"}`}>
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <CardContent className="p-6 pt-8">
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{p.price}</span>
                  <span className="text-muted-foreground text-sm">{p.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-accent shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-8" variant={p.highlight ? "default" : "outline"} asChild>
                  <Link to="/signup">{p.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
              <FolderKanban className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">CloudBoard</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 CloudBoard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
