"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validation";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full border-0 border-b border-charcoal-3 bg-transparent py-3 text-ivory placeholder:text-warm-grey/50 focus:border-gold focus:outline-none transition-colors";
const labelClass = "mb-2 block text-xs uppercase tracking-[0.2em] text-warm-grey";

const PROJECT_TYPES = ["Residential", "Commercial", "Hospitality", "Interiors", "Urban Planning", "Other"];
const BUDGET_RANGES = ["Under ₹50 Lakh", "₹50 Lakh – 2 Crore", "₹2 – 10 Crore", "₹10 Crore+", "Not sure yet"];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-4 border border-gold/40 p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Check className="h-6 w-6" strokeWidth={1.5} />
        </span>
        <h3 className="font-display text-2xl text-ivory">Thank you.</h3>
        <p className="text-warm-grey">
          Your message has been received. A member of our team will respond
          within two working days.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-gold underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">Name *</label>
          <input id="name" className={inputClass} {...register("name")} />
          {errors.name && <p className="mt-2 text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="email">Email *</label>
          <input id="email" type="email" className={inputClass} {...register("email")} />
          {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">Phone</label>
          <input id="phone" className={inputClass} {...register("phone")} />
        </div>
        <div>
          <label className={labelClass} htmlFor="company">Company</label>
          <input id="company" className={inputClass} {...register("company")} />
        </div>
        <div>
          <label className={labelClass} htmlFor="projectType">Project Type</label>
          <select id="projectType" className={cn(inputClass, "appearance-none")} {...register("projectType")}>
            <option value="">Select one</option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="location">Project Location</label>
          <input id="location" className={inputClass} {...register("location")} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="budgetRange">Budget Range</label>
          <select id="budgetRange" className={cn(inputClass, "appearance-none")} {...register("budgetRange")}>
            <option value="">Select a range</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="message">Tell us about your project *</label>
        <textarea id="message" rows={5} className={inputClass} {...register("message")} />
        {errors.message && <p className="mt-2 text-xs text-red-400">{errors.message.message}</p>}
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">Something went wrong. Please try again, or email us directly.</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group relative inline-flex items-center gap-3 overflow-hidden border border-gold/60 px-8 py-4 text-xs font-medium uppercase tracking-[0.25em] text-ivory transition-colors hover:text-charcoal-1 disabled:opacity-60"
      >
        <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-out group-hover:scale-x-100" />
        {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />}
        Send Message
      </button>
    </form>
  );
}
