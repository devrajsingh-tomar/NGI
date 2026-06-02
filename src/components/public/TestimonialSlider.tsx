"use client";

import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function TestimonialSlider({ data, blocks, testimonials = [] }: { data: any, blocks?: any[], testimonials?: any[] }) {
    // Convert testimonials or use manual blocks
    const items = testimonials.length > 0 ? testimonials.map(t => ({
        title: t.studentName,
        subtitle: t.placementCompany || "Student",
        description: t.review,
        image: t.image,
        rating: t.rating || 5,
        extra_data: { course: t.course }
    })) : (blocks || []);

    if (!items || items.length === 0) return null;

    return (
        <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10 translate-y-[-50%] translate-x-[-50%]" />
            <div className="absolute top-1/3 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10 translate-y-[-50%] translate-x-[50%]" />

            <div className="container mx-auto px-6 lg:px-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Testimonials</span>
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mt-2">
                            {data?.section_name || "Success Stories & Testimonials"}
                        </h2>
                        <p className="text-slate-500 font-medium mt-3">
                            Hear directly from our student community about their training, achievements, and career transformations.
                        </p>
                    </div>

                    {/* Navigation Buttons */}
                    {items.length > 1 && (
                        <div className="flex items-center gap-3">
                            <button className="ts-prev h-12 w-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="ts-next h-12 w-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={items.length > 1}
                        autoplay={{
                            delay: 6000,
                            disableOnInteraction: false,
                        }}
                        navigation={{
                            nextEl: '.ts-next',
                            prevEl: '.ts-prev',
                        }}
                        pagination={{
                            clickable: true,
                            el: '.ts-pagination',
                            bulletClass: 'ts-bullet',
                            bulletActiveClass: 'ts-bullet-active'
                        }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="w-full !pb-14"
                    >
                        {items.map((item: any, idx: number) => {
                            const extra = typeof item.extra_data === 'string' ? JSON.parse(item.extra_data || "{}") : (item.extra_data || {});
                            const rating = item.rating || 5;

                            return (
                                <SwiperSlide key={idx} className="h-auto">
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-primary/20 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full relative group">
                                        <Quote className="w-12 h-12 text-slate-100/85 absolute top-8 left-8 transition-transform group-hover:-translate-y-1" />
                                        
                                        <div className="flex-1 space-y-4 pt-4">
                                            {/* Stars */}
                                            <div className="flex items-center gap-0.5">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < rating 
                                                                ? "text-amber-400 fill-amber-400" 
                                                                : "text-slate-200 fill-slate-200"
                                                        }`}
                                                    />
                                                ))}
                                            </div>

                                            {/* Review */}
                                            <p className="text-slate-600 font-medium leading-relaxed italic relative z-10 text-sm">
                                                "{item.description}"
                                            </p>
                                        </div>

                                        {/* Student Details */}
                                        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-50">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md bg-slate-100 border border-white shrink-0 relative">
                                                {item.image ? (
                                                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg">
                                                        {item.title?.[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-base font-black text-slate-900 truncate leading-snug">{item.title || "Student Name"}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-wider text-primary truncate mt-0.5">
                                                    {extra.course || item.subtitle || "Student"}
                                                </p>
                                                {item.subtitle && item.subtitle !== "Student" && (
                                                    <p className="text-[9px] text-slate-500 font-bold truncate mt-0.5">
                                                        Placed: {item.subtitle}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {/* Pagination Dot Container */}
                    <div className="ts-pagination flex justify-center gap-2 mt-2" />
                </div>
            </div>

            <style jsx global>{`
                .ts-bullet {
                    width: 8px;
                    height: 8px;
                    border-radius: 99px;
                    background: rgba(148, 163, 184, 0.3);
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .ts-bullet-active {
                    width: 24px;
                    background: hsl(var(--primary));
                    box-shadow: 0 0 8px rgba(var(--primary), 0.3);
                }
            `}</style>
        </section>
    );
}
