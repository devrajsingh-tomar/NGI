"use client";

import { useState } from "react";
import { PlayCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
    title: string;
    url: string;
    type: "VIDEO" | "PDF" | "QUIZ";
    onComplete?: () => void;
}

export default function VideoPlayer({ title, url, type, onComplete }: VideoPlayerProps) {
    const [completed, setCompleted] = useState(false);

    // Simple YouTube ID check (if not full URL)
    const isYouTubeId = url && !url.includes("http") && url.length < 20;
    const isYouTubeUrl = url && (url.includes("youtube.com") || url.includes("youtu.be"));

    let videoSrc = url;
    if (isYouTubeId) {
        videoSrc = `https://www.youtube.com/embed/${url}?autoplay=1&rel=0`;
    } else if (isYouTubeUrl) {
        // Extract ID if needed, but embed URL usually works if formatted correctly
        // Simple replace for watch?v= -> embed/
        videoSrc = url.replace("watch?v=", "embed/");
    }

    const handleVideoEnd = () => {
        setCompleted(true);
        if (onComplete) onComplete();
    };

    if (type === "VIDEO") {
        return (
            <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group">
                {isYouTubeId || isYouTubeUrl ? (
                    <iframe
                        title={title}
                        src={videoSrc}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; geolocation; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <video
                        src={videoSrc}
                        controls
                        className="w-full h-full object-cover"
                        onEnded={handleVideoEnd}
                    />
                )}

                {/* Overlay for manual completion if iframe doesn't report */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="sm"
                        variant={completed ? "secondary" : "default"}
                        onClick={handleVideoEnd}
                        className="font-bold gap-2 text-xs"
                    >
                        {completed ? <CheckCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                        {completed ? "Completed" : "Mark Complete"}
                    </Button>
                </div>
            </div>
        );
    }

    if (type === "PDF") {
        return (
            <div className="w-full h-[600px] bg-slate-50 rounded-3xl border border-slate-200 flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto text-red-600">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 2H7a2 2 0 00-2 2v15a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-slate-900 text-xl">{title}</h3>
                    <p className="text-slate-500 text-sm max-w-md">This is a PDF document. You can view or download it below.</p>
                    <Button onClick={() => window.open(url, "_blank")} className="rounded-xl font-bold">
                        Open PDF
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-64 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 font-medium">
            Content type not supported yet.
        </div>
    );
}
