"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export function BrandsRealtimePulse() {
  const router = useRouter();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const supabase = supabaseBrowser();

    const channel = supabase
      .channel("givn-proofs-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "proofs" },
        () => {
          // Pulse + refresh server components
          setPulse(true);
          router.refresh();
          window.setTimeout(() => setPulse(false), 550);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  if (!pulse) return null;

  return (
    <div className="mb-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-sm text-cyan-100
                    shadow-[0_0_40px_rgba(34,211,238,0.14)]">
      Proof event detected. Updating living scores…
    </div>
  );
}
