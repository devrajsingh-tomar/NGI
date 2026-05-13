import Link from "next/link";
import { getHeaderFooterData } from "@/app/actions/layoutContent";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Zap, ArrowUpRight, ShieldCheck, Globe, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterLink {
    label: string;
    href: string;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

interface SocialLink {
    platform: string;
    url: string;
}

interface FooterData {
    logoImage?: string;
    logoText?: string;
    description?: string;
    copyright?: string;
    sections?: FooterSection[];
    social?: SocialLink[];
}

export default async function Footer() {
    const result = await getHeaderFooterData();
    
    // Default fallback data if everything fails
    const defaultFooterData: FooterData = {
        logoText: "NGI Study Zone",
        description: "Architecting the future of technical education with precision, innovation, and industry-first success strategies.",
        copyright: `© ${new Date().getFullYear()} All rights reserved to NGI Study Zone.`,
        sections: [
            {
                title: "Quick Links",
                links: [
                    { label: "About Us", href: "/#about" },
                    { label: "Courses", href: "/courses" },
                    { label: "Contact", href: "/contact" },
                ],
            }
        ],
        social: [
            { platform: "Facebook", url: "#" },
            { platform: "Twitter", url: "#" },
            { platform: "Instagram", url: "#" },
        ]
    };

    const footerData: FooterData = (result.success && result.footer) ? result.footer : defaultFooterData;
    const headerData = result.success ? result.header : null;
    const logoToDisplay = footerData.logoImage || headerData?.logoImage;

    const currentYear = new Date().getFullYear();
    const contactSection = footerData.sections?.find(s => s.title.toLowerCase().includes('contact'));
    const regularSections = footerData.sections?.filter(s => !s.title.toLowerCase().includes('contact')) || [];

    const getIcon = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes('facebook')) return <Facebook className="w-5 h-5" />;
        if (p.includes('twitter')) return <Twitter className="w-5 h-5" />;
        if (p.includes('instagram')) return <Instagram className="w-5 h-5" />;
        if (p.includes('youtube')) return <Youtube className="w-5 h-5" />;
        return <Globe className="w-5 h-5" />;
    };

    return (
        <footer className="relative bg-slate-950 text-slate-400 border-t border-white/5 pt-32 pb-12 overflow-hidden">
            {/* Precision Grid Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,transparent,black)] opacity-10 pointer-events-none" />
            
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] -mr-96 -mt-96 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[160px] -ml-96 -mb-96 pointer-events-none" />
            
            <div className="container-custom relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
                    {/* Brand Identity */}
                    <div className="lg:col-span-5 space-y-10">
                        <div className="space-y-8">
                            <Link href="/" className="inline-block group transition-transform duration-500 hover:scale-105">
                                {logoToDisplay ? (
                                    <div className="relative">
                                        <img 
                                            src={logoToDisplay} 
                                            alt="NGI Study Zone Logo" 
                                            className="h-20 w-auto object-contain opacity-90 group-hover:opacity-100 transition-all" 
                                        />
                                        <div className="absolute -inset-4 bg-amber-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-indigo-700 rounded-2xl flex items-center justify-center font-black text-white text-3xl shadow-2xl shadow-primary/20">
                                            N
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">
                                                {footerData.logoText || "NGI Study Zone"}
                                            </h3>
                                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em] mt-1 ml-1">Institute</span>
                                        </div>
                                    </div>
                                )}
                            </Link>
                            
                            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-lg">
                                {footerData.description || "Architecting the future of technical education with precision, innovation, and industry-first success strategies."}
                            </p>
                        </div>

                        {/* Social Connectivity */}
                        <div className="space-y-6">
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] ml-1">Social Connectivity Matrix</p>
                            <div className="flex flex-wrap gap-4">
                                {footerData.social?.map((social, idx) => (
                                    <Link
                                        key={idx}
                                        href={social.url}
                                        target="_blank"
                                        className="w-14 h-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all duration-500 group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                            {getIcon(social.platform)}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Framework */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-12">
                        {regularSections.map((section, idx) => (
                            <div key={idx} className="space-y-8">
                                <h4 className="text-[11px] font-black uppercase text-primary tracking-[0.3em] flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-amber-500/30" />
                                    {section.title}
                                </h4>
                                <ul className="space-y-5">
                                    {section.links?.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                            <Link
                                                href={link.href}
                                                className="group flex items-center gap-3 text-[15px] font-semibold text-slate-400 hover:text-white transition-all"
                                            >
                                                <span className="w-1.5 h-[1.5px] bg-amber-500/40 group-hover:w-4 group-hover:bg-amber-500 transition-all duration-300" />
                                                <span>{link.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Direct Support - Only render if contact data is specifically provided */}
                        {contactSection && (
                            <div className="space-y-8">
                                <h4 className="text-[11px] font-black uppercase text-primary tracking-[0.3em] flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-amber-500/30" />
                                    {contactSection.title}
                                </h4>
                                <div className="space-y-4">
                                    {contactSection.links?.map((link, idx) => {
                                        const isPhone = link.href.startsWith("tel:");
                                        const isMail = link.href.startsWith("mailto:");

                                        return (
                                            <a 
                                                key={idx} 
                                                href={link.href} 
                                                className="group flex items-center gap-5 p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-500"
                                            >
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:rotate-12 shadow-2xl",
                                                    isPhone ? "bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white" : 
                                                    isMail ? "bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white" : 
                                                    "bg-slate-700/30 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-900"
                                                )}>
                                                    {isPhone ? <Phone className="w-5 h-5" /> : isMail ? <Mail className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[13px] font-black text-white truncate group-hover:translate-x-1 transition-transform">
                                                        {link.label.split(":")[1]?.trim() || link.label}
                                                    </p>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1.5 flex items-center gap-2">
                                                        <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                                        {isPhone ? "Direct Navigation" : isMail ? "Digital Logistics" : "Spatial Identity"}
                                                    </p>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Baseline */}
                <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-center md:text-left space-y-2">
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
                            {footerData.copyright || `© ${currentYear} All rights reserved to NGI Study Zone.`}
                        </p>
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                            ISO 9001:2015 Certified Institute • Skill India Partner
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-8">
                        <div className="flex items-center gap-8">
                            <Link href="/privacy" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                        <Link href="/verify" className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary text-[11px] font-black uppercase tracking-widest text-white hover:bg-orange-600 hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all transform hover:-translate-y-1">
                            <ShieldCheck className="w-4 h-4" />
                            Verify Certificate
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
