"use client"

import { EventProps } from "@/components/dashboard";
import Filter from "@/components/filter";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "@/context/NavigationContext";
import useApi from "@/hooks/use-api";
import { format } from "date-fns";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Events() {
    const { fetch } = useApi();
    const { setActivePage } = useNavigation();
    const { user } = useAuth();
    const [events, setEvents] = useState<EventProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleNavigation = (destination: string) => {
        if (destination === "dashboard") {
            if (user) {
                setActivePage("dashboard");
            } else {
                setActivePage(destination);
            }
        };
    }

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await fetch("/events");
                setLoading(false);
                setEvents(data);
            } catch (error: any) {
                setLoading(false);
                setError(error.message || "An error occurred while fetching events");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadEvents();
    }, [fetch]);

    return (
        <div className="w-full max-w-screen mx-auto">
            <Header onNavigate={handleNavigation} />
            <section className="relative bg-slate-950 text-white">
                <div>
                    <Image src="/app-bg.png" width={500} height={500} alt="" className="absolute w-full h-full inset-0 z-10 object-cover" />
                </div>
                <div className="text-center z-20 px-48 py-24">
                    <h1 className="text-7xl font-bold tracking-tight">The answer to &quot;where&quot;? Starts here!</h1>
                </div>
                <div className="grid grid-cols-3 gap-8">
                </div>
            </section>
            <section className="grid grid-cols-3 gap-8 px-32 py-24">
                <div className="col-span-3 flex flex-row justify-between items-center">
                    <div className="flex flex-row space-x-4 items-center">
                        <Filter placeholder="Select a category" items={["Sport", "Conference", "Concert", "Live Music"]} />
                        <Filter placeholder="Select a price" items={[]} />
                    </div>
                    <div className="flex flex-row space-x-3 items-center">
                        <div>908 items</div>
                        <div className="flex flex-row items-center gap-2">Sort by <Filter items={[]} /></div>
                    </div>
                </div>
                <div className="w-full col-span-3 grid grid-cols-3 gap-8">
                    {events.map((event, index) => (
                        <div key={index} className="relative overflow-hidden flex flex-col justify-between h-[28rem] rounded-xl border border-muted/50 shadow-md">
                            <Image alt="event1" src={event.image_url} width={500} height={500} className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                            <div className="absolute z-10 w-full h-[50%] bottom-0 bg-erie-black/75 text-white space-y-2 p-6 rounded-xl">
                                <h2 className="text-2xl font-semibold">{event.title}</h2>
                                <p>{event.description}</p>
                                <div className="flex flex-row justify-between text-base font-light">
                                    <span>{format(new Date(event.date), "dd-MM-yyyy HH:mm")}</span>
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex flex-row justify-end items-center">
                                    <Button type="button" variant="secondary" onClick={() => router.push(`/events/${event.id}?event=${encodeURIComponent(JSON.stringify(event))}`)}>Buy Ticket</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </div>
    );
}   