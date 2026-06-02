"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, Star, Send, Loader2, Award, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitStudentFeedback, getStudentFeedback } from "@/app/actions/testimonials";
import { getEnrolledCourses } from "@/app/actions/student/courses";
import { ImageUpload } from "@/components/ui/image-upload";

export default function StudentFeedbackPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);

    // Form states
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");
    const [course, setCourse] = useState("");
    const [image, setImage] = useState("");
    const [placementCompany, setPlacementCompany] = useState("");
    
    // Testimonial status state
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        loadInitialData();
    }, [session]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            
            // 1. Load enrolled courses
            const coursesRes = await getEnrolledCourses();
            if (coursesRes.success && coursesRes.enrollments) {
                setCourses(coursesRes.enrollments);
                if (coursesRes.enrollments.length > 0) {
                    setCourse(coursesRes.enrollments[0].courseId?.name || "");
                }
            }

            // 2. Load existing testimonial if any
            const feedbackRes = await getStudentFeedback({});
            if (feedbackRes.success && feedbackRes.data) {
                const fb = feedbackRes.data;
                setRating(fb.rating || 5);
                setReview(fb.review || "");
                setCourse(fb.course || "");
                setImage(fb.image || "");
                setPlacementCompany(fb.placementCompany || "");
                setStatus(fb.status);
            } else {
                // Default image to profile image if no testimonial exists
                if (session?.user?.image) {
                    setImage(session.user.image);
                }
            }
        } catch (error) {
            console.error("Failed to load initial data:", error);
            toast.error("Failed to load feedback details");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (review.length < 10) {
            return toast.error("Feedback must be at least 10 characters long");
        }
        if (!course) {
            return toast.error("Please specify a course");
        }

        try {
            setSubmitting(true);
            const res = await submitStudentFeedback({
                rating,
                review,
                course,
                image,
                placementCompany
            });

            if (res.success) {
                toast.success("Feedback submitted successfully! Pending admin approval.");
                setStatus("draft");
            } else {
                toast.error(res.error || "Failed to submit feedback");
            }
        } catch (error) {
            console.error("Submit feedback error:", error);
            toast.error("An error occurred during submission");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="py-20 text-center flex justify-center items-center gap-2 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin" /> Loading feedback details...
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 pb-20">
            <div>
                <h1 className="text-3xl font-black text-slate-900">Share Your Feedback</h1>
                <p className="text-slate-500 mt-2 font-medium">Your reviews and experience help us grow, and can be featured on our homepage!</p>
            </div>

            {/* Testimonial Status Card */}
            {status && (
                <div className={`p-6 rounded-[2rem] border flex items-center gap-5 ${
                    status === "published" 
                        ? "bg-emerald-50/50 border-emerald-100 text-emerald-800" 
                        : status === "archived"
                        ? "bg-slate-50 border-slate-200 text-slate-500"
                        : "bg-amber-50/50 border-amber-100 text-amber-800"
                }`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        status === "published" 
                            ? "bg-emerald-500 text-white" 
                            : status === "archived"
                            ? "bg-slate-400 text-white"
                            : "bg-amber-500 text-white"
                    }`}>
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-bold text-lg">
                            Status: <span className="capitalize">{status === "draft" ? "Pending Approval" : status}</span>
                        </p>
                        <p className="text-sm opacity-90 mt-0.5">
                            {status === "published" 
                                ? "Thank you! Your testimonial is currently live on our homepage." 
                                : status === "archived"
                                ? "This testimonial is archived and no longer visible on the homepage."
                                : "Your feedback has been saved and is currently under review by our team."}
                        </p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Your Review</h2>
                        <p className="text-sm text-slate-500 font-medium">Tell us about your learning journey</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-10">
                    {/* User Photo Choice */}
                    <div className="flex flex-col items-center gap-4 shrink-0">
                        <label className="text-sm font-bold text-slate-700">Testimonial Photo</label>
                        <div className="w-32 h-32 rounded-[2rem] bg-slate-100 border-4 border-white shadow-xl overflow-hidden relative">
                            {image ? (
                                <img src={image} alt="Testimonial Photo" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                    <User className="w-12 h-12 text-slate-200" />
                                </div>
                            )}
                        </div>
                        <ImageUpload 
                            value={image} 
                            onChange={(url) => setImage(url)}
                            label="Change Photo"
                            className="w-40"
                        />
                        <p className="text-[10px] text-slate-400 max-w-[160px] text-center">Defaults to your profile picture. Upload a new photo to use specifically for this review.</p>
                    </div>

                    <div className="flex-1 space-y-6">
                        {/* Rating (Star Selector) */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Rating</label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform active:scale-95"
                                    >
                                        <Star className={`w-8 h-8 ${
                                            star <= rating 
                                                ? "text-amber-400 fill-amber-400" 
                                                : "text-slate-200"
                                        }`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Course Name Select / Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Course Studied</label>
                            {courses.length > 0 ? (
                                <select
                                    value={course}
                                    onChange={(e) => setCourse(e.target.value)}
                                    className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-slate-900 appearance-none"
                                >
                                    <option value="" disabled>Select your course</option>
                                    {courses.map((enrollment) => (
                                        <option key={enrollment._id} value={enrollment.courseId?.name}>
                                            {enrollment.courseId?.name}
                                        </option>
                                    ))}
                                    <option value="Other">Other / Custom</option>
                                </select>
                            ) : null}

                            {/* Fallback or Custom Input if "Other" is chosen or no enrollments are found */}
                            {(courses.length === 0 || course === "Other") && (
                                <input
                                    type="text"
                                    value={course === "Other" ? "" : course}
                                    onChange={(e) => setCourse(e.target.value)}
                                    className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-slate-900 mt-2"
                                    placeholder="Enter your course name manually (e.g. Full Stack Web Development)"
                                    required
                                />
                            )}
                        </div>

                        {/* Optional Job / Placement Company */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1">
                                <Building className="w-4 h-4 text-primary" />
                                Current Placement (Optional)
                            </label>
                            <input
                                type="text"
                                value={placementCompany}
                                onChange={(e) => setPlacementCompany(e.target.value)}
                                className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-slate-900"
                                placeholder="e.g. Software Engineer at Google, or Student"
                            />
                        </div>

                        {/* Feedback Textarea */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Your Review</label>
                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                rows={6}
                                className="w-full p-5 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-slate-900 resize-none leading-relaxed"
                                placeholder="Describe your experience studying with us. What did you like? How did the instructors or mock exams help you succeed?"
                                required
                            />
                            <p className="text-[11px] text-slate-400 font-bold ml-2">Min. 10 characters.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-50">
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="h-16 px-10 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all bg-primary hover:bg-primary/95 gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" /> Submit Testimonial
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
