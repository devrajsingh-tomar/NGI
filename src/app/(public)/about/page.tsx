import { getAboutPageData } from "@/app/actions/about";
import { getFaculty } from "@/app/actions/faculty";
import DynamicRenderer from "@/components/public/DynamicRenderer";
import { CheckCircle, Target, Eye, BookOpen, Award, Rocket, MonitorPlay } from "lucide-react";
import Image from "next/image";

const IconMap: any = {
    Target, Eye, BookOpen, Award, Rocket, MonitorPlay
};

export default async function AboutPage() {
    const [aboutRes, facultyRes] = await Promise.all([
        getAboutPageData(),
        getFaculty()
    ]);
    
    if (!aboutRes.success || !aboutRes.data) {
        return (
            <div className="py-20 text-center">
                <p>Failed to load about page data.</p>
            </div>
        );
    }

    const d = aboutRes.data;
    const facultyMembers = facultyRes.success ? facultyRes.faculty : [];

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-12">
            <div className="container mx-auto px-4 lg:px-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-primary border border-orange-200 font-semibold text-sm uppercase tracking-wider mb-6">
                        {d.hero?.badge || "About Us"}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                        {d.hero?.title || "National Genius Institute"}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                        {d.hero?.subtitle}
                    </p>
                </div>

                {/* Main Content Area */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-amber-500 rounded-[2rem] transform -rotate-3 scale-105 opacity-20" />
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[500px]">
                            <Image
                                src={d.intro?.image || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070"}
                                alt="Students learning in IT lab"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">{d.intro?.title || "About NGI Study Zone"}</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-4">
                                {d.intro?.text1}
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {d.intro?.text2}
                            </p>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                            {d.checklist?.map((item: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                                    <span className="font-semibold text-slate-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mission and Vision section */}
                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    <div className="bg-white p-10 rounded-3xl shadow-xl shadow-orange-900/5 relative overflow-hidden border border-slate-100">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-10" />
                        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-8 border border-orange-200">
                            <Target className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">{d.mission?.title}</h3>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            {d.mission?.text}
                        </p>
                    </div>

                    <div className="bg-white p-10 rounded-3xl shadow-xl shadow-orange-900/5 relative overflow-hidden border border-slate-100">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-10" />
                        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-8 border border-amber-200">
                            <Eye className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">{d.vision?.title}</h3>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            {d.vision?.text}
                        </p>
                    </div>
                </div>

                {/* Statistics / Highlights */}
                <div className="bg-primary rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-xl shadow-primary/20">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070')] bg-cover opacity-10 mix-blend-overlay" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {d.stats?.map((stat: any, idx: number) => {
                            const Icon = IconMap[stat.icon] || Award;
                            return (
                                <div key={idx} className="space-y-2">
                                    <Icon className="w-10 h-10 text-orange-100 mx-auto mb-4" />
                                    <h4 className="text-4xl font-extrabold text-white">{stat.value}</h4>
                                    <p className="text-orange-100/80 font-medium">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

