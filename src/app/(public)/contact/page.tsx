import { getDynamicPageData } from "@/app/actions/cms";
import DynamicRenderer from "@/components/public/DynamicRenderer";
import { MessageSquare, MapPin, Phone, Mail, Clock } from "lucide-react";

const staticFallbackContent = (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-10">
            <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-orange-100 text-primary font-bold uppercase tracking-widest text-sm shadow-sm border border-orange-200">
                    <MessageSquare className="w-5 h-5 text-primary" /> Get in Touch
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
                    We're Here to Help You Succeed
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                    Have questions about our courses, admissions, or anything else? Our team is always ready to assist you.
                </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
                {/* Contact Information */}
                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
                        <div className="w-16 h-16 bg-orange-100 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-orange-200">
                            <MapPin className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Our Location</h3>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            NGI Study Zone Campus<br />
                            Stanley Road, Beli<br />
                            Prayagraj, Uttar Pradesh 211002
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                            <div className="w-12 h-12 bg-amber-100 text-primary rounded-xl flex items-center justify-center mb-5 border border-amber-200">
                                <Phone className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Phone</h3>
                            <a href="tel:+919839446340" className="text-lg font-medium text-slate-600 hover:text-primary transition-colors">
                                +91 98394 46340
                            </a>
                        </div>
                        
                        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-5">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Email</h3>
                            <a href="mailto:info@ngit.in" className="text-lg font-medium text-slate-600 hover:text-emerald-600 transition-colors">
                                info@ngit.in
                            </a>
                        </div>
                    </div>
                </div>

                {/* Optional Forms could be here */}
                <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full opacity-50 blur-3xl -z-10" />
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-8">Send us a Message</h3>
                    <p className="text-slate-500 mb-8 font-medium">Please contact via phone or email for immediate assistance.</p>
                </div>
            </div>
        </div>
    </div>
);

export default async function PublicContactPage() {
    const dynamicData = await getDynamicPageData("contact");
    const cmsSections = dynamicData.success && dynamicData.sections ? dynamicData.sections : [];

    return (
        <div className="min-h-screen">
            <DynamicRenderer sections={cmsSections} staticFallback={staticFallbackContent} />
        </div>
    );
}
