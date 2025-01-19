import { MapProvider } from "@/providers/map-provider";
import ProgressBar from "@/components/dashboard-progressbar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Map } from '@/components/map'
import { useState } from "react";

interface EventProps {
    title: string;
    location: string;
    creation_date: string;
    date: string;
    tickets_sold: number;
    main_artist: {
        name: string;
        image_url: string;
    }
}

const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
    const [month, day] = formattedDate.split(' ');
    return { day, month }
}

export default function EventList({ events, className, ...props }: { events: EventProps[]; className?: string }) {
    const [selectedEvent, setSelectedEvent] = useState<EventProps>();
    const today = new Date();

    const handleSelectedEvent = (event: EventProps) => {
        setSelectedEvent(event);
    }

    return (
        <div className={`grid grid-cols-2 rounded-xl gap-4 p-6 bg-white ${className}`} {...props}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold">Event List</h2>
                        <p className="text-xs">Today Active Events 120</p>
                    </div>
                    <Select>
                        <SelectTrigger className="w-2/6 rounded-3xl">
                            <SelectValue placeholder="Active" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="apple">All</SelectItem>
                                <SelectItem value="banana">Realized</SelectItem>
                                <SelectItem value="blueberry">Canceled</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <ScrollArea className="max-h-56 flex flex-col flex-1">
                    <div className="flex flex-col gap-2">
                        {
                            events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event, index) => {
                                const creationDate = new Date(event.creation_date);
                                const eventDate = new Date(event.date);

                                const totalDays = Math.round((eventDate.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24));
                                const elapsedDays = Math.round((today.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24));
                                const currentDay = Math.max(elapsedDays, 0);

                                const shortTitle = event.title.split(" ").slice(0, 4).join(" ");

                                const isSelected = selectedEvent?.title === event.title

                                return (
                                    <Card key={index} className={`flex flex-row justify-between items-center px-4 rounded-xl shadown-md ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-primary hover:text-primary-foreground"}`} onClick={() => handleSelectedEvent(event)}>
                                        <CardHeader className="flex flex-col gap-0 p-2">
                                            <h3 className="font-semibold">{shortTitle}</h3>
                                            <p className="text-sm">{event.location}</p>
                                        </CardHeader>
                                        <CardContent className="flex flex-row justify-center items-center gap-2 p-0">
                                            <div className="flex flex-col justify-center items-center text-xs font-semibold">
                                                <h3>{formatDate(eventDate).day}</h3>
                                                <h3>{formatDate(eventDate).month.toLocaleUpperCase()}</h3>
                                            </div>
                                            <div className=" ml-auto">
                                                <ProgressBar value={currentDay} total={totalDays} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        }
                    </div>
                </ScrollArea>
            </div>
            <MapProvider>
                <div className="flex flex-col gap-4">
                    {
                        selectedEvent ? (
                            <>
                                <div className="flex flex-row justify-between items-center gap-3">
                                    <div className="flex items-center space-x-2">
                                        <Skeleton className="h-14 w-14 rounded-full" />
                                        <div className="flex flex-col space-y-2">
                                            <Skeleton className="h-4 w-36" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    </div>
                                    <Separator orientation="vertical" />
                                    <div className="flex flex-col space-y-2">
                                        <Skeleton className="h-4 w-12" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <Map location={selectedEvent.location} />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-row justify-between items-center gap-3">
                                    <div className="flex items-center space-x-2">
                                        <Skeleton className="h-14 w-14 rounded-full" />
                                        <div className="flex flex-col space-y-2">
                                            <Skeleton className="h-4 w-36" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    </div>
                                    <Separator orientation="vertical" />
                                    <div className="flex flex-col space-y-2">
                                        <Skeleton className="h-4 w-12" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <Skeleton className="h-full w-full rounded-xl" />
                                </div>
                            </>
                        )
                    }
                </div>
            </MapProvider>
        </div>
    )
}