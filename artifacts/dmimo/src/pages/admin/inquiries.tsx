import React, { useState } from "react";
import { 
  useListInquiries, 
  useUpdateInquiry, 
  useDeleteInquiry,
  getListInquiriesQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, ChevronDown, ChevronUp, Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "./layout";

export default function AdminInquiries() {
  const { data: inquiries, isLoading } = useListInquiries();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const updateMutation = useUpdateInquiry();
  const deleteMutation = useDeleteInquiry();

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Inquiry deleted" });
          queryClient.invalidateQueries({ queryKey: getListInquiriesQueryKey() });
        }
      });
    }
  };

  const handleStatusChange = (id: number, status: any) => {
    updateMutation.mutate({ id, data: { status } }, {
      onSuccess: () => {
        toast({ title: "Status updated" });
        queryClient.invalidateQueries({ queryKey: getListInquiriesQueryKey() });
      }
    });
  };

  const toggleExpand = (id: number, status: string) => {
    setExpandedId(expandedId === id ? null : id);
    if (status === 'new' && expandedId !== id) {
      handleStatusChange(id, 'read');
    }
  };

  const statusColors = {
    new: 'bg-primary/20 text-primary border-primary/30',
    read: 'bg-secondary text-muted-foreground border-border',
    replied: 'bg-green-500/20 text-green-400 border-green-500/30',
    archived: 'bg-[#050505] text-muted-foreground border-border/30'
  };

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-light mb-2">Inquiries</h1>
        <p className="text-muted-foreground text-sm tracking-wide">Client messages and project requests.</p>
      </div>

      <div className="bg-[#111111] border border-border/30">
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground">Loading inquiries...</div>
        ) : inquiries?.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No inquiries found.</div>
        ) : (
          <div className="divide-y divide-border/20">
            {inquiries?.map((inquiry) => (
              <div key={inquiry.id} className={`transition-colors ${inquiry.status === 'new' ? 'bg-primary/5' : 'hover:bg-white/5'}`}>
                {/* Header Row */}
                <div 
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 cursor-pointer"
                  onClick={() => toggleExpand(inquiry.id, inquiry.status)}
                >
                  <div className="flex-1 grid md:grid-cols-4 gap-4 items-center mb-4 md:mb-0">
                    <div className="font-medium">{inquiry.name}</div>
                    <div className="text-muted-foreground text-sm truncate">{inquiry.subject || inquiry.projectType || 'General Inquiry'}</div>
                    <div className="text-muted-foreground text-sm">{new Date(inquiry.createdAt).toLocaleDateString()}</div>
                    <div>
                      <span className={`text-[0.65rem] uppercase tracking-widest px-2 py-1 border ${statusColors[inquiry.status as keyof typeof statusColors]}`}>
                        {inquiry.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(inquiry.id); }}
                      className="hover:text-destructive p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {expandedId === inquiry.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === inquiry.id && (
                  <div className="p-6 pt-0 border-t border-border/10 bg-background/50">
                    <div className="grid md:grid-cols-[1fr_300px] gap-8 mt-6">
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Message</h4>
                        <div className="bg-[#111111] p-6 border border-border/30 text-sm font-light leading-relaxed whitespace-pre-wrap text-muted-foreground">
                          {inquiry.message}
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Contact Details</h4>
                          <div className="space-y-3 text-sm font-light">
                            <div className="flex items-center gap-3">
                              <Mail className="w-4 h-4 text-primary" />
                              <a href={`mailto:${inquiry.email}`} className="hover:text-primary transition-colors">{inquiry.email}</a>
                            </div>
                            {inquiry.phone && (
                              <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-primary" />
                                <a href={`tel:${inquiry.phone}`} className="hover:text-primary transition-colors">{inquiry.phone}</a>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Project Type</h4>
                          <div className="text-sm font-light flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="capitalize">{inquiry.projectType || 'Not specified'}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Update Status</h4>
                          <select 
                            value={inquiry.status} 
                            onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                            className="w-full bg-[#111111] border border-border/50 p-2 text-sm focus:outline-none focus:border-primary text-muted-foreground"
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
