import React, { useState } from "react";
import { 
  useListProjects, 
  useCreateProject, 
  useUpdateProject, 
  useDeleteProject,
  getListProjectsQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Edit2, Trash2, Plus, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "./layout";

export default function AdminProjects() {
  const { data: projects, isLoading } = useListProjects();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: "", slug: "", category: "", location: "", year: "", area: "", client: "",
    status: "draft" as any, featured: false, shortDescription: "", description: "",
    challenge: "", solution: "", coverImage: "", tags: ""
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: "", slug: "", category: "", location: "", year: "", area: "", client: "",
      status: "draft", featured: false, shortDescription: "", description: "",
      challenge: "", solution: "", coverImage: "", tags: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: any) => {
    setEditingId(project.id);
    setFormData({
      title: project.title || "",
      slug: project.slug || "",
      category: project.category || "",
      location: project.location || "",
      year: project.year || "",
      area: project.area || "",
      client: project.client || "",
      status: project.status || "draft",
      featured: project.featured || false,
      shortDescription: project.shortDescription || "",
      description: project.description || "",
      challenge: project.challenge || "",
      solution: project.solution || "",
      coverImage: project.coverImage || "",
      tags: project.tags?.join(", ") || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate({ id: String(id) }, {
        onSuccess: () => {
          toast({ title: "Project deleted" });
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        }
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : []
    };

    if (editingId) {
      updateMutation.mutate({ id: String(editingId), data: payload }, {
        onSuccess: () => {
          toast({ title: "Project updated" });
          setIsModalOpen(false);
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        }
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "Project created" });
          setIsModalOpen(false);
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-light mb-2">Projects</h1>
          <p className="text-muted-foreground text-sm tracking-wide">Manage portfolio items.</p>
        </div>
        <Button onClick={openAddModal} className="bg-primary text-primary-foreground rounded-none uppercase tracking-widest text-xs">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      <div className="bg-[#111111] border border-border/30 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase tracking-widest text-muted-foreground bg-secondary/50 border-b border-border/30">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Featured</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading projects...</td></tr>
            ) : projects?.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No projects found.</td></tr>
            ) : (
              projects?.map((project) => (
                <tr key={project.id} className="border-b border-border/20 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    {project.coverImage ? (
                      <img src={project.coverImage} className="w-10 h-10 object-cover border border-border/50" alt="" />
                    ) : (
                      <div className="w-10 h-10 bg-secondary flex items-center justify-center border border-border/50">
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    {project.title}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{project.category}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[0.65rem] uppercase tracking-widest px-2 py-1 ${
                      project.status === 'published' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{project.featured ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openEditModal(project)} className="text-muted-foreground hover:text-white p-2">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="text-muted-foreground hover:text-destructive p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-border/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="sticky top-0 bg-[#111111] z-10 flex justify-between items-center p-6 border-b border-border/30">
              <h2 className="text-xl font-light">{editingId ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Title *</label>
                  <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Slug</label>
                  <Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="bg-background rounded-none border-border/50" placeholder="auto-generated-if-empty" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Category *</label>
                  <Input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-background rounded-none border-border/50" placeholder="e.g. Residential" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Cover Image URL</label>
                  <Input value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} className="bg-background rounded-none border-border/50" placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Location</label>
                  <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Year</label>
                  <Input value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Client</label>
                  <Input value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Area</label>
                  <Input value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 p-4 border border-border/30 bg-secondary/20">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full bg-background border border-border/50 p-2 text-sm focus:outline-none focus:border-primary">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="space-y-2 flex items-center pt-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4 bg-background border-border accent-primary" />
                    <span className="text-sm font-medium">Featured Project</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Short Description</label>
                <Textarea value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} className="bg-background rounded-none border-border/50 resize-none h-20" />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Full Description (HTML)</label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-background rounded-none border-border/50 font-mono text-sm h-40" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">The Challenge</label>
                  <Textarea value={formData.challenge} onChange={e => setFormData({...formData, challenge: e.target.value})} className="bg-background rounded-none border-border/50 h-32" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">The Solution</label>
                  <Textarea value={formData.solution} onChange={e => setFormData({...formData, solution: e.target.value})} className="bg-background rounded-none border-border/50 h-32" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Tags (comma separated)</label>
                <Input value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="bg-background rounded-none border-border/50" placeholder="minimalist, concrete, award-winning" />
              </div>

              <div className="pt-6 border-t border-border/30 flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-none uppercase tracking-widest text-xs">Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-primary text-primary-foreground rounded-none uppercase tracking-widest text-xs">
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Project'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
