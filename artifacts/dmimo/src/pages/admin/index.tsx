import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin, useAdminMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  
  // If already logged in, redirect
  const { data: auth } = useAdminMe();
  if (auth?.authenticated) {
    setLocation("/admin/dashboard");
  }

  const loginMutation = useAdminLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    loginMutation.mutate(
      { data: { password } },
      {
        onSuccess: () => {
          toast({ title: "Login successful" });
          setLocation("/admin/dashboard");
        },
        onError: () => {
          toast({ title: "Invalid password", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans text-foreground">
      <div className="w-full max-w-md bg-[#111111] border border-border/30 p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent" />
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-12 h-12 bg-background border border-primary/50 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-light tracking-[0.2em] mb-2 uppercase">DMIMO</h1>
          <p className="text-xs text-muted-foreground tracking-widest uppercase">Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Admin Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background border-border/50 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-foreground text-lg py-2"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loginMutation.isPending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none tracking-widest uppercase text-sm py-6"
          >
            {loginMutation.isPending ? "Authenticating..." : "Access Portal"}
          </Button>
        </form>
        
        <div className="mt-10 text-center">
          <a href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors tracking-widest uppercase">
            Return to Main Site
          </a>
        </div>
      </div>
    </div>
  );
}
