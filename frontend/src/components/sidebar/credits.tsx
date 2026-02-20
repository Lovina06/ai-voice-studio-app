"use client";

import { useEffect, useState, useCallback } from "react";
import { Coins, Sparkles, Loader2 } from "lucide-react";
import { getUserCredits } from "~/actions/tts";
import { cn } from "~/lib/utils";

export default function Credits() {
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCredits = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getUserCredits();
      if (result.success) {
        setCredits(result.credits);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return (
    <div 
      onClick={fetchCredits} 
      className="group flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 hover:bg-muted/50 transition-all active:scale-95"
    >
      <div className="flex items-center gap-1.5">
        <div className="relative">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
          ) : (
            <>
              <Coins className="h-4 w-4 text-yellow-500 transition-colors duration-200 group-hover:text-yellow-400" />
              <Sparkles className="absolute -top-1 -right-1 h-2 w-2 text-yellow-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </>
          )}
        </div>
        <div className="flex flex-col">
          <span className={cn(
            "text-foreground text-sm font-bold transition-colors duration-200 group-hover:text-yellow-600",
            isLoading && "opacity-50"
          )}>
            {credits}
          </span>
          <span className="text-muted-foreground text-xs leading-tight">
            Credits
          </span>
        </div>
      </div>
    </div>
  );
}