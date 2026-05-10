import { Button } from "@/components/ui/button";
import {
    Calendar,
    MapPin,
    Clock,
    ArrowRight,
    Share2,
    CalendarCheck
} from "lucide-react";
import { getEvents } from "@/app/actions/events";

export default async function EventsPage() {
    const res = await getEvents();
    const events = res.success ? res.events : [];
    if (events.length === 0) {
        return (
            <div className="pb-32">
                <section className="bg-primary text-white py-24 mb-20 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="container mx-auto px-4 text-center space-y-4 relative z-10">
                        <h1 className="text-5xl font-black">Upcoming Events</h1>
                        <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                            Stay updated with the latest workshops, seminars, and fests happening at NGI Study Zone.
                        </p>
                    </div>
                </section>
                <div className="container mx-auto px-4 text-center mt-20">
                    <div className="p-16 border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-400">
                        <CalendarCheck className="w-16 h-16 mx-auto mb-6 text-slate-300" />
                        <h2 className="text-2xl font-bold text-slate-600 mb-2">No upcoming events</h2>
                        <p>Check back later for new workshops and activities!</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-32">
            {/* Header */}
            <section className="bg-primary text-white py-24 mb-20 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="container mx-auto px-4 text-center space-y-4 relative z-10">
                    <h1 className="text-5xl font-black">Upcoming Events</h1>
                    <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                        Stay updated with the latest workshops, seminars, and fests happening at NGI Study Zone.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="space-y-12">
                    {events.map((event: any, i: number) => {
                        const eventDate = new Date(event.date);
                        return (
                            <div key={event._id} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center group`}>
                                <div className="flex-1 w-full">
                                    <div className="aspect-[16/9] relative rounded-[3rem] overflow-hidden shadow-2xl group-hover:-translate-y-2 transition-transform duration-500 border-8 border-white bg-slate-100">
                                        {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />}
                                        <div className="absolute top-6 left-6 bg-white rounded-2xl p-4 shadow-lg text-center min-w-[80px]">
                                            <p className="text-primary font-black text-2xl leading-none">{eventDate.getDate()}</p>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{eventDate.toLocaleString('default', { month: 'short' })}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-6">
                                    <span className="text-primary font-black text-xs uppercase tracking-[0.2em] bg-primary/5 px-4 py-2 rounded-full">
                                        # {event.category}
                                    </span>
                                    <h2 className="text-4xl font-black text-slate-900 group-hover:text-primary transition-colors">{event.title}</h2>
                                    <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                                        {event.description}
                                    </p>

                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center gap-3 text-slate-500 font-medium">
                                            <Clock className="w-5 h-5 text-primary" /> {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-500 font-medium">
                                            <MapPin className="w-5 h-5 text-primary" /> {event.location}
                                        </div>
                                    </div>

                                    <div className="pt-6 flex gap-4">
                                        {event.registrationLink && (
                                            <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                                                <Button className="h-14 rounded-2xl px-8 font-bold shadow-lg shadow-primary/20">
                                                    Register for Event <ArrowRight className="ml-2 w-5 h-5" />
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-20 py-20 bg-slate-50 rounded-[4rem] text-center border border-slate-100 italic text-slate-500">
                    "Education is not just learning of facts, but the training of the mind to think."
                </div>
            </div>
        </div>
    );
}
