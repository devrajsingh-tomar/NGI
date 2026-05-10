"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Play, ChevronLeft, ChevronRight, Quote, User, BookOpen, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feedback {
    _id: string;
    name?: string;
    role?: string;
    course?: string;
    videoUrl: string;
    aspectRatio?: "16:9" | "9:16" | "1:1";
    review?: string;
    rating?: number;
}

function getEmbedUrl(url: string): { type: "youtube" | "vimeo" | "direct"; src: string; isShort: boolean; videoId?: string } {
    // YouTube
    const ytMatch = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch) {
        return {
            type: "youtube",
            src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
            isShort: url.includes('/shorts/'),
            videoId: ytMatch[1]
        };
    }
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
        return {
            type: "vimeo",
            src: `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1`,
            isShort: false
        };
    }
    // Direct video
    return { type: "direct", src: url, isShort: false };
}

// ─── Lazy Video Card ─────────────────────────────────────────────────────────

function VideoCard({ feedback, isActive }: { feedback: Feedback; isActive: boolean }) {
    const [playing, setPlaying] = useState(false);
    const embed = getEmbedUrl(feedback.videoUrl);

    // Auto-detect shorts if aspect ratio is not explicitly set or default horizontal is applied to shorts
    let ratioClass = "aspect-video"; // default 16:9
    if (feedback.aspectRatio === "9:16" || (!feedback.aspectRatio && embed.isShort)) {
        ratioClass = "aspect-[9/16]";
    } else if (feedback.aspectRatio === "1:1") {
        ratioClass = "aspect-square";
    }

    // Reset player when card loses active state (slider)
    useEffect(() => {
        if (!isActive) setPlaying(false);
    }, [isActive]);

    return (
        <div className="h-full flex flex-col bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all duration-500 group">
            {/* Video Section */}
            <div className={cn("relative bg-slate-900 overflow-hidden shrink-0", ratioClass)}>
                {playing ? (
                    embed.type === "direct" ? (
                        <video
                            src={embed.src}
                            className="w-full h-full object-cover"
                            controls
                            autoPlay
                            playsInline
                        />
                    ) : (
                        <iframe
                            src={embed.src + "&autoplay=1"}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; geolocation; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                            title={`${feedback.name} testimonial`}
                        />
                    )
                ) : (
                    /* Thumbnail / Play Button overlay */
                    <div
                        className="w-full h-full flex items-center justify-center cursor-pointer relative"
                        onClick={() => setPlaying(true)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setPlaying(true)}
                        aria-label={`Play testimonial video of ${feedback.name}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />
                        {embed.type === 'youtube' && embed.videoId && (
                            <img
                                src={`https://img.youtube.com/vi/${embed.videoId}/hqdefault.jpg`}
                                alt={`${feedback.name} testimonial thumbnail`}
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                            />
                        )}
                        {/* Decorative grid */}
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
                        />
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative z-10 w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 backdrop-blur-sm flex items-center justify-center shadow-2xl"
                        >
                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                        </motion.div>
                        <div className="absolute bottom-4 left-4 right-4 text-center">
                            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                                Click to play testimonial
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            {(feedback.rating || feedback.review || feedback.name || feedback.course) && (
                <div className="p-8 flex-1 flex flex-col gap-6">
                    {/* Rating */}
                    {feedback.rating && (
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < feedback.rating! ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Review */}
                    {feedback.review && (
                        <div className="relative flex-1">
                            <Quote className="w-8 h-8 text-slate-100 absolute -top-2 -left-2" />
                            <p className="text-slate-600 font-medium leading-relaxed italic pl-4 line-clamp-4">
                                {feedback.review}
                            </p>
                        </div>
                    )}

                    {/* Author */}
                    {(feedback.name || feedback.role || feedback.course) && (
                        <div className={cn("flex items-center gap-4 border-slate-50", feedback.review ? "pt-6 border-t" : "")}>
                            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white text-lg font-black italic shrink-0">
                                {feedback.name ? feedback.name.charAt(0) : "V"}
                            </div>
                            <div>
                                <p className="font-black text-slate-900 leading-none">{feedback.name || "Video Testimonial"}</p>
                                {feedback.role && (
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                        {feedback.role}
                                    </p>
                                )}
                                {feedback.course && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <BookOpen className="w-3 h-3 text-primary" />
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                                            {feedback.course}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function VideoFeedbackSection({
    feedbacks = [],
    data,
}: {
    feedbacks?: Feedback[];
    data?: any;
}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [viewMode, setViewMode] = useState<"grid" | "slider">("grid");

    const title = data?.section_name || "Student Success Stories";
    const subtitle = data?.subtitle || "Real Results";
    const description =
        data?.description ||
        "Hear directly from our students about their transformative learning journeys and career breakthroughs.";

    const goNext = () => setActiveIndex((i) => (i + 1) % feedbacks.length);
    const goPrev = () => setActiveIndex((i) => (i - 1 + feedbacks.length) % feedbacks.length);

    if (feedbacks.length === 0) return null;

    return (
        <section id="testimonials" className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="container px-6 mx-auto relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm mb-4">
                        <Zap className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">
                            {subtitle}
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                        {title}
                    </h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                        {description}
                    </p>

                    {/* View Toggle */}
                    <div className="inline-flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-100 shadow-inner mt-4">
                        {(["grid", "slider"] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    viewMode === mode
                                        ? "bg-slate-900 text-white shadow-xl"
                                        : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid Mode */}
                {viewMode === "grid" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {feedbacks.map((fb, idx) => (
                            <motion.div
                                key={fb._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <VideoCard feedback={fb} isActive={true} />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Slider Mode */}
                {viewMode === "slider" && (
                    <div className="relative max-w-2xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.3 }}
                            >
                                <VideoCard feedback={feedbacks[activeIndex]} isActive={true} />
                            </motion.div>
                        </AnimatePresence>

                        {/* Controls */}
                        <div className="flex items-center justify-between mt-8">
                            <button
                                onClick={goPrev}
                                className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-xl flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all group"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            {/* Dot indicators */}
                            <div className="flex items-center gap-2">
                                {feedbacks.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveIndex(i)}
                                        className={`rounded-full transition-all ${
                                            i === activeIndex
                                                ? "w-8 h-2 bg-slate-900"
                                                : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                                        }`}
                                        aria-label={`Go to testimonial ${i + 1}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={goNext}
                                className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-xl flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                                aria-label="Next"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>

                        <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">
                            {activeIndex + 1} / {feedbacks.length}
                        </p>
                    </div>
                )}
            </div>

            {/* Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] -z-10" />
        </section>
    );
}
