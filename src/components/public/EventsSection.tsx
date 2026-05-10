import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Event {
    _id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    status: string;
}

export default function EventsSection({ events = [] }: { events?: Event[] }) {
    return (
        <section className="section-spacing bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                        Events
                    </p>
                    <h2 className="heading-2 text-gray-900 mb-4">
                        Upcoming Events & Activities
                    </h2>
                    <p className="body text-gray-600">
                        Stay updated with our latest events, admissions, and important dates
                    </p>
                </div>

                {/* Events Slider */}
                <div className="flex overflow-x-auto scrollbar-hide gap-6 pb-6 px-4 md:px-8 snap-x snap-mandatory max-w-7xl mx-auto -mx-4 md:-mx-8">
                    {events.map((event, index) => {
                        const colors = [
                            { text: "text-accent", bg: "bg-accent/10" },
                            { text: "text-primary", bg: "bg-primary/10" },
                            { text: "text-secondary", bg: "bg-secondary/10" },
                            { text: "text-info", bg: "bg-info/10" }
                        ];
                        const theme = colors[index % colors.length];

                        return (
                            <div
                                key={event._id}
                                className="card-default shadow-sm hover:shadow-strong transition-all duration-300 group min-w-[300px] md:min-w-[400px] shrink-0 snap-center md:snap-start border border-gray-100 flex flex-col h-full rounded-[2rem] overflow-hidden"
                            >
                                <div className="flex flex-col h-full bg-white relative">
                                    {/* Abstract header colored backdrop */}
                                    <div className={`h-24 w-full ${theme.bg} rounded-t-[2rem] p-6 relative overflow-hidden flex items-start justify-between`}>
                                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/40 rounded-full blur-2xl" />
                                        <div className={`px-3 py-1 bg-white/90 rounded-full text-xs font-bold leading-none backdrop-blur-md ${theme.text}`}>
                                            {event.status}
                                        </div>
                                    </div>
                                    
                                    {/* Date Circle overlapping */}
                                    <div className="px-6 flex justify-between items-end relative -mt-10">
                                        <div className={`w-20 h-20 rounded-[1.5rem] bg-white shadow-xl flex flex-col items-center justify-center border-2 border-white rotate-2 group-hover:rotate-0 transition-transform ${theme.text}`}>
                                            <span className="font-heading font-black text-3xl leading-none">{new Date(event.date).getDate()}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 pt-4 flex-1 flex flex-col">
                                        <h3 className="heading-4 text-gray-900 mb-4 group-hover:text-primary transition-colors line-clamp-2">
                                            {event.title}
                                        </h3>
                                        
                                        <div className="space-y-3 mb-6 mt-auto">
                                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <span className="truncate">{event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <span className="line-clamp-2">{event.location}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                                            <Link href="/events" className={`text-sm font-bold uppercase tracking-widest ${theme.text} hover:opacity-80 inline-flex items-center gap-2 group-hover:gap-3 transition-all`}>
                                                Explore Event <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* View All */}
                <div className="mt-12 text-center">
                    <Link href="/events" className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-gray-900 text-white font-bold text-sm tracking-widest uppercase hover:bg-primary transition-colors shadow-lg hover:shadow-primary/30 group">
                        <Calendar className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                        Explore Complete Calendar
                    </Link>
                </div>
            </div>
        </section>
    );
}
