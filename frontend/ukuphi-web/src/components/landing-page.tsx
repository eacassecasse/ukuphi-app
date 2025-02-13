"use client";

import { useEffect, useState } from "react"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventProps } from "@/components/dashboard";
import useApi from "@/hooks/use-api";
import { format } from "date-fns";
import { MoveUpRight } from "lucide-react"
import { useRouter } from "next/navigation";
import Header from "./header";
import Footer from "./footer";

export default function LandingPage({ onNavigate }: { onNavigate: (content: string) => void; }) {
    const { fetch } = useApi();
    const [events, setEvents] = useState<EventProps[]>([]);
    const [nearestEvent, setNearestEvent] = useState<EventProps | null>(null);
    const [remainingTime, setRemainingTime] = useState<{ days?: number; hours?: number; minutes?: number; seconds?: number }>({});
    const [selectedEvent, setSelectedEvent] = useState<EventProps>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSelectedEvent = (event: EventProps) => {
        setSelectedEvent(event);
    }

    useEffect(() => {
        // Function to find the nearest event
        const getNearestEvent = () => {
            const now = new Date();
            const upcomingEvents = events
                .filter(event => new Date(event.date) > now)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
        };

        const calculateRemainingTime = (eventDate: string) => {
            const now = new Date();
            const diffMs = new Date(eventDate).getTime() - now.getTime();

            return {
                days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diffMs % (1000 * 60)) / 1000),
            };
        };

        // Initialize nearest event and timer
        const event = getNearestEvent();
        setNearestEvent(event);

        if (event) {
            const updateCountdown = () => {
                const time = calculateRemainingTime(event.date);
                setRemainingTime(time);
            };

            // Initial countdown update
            updateCountdown();

            // Update countdown every second
            const intervalId = setInterval(updateCountdown, 1000);

            // Clear interval on unmount
            return () => clearInterval(intervalId);
        }
    }, [events]);

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
            <Header onNavigate={onNavigate} />
            {/* Content */}
            <main>
                {/* Intro Section */}
                <section className="text-center px-48 py-16 space-y-8">
                    <div>
                        <h1 className="text-7xl font-bold tracking-tight">Discover Exciting Events Near You</h1>
                    </div>
                    <div className="grid grid-cols-3 gap-8">
                        <div className="relative h-72">
                            <Image alt="nearest-event" src={"https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y29uY2VydHN8ZW58MHx8MHx8fDA%3D"} width={500} height={500} className="absolute w-full h-full object-cover rounded-3xl shadow-lg" />
                        </div>
                        <div className="grid grid-cols-5 rounded-lg col-span-2 gap-4 p-8">
                            <div className="col-span-4 grid grid-cols-4 space-x-2 space-y-4">
                                <div className="col-span-4 text-start pl-2">
                                    <h3 className="text-lg font-semibold">Welcome to Ukuphi, the ultimate destination for discovering and booking upcoming events.</h3>
                                </div>
                                {nearestEvent && (
                                    <div className="col-span-4 grid grid-cols-subgrid">
                                        <div className="flex flex-col space-y-2 text-5xl font-bold py-4">{remainingTime.days} <span className="text-xl font-extralight tracking-tight text-muted/50">DAYS</span></div>
                                        <div className="flex flex-col space-y-2 text-5xl font-bold py-4">{remainingTime.hours} <span className="text-xl font-extralight tracking-tight text-muted/50">HOURS</span></div>
                                        <div className="flex flex-col space-y-2 text-5xl font-bold py-4">{remainingTime.minutes} <span className="text-xl font-extralight tracking-tight text-muted/50">MINUTES</span></div>
                                        <div className="flex flex-col space-y-2 text-5xl font-bold py-4">{remainingTime.seconds} <span className="text-xl font-extralight tracking-tight text-muted/50">SECONDS</span></div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center">
                                <p className="text-lg font-semibold transform rotate-90 text-center">Remaining to the next event</p>
                            </div>
                            <div className="col-span-5 flex">
                                <div className="flex-1 flex flex-row flex-nowrap justify-between items-center space-x-1">
                                    <Button type="button" variant="default" className="text-xl font-semibold tracking-tighter w-full pl-8 py-8 rounded-3xl" onClick={() => router.push(`/events/${nearestEvent?.id}`)}><span>Book your seat for {nearestEvent && nearestEvent.title}</span></Button>
                                    <div className="flex p-4 rounded-full bg-purple-700"><MoveUpRight className="w-8 h-8 text-2xl font-bold" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="grid grid-cols-2 gap-8 px-32 py-16">
                    <div className="flex flex-col justify-center items-center gap-6 p-6">
                        <div className=" space-y-4 p-6 rounded-3xl">
                            <h2 className="text-5xl font-bold">DECIDE TO JOIN THE EVENT</h2>
                            <p className="text-sm">Once you&apos;ve found an event you&apos;re interested in, you can view all the details and information you need, including the event date, time, location, lineup, speakers, and agenda.</p>
                        </div>
                        <div className="w-full flex flex-row flex-nowrap">
                            <div className="flex-1">
                                <Button type="button" variant="default" className="flex flex-row flex-nowrap justify-between items-center text-2xl font-bold w-64 px-4 py-7 rounded-3xl"><span>GET TICKET</span><MoveUpRight className="font-bold" /></Button>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden h-80">
                        <Image alt="purchase-ticket" src="/undraw_payments_nbqu.svg" width={500} height={500} className="absolute w-full h-96 object-fit rounded-3xl" />
                    </div>
                </section>
                <section className="grid grid-cols-2 gap-8 px-32 py-16">
                    <div className="flex flex-col justify-center items-center gap-6 p-6">
                        <div className="bg-purple-700  space-y-3 p-6 text-muted/65 rounded-3xl">
                            <h2 className="text-2xl font-bold">EXPLORE THE LOCATION</h2>
                            <p className="text-sm font-semibold">Our platform is designed to make it easy for you to find and book events that match your interests and preferences. You can browse through a range of events and filter results by date, location, category, and more.</p>
                        </div>
                        <div className="w-full flex flex-row flex-nowrap">
                            <div className="flex-1">
                                <Button type="button" variant="default" className="w-full py-4 rounded-xl">EXPLORE THE LOCATION</Button>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden h-80">
                        <Image alt="event-location" src="https://images.unsplash.com/photo-1507878866276-a947ef722fee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbmZlcmVuY2V8ZW58MHx8MHx8fDA%3D" width={500} height={500} className="absolute w-full h-full object-cover rounded-3xl" />
                    </div>
                </section>

                <section className="grid grid-cols-3 gap-8 px-32 py-16">
                    <div className="col-span-2 relative overflow-hidden h-72">
                        <Image alt="book-event" src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uZmVyZW5jZXN8ZW58MHx8MHx8fDA%3D" width={500} height={500} className="absolute w-full h-full object-cover rounded-3xl" />
                    </div>
                    <div className="flex">
                        <div className="bg-pine-green text-muted/65 space-y-3 p-6 rounded-3xl">
                            <p className="text-4xl font-semibold">BOOK AND EXPLORE UPCOMING EVENTS.</p>
                        </div>
                    </div>
                </section>

                <section id="events" className="grid grid-cols-3 gap-8 px-32 py-24">
                    <div className="col-span-3 text-center mb-4">
                        <h1 className="text-4xl font-bold tracking-tighter">DISCOVER UPCOMING EVENTS</h1>
                    </div>
                    <ScrollArea className="h-[40rem] flex flex-col col-span-3">
                        <div className="w-full grid grid-cols-3 gap-8">
                            {events.map((event, index) => (
                                <div key={index} className="relative overflow-hidden flex flex-col justify-between h-[28rem] rounded-xl border shadow-lg">
                                    <Image alt="event1" src={event.image_url} width={500} height={500} className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                                    <div className="absolute z-10 w-full h-[50%] bottom-0 bg-erie-black/75  space-y-2 p-6 rounded-xl">
                                        <h2 className="text-2xl font-semibold">{event.title}</h2>
                                        <p>{event.description}</p>
                                        <div className="flex flex-row justify-between text-base font-light">
                                            <span>{format(new Date(event.date), "dd-MM-yyyy HH:mm")}</span>
                                            <span>{event.location}</span>
                                        </div>
                                        <div className="flex flex-row justify-end items-center">
                                            <Button type="button" variant="secondary" onClick={() => router.push(`/events/${event.id}`)}>Buy Ticket</Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="col-span-3 flex justify-center items-center mt-12">
                        <Button type="button" variant="secondary" onClick={() => router.push('/events')}>See More</Button>
                    </div>
                </section>

                <section className="flex gap-8 justify-center items-center px-48 py-16">
                    <div className="w-full h-80 relative isolate overflow-hidden bg-gray-900 py-12 rounded-3xl shadow-lg">
                        <Image
                            alt=""
                            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
                            className="absolute inset-0 -z-10 size-full object-cover object-right md:object-center"
                        />
                        <div
                            aria-hidden="true"
                            className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
                        >
                            <div
                                style={{
                                    clipPath:
                                        'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                }}
                                className="aspect-1097/845 w-[68.5625rem] bg-linear-to-tr from-[#ff4694] to-[#776fff] opacity-20"
                            />
                        </div>
                        <div
                            aria-hidden="true"
                            className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
                        >
                            <div
                                style={{
                                    clipPath:
                                        'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                }}
                                className="aspect-1097/845 w-[68.5625rem] bg-linear-to-tr from-[#ff4694] to-[#776fff] opacity-20"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-8 px-24 py-0">
                            <div className="h-56 flex flex-col justify-between text-white">
                                <h1 className="text-5xl font-bold">GET <br /> A TICKET</h1>
                                <div>
                                    <Button type="button" variant="default" className="px-20 py-6  text-lg rounded-3xl">Buy Ticket</Button>
                                </div>
                            </div>

                            <div className="flex justify-center items-center text-left text-muted/75">
                                <h3 className="text-xl font-semibold tracking-tighter">Our platform is designed to make it easy for you to find and book events that match your interests and preferences.</h3>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}