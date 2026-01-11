"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  Share2,
  Trash2,
  Play,
  Loader2,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const generationId = searchParams.get("id");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [generationData, setGenerationData] = useState<any>(null);
  const [loadingMessage, setLoadingMessage] = useState("Initializing...");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const mountedRef = useRef(true);

  // 1. Fetch initial state and set up realtime listener
  useEffect(() => {
    if (!generationId) {
      setStatus("error");
      setErrorDetails("No generation ID provided.");
      return;
    }

    const fetchInitialState = async () => {
      const { data, error } = await supabase
        .from("generations")
        .select("*")
        .eq("id", generationId)
        .single();

      if (error) {
        console.error("Error fetching generation:", error);
        setStatus("error");
        setErrorDetails("Could not find this generation.");
        return;
      }

      setGenerationData(data);
      if (data.status === "completed" && data.video_url) {
        setVideoUrl(data.video_url);
        setStatus("success");
        setProgress(100);
      } else if (data.status === "failed") {
        setStatus("error");
        setErrorDetails(data.error_message || "Generation failed.");
      }
    };

    fetchInitialState();

    // Set up Realtime listener
    const channel = supabase
      .channel(`generation-${generationId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'generations',
          filter: `id=eq.${generationId}`
        },
        (payload) => {
          console.log('Realtime update:', payload);
          const newData = payload.new;
          setGenerationData(newData);
          
          if (newData.status === "completed" && newData.video_url) {
            setVideoUrl(newData.video_url);
            setStatus("success");
            setProgress(100);
          } else if (newData.status === "failed") {
            setStatus("error");
            setErrorDetails(newData.error_message || "Generation failed.");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [generationId]);

  // 2. Artificial progress and time counter
  useEffect(() => {
    if (status !== "loading") return;

    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);

      setProgress((prev) => {
        if (prev < 30) return prev + 0.3;
        if (prev < 60) return prev + 0.1;
        if (prev < 90) return prev + 0.05;
        if (prev < 98) return prev + 0.01;
        return prev;
      });

      const artificialMessages = [
        "Analyzing your product...",
        "Crafting the perfect script...",
        "Generating AI visuals...",
        "Synthesizing voiceover...",
        "Adding music and sound effects...",
        "Fine-tuning audio sync...",
        "Polishing visual transitions...",
        "Enhancing color grading...",
        "Optimizing for 4K output...",
        "Encoding high-quality stream...",
        "Finalizing your masterpiece..."
      ];

      setProgress((currentProgress) => {
        const msgIndex = Math.min(
          Math.floor((currentProgress / 100) * artificialMessages.length),
          artificialMessages.length - 1
        );
        setLoadingMessage(artificialMessages[msgIndex]);
        return currentProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: videoUrl } }, "*");
  };

  const handleNewProject = () => {
    window.location.href = "/create";
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-64px)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Badge variant="outline" className={status === "success" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"}>
                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${status === "success" ? "bg-green-400" : "bg-indigo-400 animate-pulse"}`} />
                {status === "loading" ? "Generation in Progress" : status === "success" ? "Generation Complete" : "Generation Failed"}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {status === "loading" ? "Crafting your" : "Here are your"} <span className="italic font-serif text-zinc-400">results</span>
            </h1>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="h-10 rounded-xl border-white/10 bg-white/5 hover:bg-white/10" onClick={() => window.location.href = "/"}>
              <Clock className="mr-2 h-4 w-4" />
              History
            </Button>
            <Button
              className="h-10 rounded-xl bg-white text-black hover:bg-zinc-200"
              onClick={handleNewProject}>
              <Sparkles className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        {status === "loading" ? (
          <div className="flex flex-col items-center justify-center flex-1 py-10">
            <Card className="w-full max-w-2xl border-white/5 bg-zinc-900/50 p-12 backdrop-blur-xl text-center">
              <div className="relative mb-10 mx-auto w-32 h-32">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10" />
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-indigo-400 animate-pulse" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">{loadingMessage}</h2>
              <p className="text-zinc-500 mb-8">This process typically takes between 2 and 4 minutes</p>
              
              <div className="space-y-4 max-w-md mx-auto">
                <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  <span>Progress</span>
                  <span>{Math.floor(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/5" />
                <div className="flex justify-center items-center gap-2 text-sm text-zinc-400">
                  <Clock className="h-4 w-4" />
                  <span>Time Elapsed: {formatTime(timeElapsed)}</span>
                </div>
              </div>
            </Card>
          </div>
        ) : status === "error" ? (
          <div className="flex flex-col items-center justify-center flex-1 py-10">
            <Card className="w-full max-w-md border-white/5 bg-zinc-900/50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <Trash2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
              <p className="text-zinc-500 mb-6">
                {errorDetails || "We couldn't generate your video. Please try again or check your connection."}
              </p>
              <Button onClick={handleNewProject} className="w-full bg-white text-black hover:bg-zinc-200">
                Back to Create
              </Button>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
            <div className="lg:col-span-9 h-full">
              <Card className="overflow-hidden border-white/10 bg-zinc-900/50 backdrop-blur-xl h-full flex flex-col">
                <div className="relative flex-1 bg-black group min-h-[500px]">
                  {videoUrl ? (
                    <video
                      src={videoUrl}
                      className="absolute inset-0 w-full h-full object-contain"
                      controls
                      autoPlay
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-12 w-12 animate-spin text-zinc-700" />
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/60 backdrop-blur-md text-white border-white/10 px-3 py-1">
                      Final Output
                    </Badge>
                  </div>
                  
                  <button className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-4 flex gap-4 overflow-x-auto border-t border-white/5 bg-black/20">
                  <div className="relative shrink-0 w-32 rounded-lg border-2 border-indigo-500 overflow-hidden aspect-video bg-black/40">
                    <div className="absolute inset-0 flex items-center justify-center bg-indigo-500/10">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute top-1 left-1 px-1 py-0.5 rounded bg-indigo-500 text-[8px] font-bold uppercase tracking-tighter">Main Video</div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <Card className="border-white/10 bg-zinc-900/50 p-5 backdrop-blur-xl">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                  <ChevronRight className="h-3 w-3" />
                  Actions
                </h3>
                
                <div className="space-y-3">
                  <Button
                    className="w-full h-12 rounded-xl bg-white text-black font-bold text-sm shadow-lg hover:bg-zinc-200 transition-all active:scale-[0.98]"
                    onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="h-10 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs">
                      <Share2 className="mr-2 h-3 w-3" />
                      Share
                    </Button>
                    <Button variant="outline" className="h-10 rounded-xl border-white/10 bg-red-500/5 hover:bg-red-500/10 text-red-400 border-red-500/10 text-xs">
                      <Trash2 className="mr-2 h-3 w-3" />
                      Discard
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="border-white/10 bg-zinc-900/50 p-5 backdrop-blur-xl">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                  <Sparkles className="h-3 w-3" />
                  Details
                </h3>
                
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <p className="text-[9px] font-bold text-zinc-600 mb-1 uppercase tracking-wider">Prompt</p>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-4">
                      {generationData?.prompt || "No prompt details available."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-center">
                      <p className="text-[8px] font-bold text-zinc-600 mb-0.5 uppercase tracking-wider">Ratio</p>
                      <p className="text-[10px] text-zinc-400">{generationData?.aspect_ratio || "Auto"}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-center">
                      <p className="text-[8px] font-bold text-zinc-600 mb-0.5 uppercase tracking-wider">Length</p>
                      <p className="text-[10px] text-zinc-400">{generationData?.length || "Auto"}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="pt-2">
                 <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Secure Cloud Processing
                  </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
