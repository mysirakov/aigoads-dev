"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { 
  Upload, 
  Sparkles, 
  Zap, 
  Monitor, 
  Smartphone, 
  Mic2,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export default function CreateAdPage() {
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [length, setLength] = useState([10]);
  const [prompt, setPrompt] = useState("");
  const [voice, setVoice] = useState("sarah");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    console.log("Button clicked, prompt:", prompt);
    if (!prompt) {
      console.log("Prompt is empty, returning");
      return;
    }
    
    setIsGenerating(true);
    console.log("Starting generation process...");
    
    try {
      // 1. Create a record in Supabase first
      console.log("Inserting record into Supabase...");
      const { data: generation, error: supabaseError } = await supabase
        .from("generations")
        .insert({
          prompt,
          aspect_ratio: aspectRatio === "9:16" ? "portrait" : "landscape",
          length: length[0].toString(),
          voice,
          image_url: imageUrl,
          status: "pending"
        })
        .select()
        .single();

      if (supabaseError) {
        console.error("Supabase insert error details:", JSON.stringify(supabaseError, null, 2));
        throw supabaseError;
      }

      const generationId = generation.id;
      console.log("Successfully created record. generationId:", generationId);
      
      // Clear stale data
      sessionStorage.removeItem("completed_video_url");
      sessionStorage.removeItem("pending_generation");
      
      const generationData: any = {
        id: generationId,
        prompt,
        aspectRatio: aspectRatio === "9:16" ? "portrait" : "landscape",
        length: length[0].toString(),
        voice,
        imageUrl,
        timestamp: new Date().toISOString(),
      };

      // 2. Define the trigger function
      const sendToN8n = async (data: any) => {
        const url = "/api/create-ad";
        console.log("Triggering n8n proxy at:", url, "with data:", data);
        
        let body: FormData | string;
        let headers: Record<string, string> = {};

        if (selectedFile) {
          console.log("Sending with file:", selectedFile.name);
          const formData = new FormData();
          formData.append("action", "generate_video");
          formData.append("generationId", generationId);
          formData.append("prompt", data.prompt);
          formData.append("aspectRatio", data.aspectRatio);
          formData.append("length", data.length);
          formData.append("voice", data.voice);
          formData.append("imageUrl", data.imageUrl || "");
          formData.append("file", selectedFile);
          body = formData;
        } else {
          console.log("Sending without file (JSON)");
          body = JSON.stringify({
            action: "generate_video",
            generationId,
            ...data
          });
          headers["Content-Type"] = "application/json";
        }

        try {
          const response = await fetch(url, {
            method: "POST",
            body,
            ...(Object.keys(headers).length > 0 && { headers })
          });
          
          const result = await response.json();
          console.log("n8n proxy response:", result);
          
          if (!response.ok) {
            throw new Error(result.error || "Failed to trigger n8n");
          }

          sessionStorage.setItem("current_generation_id", generationId);
          setIsSuccess(true);
          console.log("Success! Redirecting to results page...");
          
          setTimeout(() => {
            window.location.href = `/results?id=${generationId}`;
          }, 1000);
        } catch (err) {
          console.error("Error triggering n8n:", err);
          alert(`Error triggering workflow: ${err instanceof Error ? err.message : String(err)}`);
          // Still try to redirect so they can see status
          window.location.href = `/results?id=${generationId}`;
        }
      };

      // 3. Trigger the process
      await sendToN8n(generationData);
    } catch (error) {
      console.error("Error in handleGenerate caught:", error);
      setIsGenerating(false);
      alert(`Failed to start generation: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Create New Ad</h1>
            <p className="text-zinc-400">Transform your product into a viral video ad.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Panel: Product Source */}
          <div className="lg:col-span-3">
            <Card className="flex h-full flex-col border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-zinc-800">
                   <Upload className="h-3 w-3" />
                </div>
                Product Source
              </div>
              
              <div className="group relative flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/5 bg-black/20 transition-colors hover:border-white/10 hover:bg-black/40">
                <div className="flex flex-col items-center gap-4 p-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-zinc-400 group-hover:bg-white/10 group-hover:text-white transition-all">
                    {selectedFile ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : <Upload className="h-6 w-6" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {selectedFile ? selectedFile.name : "Click to upload"}
                    </p>
                    <p className="text-xs text-zinc-500">PNG or JPG (Max 5MB)</p>
                  </div>
                </div>
                <input 
                  type="file" 
                  className="absolute inset-0 cursor-pointer opacity-0" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </div>

              <div className="mt-6 space-y-3">
                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="mx-4 flex-shrink text-[10px] font-medium uppercase tracking-widest text-zinc-600">OR VIA URL</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Monitor className="h-4 w-4" />
                  </div>
                  <Input 
                    placeholder="https://store.com/product" 
                    className="h-11 border-white/10 bg-black/40 pl-10 text-sm focus:ring-0 focus:ring-offset-0"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Middle Panel: Script & Visuals */}
          <div className="lg:col-span-5">
            <Card className="flex h-full flex-col border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  <Sparkles className="h-4 w-4" />
                  Script & Visuals
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 rounded-full border-white/10 bg-indigo-500/10 text-[11px] font-semibold text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300">
                    <Sparkles className="mr-1.5 h-3 w-3" />
                    Enhance
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 rounded-full border-white/10 bg-white/5 text-[11px] font-semibold text-zinc-400 hover:bg-white/10">
                    + Add Hook
                  </Button>
                </div>
              </div>

              <div className="relative flex-1">
                <Textarea 
                  placeholder="Describe your video ad idea here...&#10;Example: A 30-second TikTok style video for a coffee brand. Start with a tired person yawning, then transition to them drinking coffee and dancing. Energetic music."
                  className="h-full min-h-[300px] resize-none border-none bg-transparent p-0 text-base leading-relaxed text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-0"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-[10px] font-medium text-zinc-500">
                <span>Markdown supported</span>
                <span>{prompt.length} / 1000 chars</span>
              </div>
            </Card>
          </div>

          {/* Right Panel: Configuration */}
          <div className="lg:col-span-4">
            <Card className="flex h-full flex-col border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm">
              <div className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <Zap className="h-4 w-4" />
                Configuration
              </div>

              <div className="space-y-8">
                {/* Aspect Ratio */}
                <div className="space-y-4">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Aspect Ratio</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setAspectRatio("9:16")}
                      className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border p-4 transition-all ${
                        aspectRatio === "9:16" 
                        ? "border-indigo-500 bg-indigo-500/10 text-white" 
                        : "border-white/5 bg-black/20 text-zinc-500 hover:border-white/10"
                      }`}
                    >
                      <Smartphone className="h-6 w-6" />
                      <span className="text-[11px] font-bold">9:16</span>
                      {aspectRatio === "9:16" && <div className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />}
                    </button>
                    <button 
                      onClick={() => setAspectRatio("16:9")}
                      className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border p-4 transition-all ${
                        aspectRatio === "16:9" 
                        ? "border-indigo-500 bg-indigo-500/10 text-white" 
                        : "border-white/5 bg-black/20 text-zinc-500 hover:border-white/10"
                      }`}
                    >
                      <Monitor className="h-6 w-6" />
                      <span className="text-[11px] font-bold">16:9</span>
                      {aspectRatio === "16:9" && <div className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />}
                    </button>
                  </div>
                </div>

                {/* Length */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Length</Label>
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-bold text-white">{length[0]}s</span>
                  </div>
                  <Slider 
                    value={length} 
                    onValueChange={setLength} 
                    max={15} 
                    min={10} 
                    step={5}
                    className="py-4"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-zinc-600">
                    <span>10S</span>
                    <span>15S</span>
                  </div>
                </div>

                {/* Voice Persona */}
                <div className="space-y-4">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Voice Persona</Label>
                  <Select value={voice} onValueChange={setVoice}>
                    <SelectTrigger className="h-14 rounded-2xl border-white/10 bg-black/40 text-white focus:ring-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                          <Mic2 className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold capitalize">{voice}</p>
                          <p className="text-[10px] text-zinc-500">American, Energetic</p>
                        </div>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-zinc-900 text-white">
                      <SelectItem value="sarah">Sarah</SelectItem>
                      <SelectItem value="james">James</SelectItem>
                      <SelectItem value="emma">Emma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                <div className="pt-4">
                  <Button 
                    className={`h-14 w-full rounded-2xl text-base font-bold shadow-lg transition-all active:scale-[0.98] ${
                      isSuccess 
                      ? "bg-green-500 hover:bg-green-600" 
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                    }`}
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Video Sent!
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate Video
                      </>
                    )}
                  </Button>
                  <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    <Zap className="h-3 w-3 fill-current" />
                    5 credits per run
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
