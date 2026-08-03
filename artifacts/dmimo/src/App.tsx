import React, { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ProjectsPage from "@/pages/projects";
import ProjectDetail from "@/pages/project-detail";
import BlogPage from "@/pages/blog";
import BlogDetail from "@/pages/blog-detail";
import AboutPage from "@/pages/about";
import ServicesPage from "@/pages/services";

import AdminLogin from "@/pages/admin/index";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProjects from "@/pages/admin/projects";
import AdminBlog from "@/pages/admin/blog";
import AdminTeam from "@/pages/admin/team";
import AdminSettings from "@/pages/admin/settings";
import AdminInquiries from "@/pages/admin/inquiries";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/projects/:slug" component={ProjectDetail} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogDetail} />
      <Route path="/about" component={AboutPage} />
      <Route path="/services" component={ServicesPage} />
      
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/projects" component={AdminProjects} />
      <Route path="/admin/blog" component={AdminBlog} />
      <Route path="/admin/team" component={AdminTeam} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/inquiries" component={AdminInquiries} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
