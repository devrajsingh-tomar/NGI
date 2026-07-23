"use client";

import { useState, useEffect, useRef } from "react";
import { PlayCircle, CheckCircle, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
    title: string;
    url: string;
    type: "VIDEO" | "PDF" | "QUIZ";
    onComplete?: () => void;
}

function getYouTubeEmbedUrl(url: string): string | null {
    if (!url) return null;
    
    // 1. Check for shorts
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
    if (shortsMatch && shortsMatch[1].length === 11) {
        return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }
    
    // 2. Check for live stream
    const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/i);
    if (liveMatch && liveMatch[1].length === 11) {
        return `https://www.youtube.com/embed/${liveMatch[1]}`;
    }
    
    // 3. Check for standard watch, embed, v, or youtu.be
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    return null;
}

function formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds === null) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function VideoPlayer({ title, url, type, onComplete }: VideoPlayerProps) {
    const [completed, setCompleted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [origin, setOrigin] = useState("");

    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Simple YouTube ID check (if not full URL)
    const isYouTubeId = url && !url.includes("http") && url.length < 20;
    const embedUrl = getYouTubeEmbedUrl(url);
    const isYouTubeUrl = !!embedUrl;

    useEffect(() => {
        if (typeof window !== "undefined") {
            setOrigin(window.location.origin);
        }
    }, []);

    let videoSrc = url;
    if (isYouTubeId) {
        videoSrc = `https://www.youtube.com/embed/${url}?enablejsapi=1&controls=0&modestbranding=1&rel=0&origin=${encodeURIComponent(origin)}`;
    } else if (embedUrl) {
        videoSrc = `${embedUrl}?enablejsapi=1&controls=0&modestbranding=1&rel=0&origin=${encodeURIComponent(origin)}`;
    }

    const postToYouTube = (func: string, args: any[] = []) => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                JSON.stringify({ event: "command", func, args }),
                "*"
            );
        }
    };

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== "https://www.youtube.com" && event.origin !== "https://www.youtube-nocookie.com") return;
            try {
                const data = JSON.parse(event.data);
                if (data.event === "onStateChange") {
                    if (data.info === 1) setIsPlaying(true);
                    else if (data.info === 2) setIsPlaying(false);
                    else if (data.info === 0) handleVideoEnd();
                }
                if (data.info) {
                    if (data.info.currentTime !== undefined) setCurrentTime(data.info.currentTime);
                    if (data.info.duration !== undefined) setDuration(data.info.duration);
                }
            } catch (err) {
                // Ignore other postmessages
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    useEffect(() => {
        if (!isPlaying || !(isYouTubeId || isYouTubeUrl)) return;
        const interval = setInterval(() => {
            postToYouTube("getCurrentTime");
            postToYouTube("getDuration");
        }, 500);
        return () => clearInterval(interval);
    }, [isPlaying, isYouTubeId, isYouTubeUrl]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const togglePlay = () => {
        if (isYouTubeId || isYouTubeUrl) {
            if (isPlaying) {
                postToYouTube("pauseVideo");
                setIsPlaying(false);
            } else {
                postToYouTube("playVideo");
                setIsPlaying(true);
            }
        } else {
            if (videoRef.current) {
                if (isPlaying) {
                    videoRef.current.pause();
                    setIsPlaying(false);
                } else {
                    videoRef.current.play();
                    setIsPlaying(true);
                }
            }
        }
    };

    const handleSeek = (newTime: number) => {
        setCurrentTime(newTime);
        if (isYouTubeId || isYouTubeUrl) {
            postToYouTube("seekTo", [newTime, true]);
        } else {
            if (videoRef.current) {
                videoRef.current.currentTime = newTime;
            }
        }
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        if (isYouTubeId || isYouTubeUrl) {
            postToYouTube("setVolume", [newVolume * 100]);
            if (newVolume === 0) postToYouTube("mute");
            else postToYouTube("unMute");
        } else {
            if (videoRef.current) {
                videoRef.current.volume = newVolume;
                videoRef.current.muted = newVolume === 0;
            }
        }
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch(err => console.error(err));
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            }).catch(err => console.error(err));
        }
    };

    const handleVideoEnd = () => {
        setCompleted(true);
        setIsPlaying(false);
        if (onComplete) onComplete();
    };

    if (type === "VIDEO") {
        return (
            <div 
                ref={containerRef}
                className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group"
            >
                {isYouTubeId || isYouTubeUrl ? (
                    <>
                        <iframe
                            ref={iframeRef}
                            title={title}
                            src={videoSrc}
                            className="w-full h-full pointer-events-none scale-105"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                        <div 
                            className="absolute inset-0 cursor-pointer bg-transparent" 
                            onClick={togglePlay}
                        />
                    </>
                ) : (
                    <video
                        ref={videoRef}
                        src={videoSrc}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={togglePlay}
                        onTimeUpdate={() => {
                            if (videoRef.current) {
                                setCurrentTime(videoRef.current.currentTime);
                                setDuration(videoRef.current.duration || 0);
                            }
                        }}
                        onEnded={handleVideoEnd}
                    />
                )}

                {/* Big Center Play Overlay Button */}
                {!isPlaying && (
                    <div 
                        className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/30 transition-opacity cursor-pointer"
                    >
                        <Play className="w-16 h-16 text-white fill-white opacity-85 hover:opacity-100 transition-opacity scale-100 hover:scale-110 active:scale-95 duration-200 transform" />
                    </div>
                )}

                {/* Custom Control Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-3.5 z-20">
                    {/* Progress Bar Slider */}
                    <div className="flex items-center gap-3 w-full">
                        <span className="text-[10px] text-slate-300 font-bold tracking-wider select-none min-w-[32px]">{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min={0}
                            max={duration || 100}
                            value={currentTime}
                            onChange={(e) => handleSeek(Number(e.target.value))}
                            className="flex-1 h-1 rounded-lg bg-slate-600 appearance-none cursor-pointer accent-primary focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-300 font-bold tracking-wider select-none min-w-[32px]">{formatTime(duration)}</span>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <button onClick={togglePlay} className="text-white hover:text-primary transition-colors focus:outline-none">
                                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                            </button>

                            {/* Volume Slider Controls */}
                            <div className="flex items-center gap-2 group/volume">
                                <button onClick={() => handleVolumeChange(isMuted ? 0.8 : 0)} className="text-white hover:text-primary transition-colors focus:outline-none">
                                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                                    className="w-0 group-hover/volume:w-16 h-1 bg-slate-600 appearance-none cursor-pointer accent-white transition-all duration-300"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Manual Completion Trigger */}
                            <Button
                                size="sm"
                                variant={completed ? "secondary" : "default"}
                                onClick={handleVideoEnd}
                                className="font-bold gap-2 text-[10px] uppercase h-9 rounded-xl px-4 tracking-wider"
                            >
                                {completed ? <CheckCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                                {completed ? "Completed" : "Mark Complete"}
                            </Button>

                            {/* Fullscreen Slider Toggle */}
                            <button onClick={toggleFullscreen} className="text-white hover:text-primary transition-colors focus:outline-none">
                                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
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

    return null;
}
