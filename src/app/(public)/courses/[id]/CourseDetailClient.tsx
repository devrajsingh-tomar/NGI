"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    PlayCircle,
    Download,
    ShieldCheck,
    Star,
    Trophy,
    Loader2
} from "lucide-react";
import { initiatePayment, verifyPayment } from "@/app/actions/payment";
import Script from "next/script";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { sanitizeHtml } from "@/lib/sanitizer";

export default function CourseDetailClient({ course, lessons }: { course: any, lessons: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("Curriculum");
    const [isProcessing, setIsProcessing] = useState(false);

    // Auto-enroll after login
    useEffect(() => {
        if (searchParams.get("enroll") === "true" && session && !isProcessing) {
            // Remove the flag from URL without refresh to avoid repeat triggers
            const url = new URL(window.location.href);
            url.searchParams.delete("enroll");
            window.history.replaceState({}, '', url);
            
            handleEnroll();
        }
    }, [searchParams, session]);

    const handleEnroll = async () => {
        if (!course) return;
        setIsProcessing(true);
        const res = await initiatePayment({ courseId: course.slug || course._id });

        if (!res.success) {
            if (res.code === "UNAUTHORIZED") {
                toast.error("Please login to enroll.");
                const callbackUrl = encodeURIComponent(`${window.location.pathname}?enroll=true`);
                router.push(`/student/login?callbackUrl=${callbackUrl}`);
            } else {
                toast.error(res.error || "Enrollment failed.");
            }
            setIsProcessing(false);
            return;
        }

        const data = res.data;

        if (data.instant) {
            toast.success("Enrolled successfully!");
            router.push(`/student`);
            router.refresh();
            setIsProcessing(false);
            return;
        }

        const options = {
            key: data.key || "rzp_test_dummy",
            amount: data.amount,
            currency: data.currency,
            name: "NGI Study Zone Institute",
            description: `Enrolling in ${course.title}`,
            order_id: data.orderId,
            handler: async (response: any) => {
                // If dummy mode, we might not get real signature but we'll try verification
                const verifyRes = await verifyPayment({
                    razorpayOrderId: response.razorpay_order_id || data.orderId,
                    razorpayPaymentId: response.razorpay_payment_id || "pay_dummy_123",
                    razorpaySignature: response.razorpay_signature || "mock_signature_success"
                });

                if (verifyRes.success) {
                    toast.success("Enrollment successful!");
                    router.push(`/student`);
                    router.refresh();
                } else {
                    toast.error(verifyRes.error || "Payment verification failed");
                }
            },
            prefill: {
                name: data.userName,
                email: data.userEmail,
            },
            theme: { color: "#2563eb" },
        };

        // If orderId starts with order_mock, simulate the Razorpay opening and success
        if (data.orderId?.startsWith("order_mock_")) {
            setTimeout(async () => {
                toast.info("Simulating dummy payment...");
                const verifyRes = await verifyPayment({
                    razorpayOrderId: data.orderId,
                    razorpayPaymentId: "pay_dummy_123",
                    razorpaySignature: "mock_signature_success"
                });
                if (verifyRes.success) {
                    toast.success("Successfully Enrolled (Sandbox Mode)");
                    router.push(`/student`);
                    router.refresh();
                }
            }, 1000);
            setIsProcessing(false);
            return;
        }

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setIsProcessing(false);
    };

    return (
        <div className="pb-32 bg-white">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            
            {/* Hero Section */}
            <section className="bg-slate-50 pt-32 pb-20 border-b relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        <div className="flex-[1.5] space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
                            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest border border-emerald-100 shadow-sm">
                                <ShieldCheck className="w-4 h-4" /> Goverment Affiliated
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight">
                                {course.title.split(":")[0]}
                                {course.title.includes(":") && (
                                    <span className="block text-primary mt-2">{course.title.split(":")[1]}</span>
                                )}
                            </h1>
                            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl font-medium">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-8 py-6 border-y border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-md">
                                        <Image src={course.instructorIds?.[0]?.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974"} alt="Instructor" fill sizes="48px" className="object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Instructor</p>
                                        <p className="font-bold text-slate-900">{course.instructorIds?.[0]?.name || "Senior Faculty"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                                    </div>
                                    <p className="font-black text-slate-900 ml-1">4.9/5</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">(Rating)</p>
                                </div>
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                                    <Trophy className="w-4 h-4 text-primary" />
                                    <p className="text-xs font-black text-slate-700 uppercase tracking-widest">{course.category}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Price/Enroll Card */}
                        <div className="flex-1 w-full lg:sticky lg:top-32 animate-in fade-in slide-in-from-right-4 duration-700">
                            <div className="bg-white rounded-[3rem] border-8 border-slate-50 shadow-2xl p-8 space-y-8 overflow-hidden relative group">
                                <div className="aspect-video rounded-3xl bg-slate-900 flex items-center justify-center overflow-hidden relative">
                                    {course.thumbnail && (
                                        <Image src={course.thumbnail} fill sizes="(max-width: 768px) 100vw, 50vw" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="thumbnail" />
                                    )}
                                    <PlayCircle className="w-20 h-20 text-white/80 group-hover:text-white group-hover:scale-110 transition-all z-10" />
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <p className="absolute bottom-6 left-0 right-0 text-center text-white font-black text-[10px] tracking-[0.2em] uppercase z-10 drop-shadow-lg">Watch Course Preview</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-5xl font-black text-slate-900 tracking-tighter">₹{course.price.toLocaleString()}</p>
                                        {course.price > 0 && (
                                            <>
                                                <p className="text-slate-400 line-through font-bold text-lg">₹{(course.price * 1.25).toLocaleString()}</p>
                                                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase ml-2 tracking-widest border border-emerald-100">20% OFF</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Button
                                            onClick={handleEnroll}
                                            disabled={isProcessing}
                                            className="w-full h-16 rounded-[1.50rem] text-xl font-black shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform bg-primary hover:bg-primary/95 text-primary-foreground border-none"
                                        >
                                            {isProcessing ? (
                                                <span className="flex items-center gap-3"><Loader2 className="w-5 h-5 animate-spin" /> Processing...</span>
                                            ) : (
                                                "Enroll in Program"
                                            )}
                                        </Button>
                                        {course.syllabusUrl && (
                                            <a href={course.syllabusUrl} target="_blank" rel="noopener noreferrer">
                                                <Button variant="outline" className="w-full h-16 rounded-[1.50rem] text-lg font-bold border-2 border-slate-100 flex gap-2 hover:bg-slate-50 mt-3">
                                                    <Download className="w-5 h-5" /> Download Full Syllabus
                                                </Button>
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-100">
                                        <div className="text-center">
                                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                                             <p className="text-sm font-bold text-slate-700">{course.duration || "Self-paced"}</p>
                                        </div>
                                        <div className="w-px h-8 bg-slate-100" />
                                        <div className="text-center">
                                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Access</p>
                                             <p className="text-sm font-bold text-slate-700">Lifetime</p>
                                        </div>
                                        <div className="w-px h-8 bg-slate-100" />
                                        <div className="text-center">
                                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Certificate</p>
                                             <p className="text-sm font-bold text-slate-700">Included</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 mt-20">
                <div className="flex flex-col lg:flex-row gap-20">
                    <div className="flex-[1.5] space-y-16">
                        {/* Tabs */}
                        <div className="flex gap-12 border-b border-slate-100 sticky top-20 bg-white z-10 pt-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                            {["Curriculum", "Outcome", "Instructions", "Instructors"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-6 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? "text-primary" : "text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1.5 bg-primary rounded-full transition-all duration-300" />}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content: Curriculum */}
                        {activeTab === "Curriculum" && (
                            <div className="space-y-10 animate-in fade-in duration-500">
                                <div className="flex items-center justify-between bg-slate-900 p-8 rounded-[2.5rem] text-white">
                                    <div>
                                        <h2 className="text-2xl font-black mb-1">Program Curriculum</h2>
                                        <p className="text-slate-400 text-sm font-medium">A structured path from fundamentals to mastery.</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-primary">{lessons.length}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Total Modules</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {lessons.map((lesson, idx) => (
                                        <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 flex items-center justify-between group hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-slate-100">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary font-black shadow-inner group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{lesson.title}</h3>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 border border-slate-100 px-2 py-0.5 rounded-lg uppercase tracking-widest">
                                                            {lesson.type}
                                                        </span>
                                                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{lesson.duration || "N/A"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {lesson.isFree ? (
                                                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest">Free Preview</span>
                                            ) : (
                                                <PlayCircle className="w-6 h-6 text-slate-200 group-hover:text-primary transition-colors" />
                                            )}
                                        </div>
                                    ))}
                                    {lessons.length === 0 && (
                                        <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed">
                                            <p className="text-slate-400 font-medium italic">Full curriculum details will be updated soon.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "Outcome" && (
                            <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">What you'll master</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {(course.outcomes?.length > 0 ? course.outcomes : [
                                        "Advanced understanding of core concepts",
                                        "Industry-ready practical project experience",
                                        "Mastery of modern tools and methodologies",
                                        "Critical analytical and design thinking",
                                        "Access to exclusive career placement resources",
                                        "Professional certification and recognition"
                                    ]).map((item: string, i: number) => (
                                        <div key={i} className="flex items-start gap-5 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:scale-[1.02] transition-all duration-300">
                                            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-emerald-200">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <p className="text-slate-700 font-bold leading-snug">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {activeTab === "Instructions" && (
                            <div className="space-y-10 animate-in fade-in duration-500">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Enrollment instructions</h2>
                                <div className="p-10 rounded-[2.5rem] bg-indigo-50/50 border-2 border-dashed border-indigo-100/50 leading-relaxed text-slate-600 font-medium">
                                    {course.instructions ? (
                                        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(course.instructions.replace(/\n/g, '<br/>')) }} />
                                    ) : (
                                        <p className="italic opacity-60">
                                            Follow the standard registration process. Once payment is confirmed, you'll gain instant access to all learning materials, recorded sessions, and community forums.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "Instructors" && (
                             <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
                                 <h2 className="text-4xl font-black text-slate-900 tracking-tight">Led by Industry Experts</h2>
                                 <div className="space-y-12">
                                     {course.instructorIds?.map((inst: any) => (
                                         <div key={inst._id} className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                                             <div className="relative w-32 h-32 rounded-[2.5rem] bg-slate-200 overflow-hidden shrink-0 shadow-2xl border-4 border-white">
                                                 <Image src={inst.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974"} fill sizes="128px" className="object-cover" alt="inst" />
                                             </div>
                                             <div className="space-y-4 text-center md:text-left">
                                                  <h3 className="text-2xl font-black text-slate-900">{inst.name}</h3>
                                                  <p className="text-slate-500 font-medium leading-relaxed italic">
                                                      {inst.bio || "A veteran educationalist with over 15 years of experience in mentorship and curriculum design. Passionate about empowering students to achieve their academic goals."}
                                                  </p>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
