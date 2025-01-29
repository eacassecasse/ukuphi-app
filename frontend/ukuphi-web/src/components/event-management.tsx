'use client'

import { Plus, Calendar, Edit, Trash2, MoreHorizontal, Loader } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Key, useEffect, useState } from "react"
import { MapProvider } from "@/providers/map-provider"
import { MapComponent } from '@/components/map'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { EventForm } from "@/components/event-form"
import { Modal } from "@/components/modal"
import useApi from "@/hooks/use-api"
import { format } from "date-fns"

export interface EventProps {
    title: string;
    description: string;
    location: string;
    creation_date: string;
    date: string;
    tickets_sold: number;
    image_url?: string;
    main_artist: {
        name: string;
        image_url: string;
    }
}

const stats = [
    {
        gradient: "bg-gradient-to-r from-dark-purple from-[47%] to-tyrian-purple to-[100%]",
        title: "Total Events",
        value: 150,
        footer: "All Successful hosted events",
    },
    {
        gradient: "bg-gradient-to-r from-magenta-haze from-[34%] to-burnt-sienna to-[100%]",
        title: "Upcoming Events",
        value: 65,
        footer: "All Scheduled events"
    },
    {
        gradient: "bg-gradient-to-r from-amethyst from-[10%] to-glaucous to-[100%]",
        title: "On Hold Events",
        value: 22,
        footer: "Events that are currently on hold"
    },
    {
        gradient: "bg-gradient-to-r from-dark-purple from-[47%] to-tyrian-purple to-[100%]",
        title: "Sold Out Events",
        value: 35,
        footer: "Events that are fully booked"
    }
]



export default function EventList() {
    const { fetch } = useApi();
    const [selectedEvent, setSelectedEvent] = useState<EventProps>();
    const [events, setEvents] = useState<EventProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleSelectedEvent = (event: EventProps) => {
        setSelectedEvent(event);
    }

    const handleNewEvent = (newEvent: EventProps) => {
        setEvents((preEvents) => [...preEvents, newEvent]);
    }

    useEffect(() => {
        const loadSchedules = async () => {
            try {
                const data = await fetch("/schedules");
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

        loadSchedules();
    }, [fetch]);

    const locations = events && events.map(event => event.location);

    return (
        <div className="w-full flex flex-col flex-1 px-4 space-y-4">
            <div className="grid grid-cols-4 space-x-4">
                {
                    stats.map((stat) => (
                        <Card key={stat.title} className={`${stat.gradient} text-primary-foreground rounded-xl space-y-1 py-2 px-4 border`}>
                            <CardHeader className="flex flex-row justify-between items-center p-0">
                                <h4 className="text-sm font-semibold">{stat.title}</h4>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <MoreHorizontal className="text-xs font-light" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Daily</DropdownMenuItem>
                                        <DropdownMenuItem>Weekly</DropdownMenuItem>
                                        <DropdownMenuItem>Monthly</DropdownMenuItem>
                                        <DropdownMenuItem>Yearly</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent className="space-y-1 p-0">
                                <h2 className="text-2xl font-semibold">{stat.value}</h2>
                            </CardContent>
                            <CardFooter className="text-sm p-0 mt-4">
                                {stat.footer}
                            </CardFooter>
                        </Card>
                    ))
                }
            </div>
            <div className="h-full flex flex-row flex-1 gap-4">
                <div className="bg-white max-h-screen flex flex-col flex-1 rounded-xl border">
                    <div className="flex flex-row justify-between items-center p-6 w-full">
                        <div>
                            <h2 className="text-2xl font-semibold">All Events</h2>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Modal>
                                <Modal.Button>
                                    <Button className="px-6 rounded-3xl">Add New <Plus /></Button>
                                </Modal.Button>
                                <Modal.Content className="max-w-3xl justify-center items-center p-12">
                                    <EventForm onEventCreated={handleNewEvent} />
                                </Modal.Content>
                            </Modal>
                            <Select>
                                <SelectTrigger className="flex-1 gap-1 px-6 rounded-3xl">
                                    <Calendar />
                                    <SelectValue placeholder="Monthly" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="day">Daily</SelectItem>
                                        <SelectItem value="week">Weekly</SelectItem>
                                        <SelectItem value="month">Monthly</SelectItem>
                                        <SelectItem value="year">Annual</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <ScrollArea className="flex flex-col flex-1 w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-2/6 px-6">Title</TableHead>
                                    <TableHead className="w-2/6">Description</TableHead>
                                    <TableHead className="w-1/6">Location</TableHead>
                                    <TableHead className="w-1/6">Date</TableHead>
                                    <TableHead className="w-2/6">Tickets Sold</TableHead>
                                    <TableHead className="w-1/6 px-6"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && <TableRow><TableCell className="flex flex-row justify-center items-center gap-1 w-full" colSpan={7}>Loading data... <Loader className="animate-spin" /></TableCell></TableRow>}
                                {!loading && !error && events?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6}>No event scheduled.</TableCell>
                                    </TableRow>
                                )}
                                {events?.map((event, index: Key | null | undefined) => (
                                    <TableRow key={index} onClick={() => handleSelectedEvent(event)}>
                                        <TableCell className="font-medium px-6">{event.title}</TableCell>
                                        <TableCell>{event.description}</TableCell>
                                        <TableCell>{event.location}</TableCell>
                                        <TableCell>{format(new Date(event.date), 'yyyy-MM-dd')}</TableCell>
                                        <TableCell>{event.tickets_sold}</TableCell>
                                        <TableCell className="flex flex-row px-6">
                                            <Button variant="link">
                                                <Edit className="text-erie-black" />
                                            </Button>
                                            <Button variant="link">
                                                <Trash2 className="text-fire-engine-red" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
                <MapProvider>
                    <div className="flex flex-col w-[22rem] max-w-[22rem] gap-4 bg-white rounded-xl p-4">
                        <div className="aspect-square flex justify-center items-center rounded-xl bg-muted/50">
                            {selectedEvent ? (<MapComponent height="50vh" location={selectedEvent.location} />) : (<MapComponent height="50vh" location={locations ?? []} />)}
                        </div>
                    </div>
                </MapProvider>
            </div>
        </div>
    )
}
