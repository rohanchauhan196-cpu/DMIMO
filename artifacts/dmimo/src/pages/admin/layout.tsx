import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAdminMe, useAdminLogout } from "@workspace/api-client-react";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  PenTool, 
  Users, 
  Settings, 
  MessageSquare,
  LogOut,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: auth, isLoading } = useAdminMe();
  const logoutMutation = useAdminLogout();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !auth?.authenticated) {
      setLocation("/admin");
    }
  }, [auth, isLoading, setLocation]);

  if (isLoading || !auth?.authenticated) {
    return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast({ title: "Logged out" });
        setLocation("/admin");
      }
    });
  };

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Projects", path: "/admin/projects", icon: ImageIcon },
    { label: "Journal", path: "/admin/blog", icon: PenTool },
    { label: "Team", path: "/admin/team", icon: Users },
    { label: "Inquiries", path: "/admin/inquiries", icon: MessageSquare },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-foreground font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-border/30 flex flex-col hidden md:flex">
        <div className="p-8 border-b border-border/30">
          <h2 className="text-xl font-light tracking-[0.2em] uppercase text-white mb-1">DMIMO</h2>
          <p className="text-[0.6rem] text-primary tracking-widest uppercase">Admin Portal</p>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors text-sm tracking-wide ${isActive ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/30 space-y-2">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 text-sm tracking-wide text-muted-foreground hover:text-white transition-colors cursor-pointer">
            <Globe className="w-4 h-4" />
            View Site
          </a>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm tracking-wide text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-[#111111] border-b border-border/30">
          <div>
            <h2 className="text-lg font-light tracking-[0.2em] uppercase text-white">DMIMO</h2>
          </div>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-white p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Mobile Nav */}
        <div className="md:hidden flex overflow-x-auto bg-[#111111] border-b border-border/30 p-2 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex items-center whitespace-nowrap gap-2 px-4 py-2 rounded-full text-xs tracking-wide ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                  <item.icon className="w-3 h-3" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 md:p-10 relative">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
