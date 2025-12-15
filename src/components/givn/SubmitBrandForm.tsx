"use client";

import { useState } from "react";
import { z } from "zod";
import { Globe, Building2, AlertCircle, Loader2, Check } from "lucide-react";

// Schéma de validation Zod
const brandSchema = z.object({
  name: z.string().min(2, "Brand name is too short"),
  website: z.string().url("Must be a valid URL (https://...)"),
  sector: z.enum(['Tech', 'Fashion', 'Finance', 'Food', 'Energy', 'Other']),
  contact: z.string().email("Valid email required for verification"),
});

export default function SubmitBrandForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    sector: "Tech" as const,
    contact: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validation Zod
    const result = brandSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(formattedErrors);
      setIsSubmitting(false);
      return;
    }

    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {/* Brand Name */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1 flex justify-between">
            Brand Name
            {errors.name && <span className="text-red-400 flex items-center gap-1"><AlertCircle size={10} /> {errors.name}</span>}
        </label>
        <div className="relative group">
            <Building2 size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-red-400' : 'text-zinc-500 group-focus-within:text-emerald-400'}`} />
            <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Patagonia" 
                className={`w-full bg-white/5 border p-4 pl-12 rounded-xl text-white focus:outline-none focus:bg-black transition-all placeholder:text-zinc-700 ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-emerald-500/50'}`} 
            />
        </div>
      </div>

      {/* Website */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1 flex justify-between">
            Official Website
            {errors.website && <span className="text-red-400 flex items-center gap-1"><AlertCircle size={10} /> {errors.website}</span>}
        </label>
        <div className="relative group">
            <Globe size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.website ? 'text-red-400' : 'text-zinc-500 group-focus-within:text-emerald-400'}`} />
            <input 
                type="text" 
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                placeholder="Ex: https://patagonia.com" 
                className={`w-full bg-white/5 border p-4 pl-12 rounded-xl text-white focus:outline-none focus:bg-black transition-all placeholder:text-zinc-700 ${errors.website ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-emerald-500/50'}`} 
            />
        </div>
      </div>

      {/* Sector Selection */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Sector</label>
        <div className="flex gap-2 flex-wrap">
            {['Tech', 'Fashion', 'Finance', 'Food', 'Energy', 'Other'].map((sector) => (
                <button 
                    key={sector}
                    type="button" 
                    onClick={() => setFormData({...formData, sector: sector as any})}
                    className={`text-xs border px-3 py-2 rounded-lg transition-all ${
                        formData.sector === sector 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                        : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-emerald-500/10'
                    }`}
                >
                    {sector}
                </button>
            ))}
        </div>
      </div>

      {/* Contact Email */}
      <div className="space-y-1.5 pt-2">
        <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Verifier Contact Email</label>
        <input 
            type="email" 
            value={formData.contact}
            onChange={(e) => setFormData({...formData, contact: e.target.value})}
            placeholder="audit@company.com" 
            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/30 placeholder:text-zinc-700" 
        />
        {errors.contact && <p className="text-red-400 text-[10px] ml-1">{errors.contact}</p>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4 rounded-xl font-bold mt-4 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
        {isSubmitting ? 'Verifying...' : 'Submit for Audit'}
      </button>
    </form>
  );
}