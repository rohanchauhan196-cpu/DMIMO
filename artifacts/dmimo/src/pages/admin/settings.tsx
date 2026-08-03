import React, { useEffect, useState } from "react";
import { 
  useGetSettings, 
  useUpdateSettings,
  getGetSettingsQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "./layout";

export default function AdminSettings() {
  const { data: settings, isLoading } = useGetSettings();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const updateMutation = useUpdateSettings();

  const [formData, setFormData] = useState({
    siteName: "", tagline: "", logoUrl: "", faviconUrl: "",
    email: "", phone: "", address: "", 
    instagram: "", linkedin: "", twitter: "", facebook: "",
    metaTitle: "", metaDescription: ""
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || "",
        tagline: settings.tagline || "",
        logoUrl: settings.logoUrl || "",
        faviconUrl: settings.faviconUrl || "",
        email: settings.email || "",
        phone: settings.phone || "",
        address: settings.address || "",
        instagram: settings.instagram || "",
        linkedin: settings.linkedin || "",
        twitter: settings.twitter || "",
        facebook: settings.facebook || "",
        metaTitle: settings.metaTitle || "",
        metaDescription: settings.metaDescription || ""
      });
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Settings updated successfully" });
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
      }
    });
  };

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-light mb-2">Global Settings</h1>
        <p className="text-muted-foreground text-sm tracking-wide">Manage site-wide configurations and contact details.</p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">Loading settings...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Identity */}
          <div className="bg-[#111111] border border-border/30 p-8">
            <h2 className="text-lg font-light tracking-wide mb-6 border-b border-border/30 pb-4">Brand Identity</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Site Name</label>
                  <Input value={formData.siteName} onChange={e => setFormData({...formData, siteName: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Tagline</label>
                  <Input value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Logo URL</label>
                  <Input value={formData.logoUrl} onChange={e => setFormData({...formData, logoUrl: e.target.value})} className="bg-background rounded-none border-border/50" />
                  {formData.logoUrl && (
                    <div className="mt-4 p-4 bg-background border border-border/50 flex items-center justify-center h-20">
                      <img src={formData.logoUrl} alt="Logo Preview" className="max-h-12 max-w-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-[#111111] border border-border/30 p-8">
            <h2 className="text-lg font-light tracking-wide mb-6 border-b border-border/30 pb-4">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Primary Email</label>
                  <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Phone Number</label>
                  <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Studio Address</label>
                  <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="bg-[#111111] border border-border/30 p-8">
            <h2 className="text-lg font-light tracking-wide mb-6 border-b border-border/30 pb-4">Social Links</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Instagram URL</label>
                  <Input value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">LinkedIn URL</label>
                  <Input value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Twitter URL</label>
                  <Input value={formData.twitter} onChange={e => setFormData({...formData, twitter: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Facebook URL</label>
                  <Input value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-[#111111] border border-border/30 p-8">
            <h2 className="text-lg font-light tracking-wide mb-6 border-b border-border/30 pb-4">SEO Defaults</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Default Meta Title</label>
                  <Input value={formData.metaTitle} onChange={e => setFormData({...formData, metaTitle: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Default Meta Description</label>
                  <Input value={formData.metaDescription} onChange={e => setFormData({...formData, metaDescription: e.target.value})} className="bg-background rounded-none border-border/50" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end sticky bottom-6 z-10 p-4 bg-[#111111]/80 backdrop-blur-md border border-border/30">
            <Button type="submit" disabled={updateMutation.isPending} className="bg-primary text-primary-foreground rounded-none uppercase tracking-widest text-xs px-8">
              {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
