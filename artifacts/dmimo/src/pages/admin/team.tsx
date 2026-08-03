import React, { useState } from "react";
import { 
  useListTeamMembers, 
  useCreateTeamMember, 
  useUpdateTeamMember, 
  useDeleteTeamMember,
  getListTeamMembersQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Edit2, Trash2, Plus, X, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "./layout";

export default function AdminTeam() {
  const { data: team, isLoading } = useListTeamMembers();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const createMutation = useCreateTeamMember();
  const updateMutation = useUpdateTeamMember();
  const deleteMutation = useDeleteTeamMember();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "", role: "", bio: "", photo: "", 
    email: "", linkedin: "", instagram: "", sortOrder: 0
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: "", role: "", bio: "", photo: "", 
      email: "", linkedin: "", instagram: "", sortOrder: 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: any) => {
    setEditingId(member.id);
    setFormData({
      name: member.name || "",
      role: member.role || "",
      bio: member.bio || "",
      photo: member.photo || "",
      email: member.email || "",
      linkedin: member.linkedin || "",
      instagram: member.instagram || "",
      sortOrder: member.sortOrder || 0
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Team member deleted" });
          queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
        }
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, sortOrder: Number(formData.sortOrder) };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          toast({ title: "Team member updated" });
          setIsModalOpen(false);
          queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
        }
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "Team member added" });
          setIsModalOpen(false);
          queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-light mb-2">Team</h1>
          <p className="text-muted-foreground text-sm tracking-wide">Manage architects and studio staff.</p>
        </div>
        <Button onClick={openAddModal} className="bg-primary text-primary-foreground rounded-none uppercase tracking-widest text-xs">
          <Plus className="w-4 h-4 mr-2" /> Add Member
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-muted-foreground">Loading team...</div>
        ) : team?.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground">No team members found.</div>
        ) : (
          team?.map((member) => (
            <div key={member.id} className="bg-[#111111] border border-border/30 overflow-hidden group">
              <div className="aspect-[4/3] bg-secondary/30 relative border-b border-border/30">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(member)} className="bg-background/80 backdrop-blur-sm border border-border p-2 hover:bg-white hover:text-black transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(member.id)} className="bg-background/80 backdrop-blur-sm border border-border p-2 hover:bg-destructive hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1">{member.name}</h3>
                <p className="text-xs uppercase tracking-widest text-primary mb-3">{member.role}</p>
                <div className="flex gap-4 text-xs text-muted-foreground mt-4 pt-4 border-t border-border/30">
                  <span title="Sort Order">Order: {member.sortOrder || 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-border/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="sticky top-0 bg-[#111111] z-10 flex justify-between items-center p-6 border-b border-border/30">
              <h2 className="text-xl font-light">{editingId ? 'Edit Team Member' : 'Add Team Member'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Name *</label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Role *</label>
                  <Input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="bg-background rounded-none border-border/50" placeholder="e.g. Principal Architect" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Photo URL</label>
                  <Input value={formData.photo} onChange={e => setFormData({...formData, photo: e.target.value})} className="bg-background rounded-none border-border/50" placeholder="https://..." />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Bio</label>
                <Textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="bg-background rounded-none border-border/50 h-24 resize-none" />
              </div>

              <div className="grid md:grid-cols-2 gap-6 p-4 border border-border/30 bg-secondary/20">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                  <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">LinkedIn URL</label>
                  <Input value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Instagram URL</label>
                  <Input value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Sort Order</label>
                  <Input type="number" value={formData.sortOrder} onChange={e => setFormData({...formData, sortOrder: Number(e.target.value)})} className="bg-background rounded-none border-border/50" />
                </div>
              </div>

              <div className="pt-6 border-t border-border/30 flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-none uppercase tracking-widest text-xs">Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-primary text-primary-foreground rounded-none uppercase tracking-widest text-xs">
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Member'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
