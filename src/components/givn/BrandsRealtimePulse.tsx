"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { getGlobalActivity } from "@/app/actions/getGlobalActivity";
import type { GlobalActivityEvent } from "@/lib/types/givn";
import { CheckCircle2, Activity, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function BrandsRealtimePulse() {
  const [activities, setActivities] = useState<GlobalActivityEvent[]>([]);
  const [isLive, setIsLive] = useState(false);

  // 1. Chargement initial (Server Action)
  useEffect(() => {
    getGlobalActivity().then((data) => {
      setActivities(data);
      setIsLive(true);
    });
  }, []);

  // 2. Abonnement Realtime (Supabase)
  useEffect(() => {
    const supabase = supabaseBrowser();
    
    const channel = supabase
      .channel("global-trust-pulse")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "proofs",
          filter: "status=eq.verified",
        },
        async (payload) => {
          const freshData = await getGlobalActivity();
          if (freshData.length > 0) {
            const newEvent = freshData[0];
            setActivities((prev) => {
              if (prev.find(p => p.id === newEvent.id)) return prev;
              return [newEvent, ...prev].slice(0, 5);
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (activities.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mb-16 animate-enter">
      {/* Header du Terminal */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-[6px] opacity-40 animate-pulse" />
            <Activity size={16} className="text-emerald-400 relative z-10" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Global Trust Pulse
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${isLive ? '' : 'hidden'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-emerald-500' : 'bg-zinc-600'}`}></span>
          </span>
          <span className="text-[10px] font-mono text-zinc-600">
            {isLive ? "LIVE FEED" : "CONNECTING..."}
          </span>
        </div>
      </div>

      {/* Liste des Events (Glassmorphism) */}
      <div className="flex flex-col gap-2">
        {activities.map((event, index) => (
          <div
            key={event.id}
            className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-sm"
            style={{
              animation: index === 0 && isLive ? 'pop-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
            }}
          >
            <div className="flex items-center justify-between p-4">
              {/* Left: Brand info */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
                  {event.brandLogo ? (
                    <img src={event.brandLogo} alt={event.brandName} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-zinc-500">{event.brandName.substring(0, 2)}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                      {event.brandName}
                    </span>
                    <CheckCircle2 size={12} className="text-emerald-500" />
                  </div>
                  <div className="text-xs text-zinc-500 flex items-center gap-1">
                    <span>Verified donation</span>
                    <span className="text-zinc-700">•</span>
                    <span className="text-zinc-400">{timeAgo(event.occurredAt)}</span>
                  </div>
                </div>
              </div>

              {/* Right: Amount & Link */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400 text-sm shadow-emerald-glow">
                    {/* 🔥 CORRECTION ICI : fallback (?? 0) pour rassurer TypeScript */}
                    +{new Intl.NumberFormat('en-US', { style: 'currency', currency: event.currency || 'USD' }).format(event.amount ?? 0)}
                  </div>
                  <div className="text-[10px] text-zinc-600 font-mono uppercase">
                    On-chain proof
                  </div>
                </div>
                
                <Link 
                  href={`/brand/${event.brandSlug}`}
                  className="h-8 w-8 rounded-full bg-white/5 hover:bg-emerald-500/20 flex items-center justify-center transition-colors group/btn"
                >
                  <ArrowUpRight size={14} className="text-zinc-400 group-hover/btn:text-emerald-400 transition-colors" />
                </Link>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
}