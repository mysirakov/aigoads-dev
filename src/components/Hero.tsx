"use client";

import { Plus, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Hero() {
  const router = useRouter();
  
const handleCreateAd = async () => {
try {
const response = await fetch("https://n8n.aigoconsult.com/webhook-test/9e4d7405-ea46-497e-95f4-c5b39f30d461", {
method: "GET",
});

if (response.ok) {
const data = await response.json();
console.log("n8n workflow started:", data);

// Save the resume URL if n8n returned one
const resumeUrl = data.resumeUrl || data.resume_url || data.data?.resumeUrl || data.data?.resume_url;
if (resumeUrl) {
sessionStorage.setItem("n8n_resume_url", resumeUrl);
console.log("Saved resume URL:", resumeUrl);
}
}
} catch (error) {
console.error("Failed to trigger n8n workflow:", error);
}
router.push("/create");
};

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-zinc-900 to-black p-12">
      <div className="relative z-10 flex max-w-2xl flex-col gap-6">
        <div className="flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-pulse" />
          AI Motion Engine v2.0 Live
        </div>
        
        <h1 className="text-5xl font-bold tracking-tight text-white lg:text-6xl">
          Create High-Converting Ads in Seconds
        </h1>
        
        <p className="text-lg text-zinc-400">
          Generate UGC-style videos from product images instantly.<br />
          No editing skills required.
        </p>

        <div className="flex items-center gap-4 pt-4">
          <Button 
            className="h-14 rounded-2xl px-8 text-base font-semibold bg-white text-black hover:bg-zinc-200"
            onClick={handleCreateAd}
          >
            <Plus className="mr-2 h-5 w-5" />
            New Ad
          </Button>
          <Button 
            variant="outline"
            className="h-14 rounded-2xl border border-white/10 bg-white/5 px-8 text-base font-semibold text-white hover:bg-white/10"
            onClick={() => router.push("/tutorials")}
          >
            View Tutorials
          </Button>
        </div>
      </div>

      {/* Preview Element */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="relative h-[300px] w-[240px] rounded-3xl border border-white/10 bg-zinc-900/50 p-4 shadow-2xl backdrop-blur-sm">
          <div className="flex h-full w-full items-center justify-center rounded-2xl border border-white/5 bg-black/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
              <Play className="ml-1 h-6 w-6 fill-current" />
            </div>
          </div>
          <div className="absolute -right-4 -top-4 rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-[10px] font-medium text-zinc-400">
            Generating...
          </div>
          <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-[10px] font-medium text-zinc-400">
            9:16 Ratio
          </div>
        </div>
      </div>
      
      {/* Decorative background effects */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-[100px]" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-[100px]" />
    </div>
  );
}
