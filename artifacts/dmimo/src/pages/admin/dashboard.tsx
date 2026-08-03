import React from "react";
import { Link } from "wouter";
import { useListProjects, useListBlogs, useListInquiries } from "@workspace/api-client-react";
import { ImageIcon, PenTool, MessageSquare, ArrowRight } from "lucide-react";
import AdminLayout from "./layout";

export default function AdminDashboard() {
  const { data: projects } = useListProjects();
  const { data: blogs } = useListBlogs();
  const { data: inquiries } = useListInquiries();

  const publishedProjects = projects?.filter(p => p.status === "published")?.length || 0;
  const newInquiries = inquiries?.filter(i => i.status === "new")?.length || 0;

  const stats = [
    { label: "Total Projects", value: projects?.length || 0, icon: ImageIcon, link: "/admin/projects" },
    { label: "Published Projects", value: publishedProjects, icon: ImageIcon, link: "/admin/projects" },
    { label: "Total Articles", value: blogs?.length || 0, icon: PenTool, link: "/admin/blog" },
    { label: "New Inquiries", value: newInquiries, icon: MessageSquare, link: "/admin/inquiries", highlight: newInquiries > 0 }
  ];

  const recentInquiries = inquiries?.slice(0, 5) || [];

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-light mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-sm tracking-wide">Overview of your studio's digital presence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.link}>
            <div className={`bg-[#111111] border ${stat.highlight ? 'border-primary' : 'border-border/30'} p-6 cursor-pointer hover:bg-white/5 transition-colors group relative overflow-hidden`}>
              {stat.highlight && <div className="absolute top-0 left-0 w-full h-1 bg-primary" />}
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.highlight ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-3xl font-light mb-1">{stat.value}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-[#111111] border border-border/30 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-light tracking-wide">Recent Inquiries</h2>
              <Link href="/admin/inquiries" className="text-xs text-primary uppercase tracking-widest hover:underline">View All</Link>
            </div>
            
            <div className="space-y-4">
              {recentInquiries.length > 0 ? recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex justify-between items-center pb-4 border-b border-border/20 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-sm mb-1">{inquiry.name}</p>
                    <p className="text-xs text-muted-foreground">{inquiry.subject || inquiry.projectType || 'General Inquiry'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[0.65rem] uppercase tracking-widest px-2 py-1 ${
                      inquiry.status === 'new' ? 'bg-primary/20 text-primary border border-primary/30' : 
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {inquiry.status}
                    </span>
                    <p className="text-[0.65rem] text-muted-foreground mt-2">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground font-light py-4">No recent inquiries found.</p>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-[#111111] border border-border/30 p-6">
            <h2 className="text-lg font-light tracking-wide mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/admin/projects" className="block w-full text-left px-4 py-3 bg-secondary/50 text-sm tracking-wide hover:bg-primary hover:text-primary-foreground transition-colors border border-border/30">
                + Add New Project
              </Link>
              <Link href="/admin/blog" className="block w-full text-left px-4 py-3 bg-secondary/50 text-sm tracking-wide hover:bg-primary hover:text-primary-foreground transition-colors border border-border/30">
                + Write Journal Entry
              </Link>
              <Link href="/admin/team" className="block w-full text-left px-4 py-3 bg-secondary/50 text-sm tracking-wide hover:bg-primary hover:text-primary-foreground transition-colors border border-border/30">
                + Add Team Member
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
