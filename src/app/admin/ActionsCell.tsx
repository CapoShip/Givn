"use client";

import { Check, X } from "lucide-react";
import { useTransition } from "react";
import { updateBrandTier } from "@/app/actions";

export function ActionsCell({ brandId }: { brandId: string }) {
  const [isPending, startTransition] = useTransition();

  const approve = () => {
    startTransition(async () => {
      await updateBrandTier(brandId, "VERIFIED");
    });
  };

  const reject = () => {
    startTransition(async () => {
      await updateBrandTier(brandId, "REJECTED");
    });
  };

  return (
    <div className="flex justify-end gap-2">
      <button
        disabled={isPending}
        onClick={approve}
        className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded border border-emerald-500/30"
      >
        <Check size={16} />
      </button>

      <button
        disabled={isPending}
        onClick={reject}
        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded border border-red-500/30"
      >
        <X size={16} />
      </button>
    </div>
  );
}
