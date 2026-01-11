"use client";

import { MoreHorizontal, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const projects = [
  {
    id: 1,
    title: "Nike Air Promo V2",
    status: "rendering",
    progress: 45,
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&h=250&auto=format&fit=crop",
    time: "Started 2 mins ago",
    label: "AI Remix"
  },
  {
    id: 2,
    title: "Summer Desk Setup",
    status: "ready",
    duration: "0:15",
    thumbnail: "https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?q=80&w=400&h=250&auto=format&fit=crop",
    time: "Edited 2 hours ago",
    label: "AI Remix"
  },
  {
    id: 3,
    title: "Watch Collection Q3",
    status: "ready",
    duration: "0:30",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&h=250&auto=format&fit=crop",
    time: "Yesterday",
    label: "AI Remix"
  },
  {
    id: 4,
    title: "App Launch Teaser",
    status: "ready",
    duration: "0:12",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=400&h=250&auto=format&fit=crop",
    time: "3 days ago",
    label: "AI Remix"
  }
];

export function RecentProjects() {
  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-white">Recent Projects</h2>
          <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-400">14</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 border-white/10 bg-zinc-900/50 px-4 text-sm font-medium text-white hover:bg-zinc-800">
            Sort by: Date
          </Button>
          <div className="flex rounded-lg border border-white/10 bg-zinc-900/50 p-1">
            <Button size="icon" variant="ghost" className="h-8 w-8 bg-zinc-800 text-white">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-white">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project) => (
          <div key={project.id} className="group flex flex-col gap-3">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
              <img 
                src={project.thumbnail} 
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Overlay for rendering */}
              {project.status === "rendering" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="relative h-12 w-12 items-center justify-center flex">
                    <svg className="h-12 w-12 -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        className="text-white/10"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        strokeDasharray={125.6}
                        strokeDashoffset={125.6 * (1 - project.progress / 100)}
                        className="text-white"
                      />
                    </svg>
                  </div>
                  <span className="mt-3 text-xs font-bold text-white uppercase tracking-wider">Rendering</span>
                  <span className="text-[10px] text-zinc-400">{project.progress}% Complete</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute left-3 top-3">
                <Badge variant="secondary" className="bg-black/40 text-[10px] text-white backdrop-blur-md border-none">
                  {project.label}
                </Badge>
              </div>

              {project.status === "ready" && (
                <>
                  <div className="absolute right-3 top-3">
                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400 backdrop-blur-md">
                      <span className="h-1 w-1 rounded-full bg-emerald-400" />
                      Ready
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                    {project.duration}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-start justify-between px-1">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-semibold text-white">{project.title}</h3>
                <span className="text-[11px] text-zinc-500">{project.time}</span>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
