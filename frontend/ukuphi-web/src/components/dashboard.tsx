'use client'

import { MoreHorizontal, Plus, Calendar, Edit, Trash2, Loader, } from "lucide-react"
import Image from 'next/image'
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import EventList from "@/components/dashboard-events"
import Activity from "@/components/dashboard-activities"
import { Banner } from "@/components/dashboard-carousel"
import { Modal } from "@/components/modal"
import { useEffect, useState } from "react"
import OnComingFeature from "./onComingFeature"
import useApi from "@/hooks/use-api"
import { NotificationProps } from "./dashboard-header"


const stats = [
    {
        gradient: "bg-gradient-to-r from-magenta-haze from-[34%] to-burnt-sienna to-[100%]",
        title: "Total Earnings",
        value: 15000,
        total: 50000,
        icon: "summer_5181124.png",
        rotate: 30,
        unit: "$",
    },
    {
        gradient: "bg-gradient-to-r from-dark-purple from-[47%] to-tyrian-purple to-[100%]",
        title: "Ticket Sales",
        value: 350,
        total: 500,
        icon: "tuvalu_18282394.png",
        rotate: -30,
        unit: ""
    },
    {
        gradient: "bg-gradient-to-r from-amethyst from-[10%] to-glaucous to-[100%]",
        title: "Read Notifications",
        value: 22,
        total: 400,
        icon: "number-1_16900393.png",
        rotate: -30,
        unit: ""
    }
]

export interface EventProps {
    id: string;
    description: string;
    title: string;
    location: string;
    creation_date: string;
    date: string;
    image_url: string;
    tickets_sold: number;
    main_artist?: {
        name: string;
        image_url: string;
    }
}

export interface BookingProps {
    id: string,
    userId: string,
    ticketId: string,
    bookedById?: string,
    amount: number,
    method: string,
    status: string,
    qr_code: string,
    created_at: string,
    guestName?: string,
    guestEmail?: string,
    guestPhone?: string,
    ticket: {
        id: string,
        eventId: string,
        type: string,
        price: number,
        existingQuantity: number,
        event: {
            id: string,
            organizerId: string,
            title: string,
            description: string,
            location: string,
            image_url: string,
            tickets_sold: number,
            date: string
        }
    },
    user: {
        id: string,
        name: string,
        email: string,
        phone: string,
        password: string,
        role: string,
        verified: boolean,
        rank: string
    }
}



export default function Dashboard() {
    const [open, setOpen] = useState(false)
    const [bookings, setBookings] = useState<BookingProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { fetch } = useApi();

    const total = bookings?.reduce((acc, booking) => acc + booking.amount, 0);

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const data = await fetch("/bookings");
                setLoading(false);
                setBookings(data);
            } catch (error: any) {
                setLoading(false);
                setError(error.message || "An error occurred while fetching bookings");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadBookings();
    }, [fetch]);


    return (
        <div className="grid auto-rows-min gap-4 px-4 md:grid-cols-3">
            <div className="md:col-span-2 grid sm:grid-cols-3 gap-4">
                {
                    stats.map((stat) => (
                        <Card key={stat.title} className={`${stat.gradient} text-primary-foreground rounded-xl space-y-1 pt-2 px-4 border`}>
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
                                <h2 className="text-2xl font-semibold">{stat.unit}{stat.value}</h2>
                                <p className="text-sm">
                                    {Math.round((stat.value / stat.total) * 100)}%
                                </p>
                            </CardContent>
                            <CardFooter className="self-end place-self-end p-0">
                                <Image
                                    aria-hidden
                                    src={`/${stat.icon}`}
                                    alt="File icon"
                                    width={64}
                                    height={64}
                                    className={`transform rotate-[${stat.rotate}]`}
                                />
                            </CardFooter>
                        </Card>
                    ))
                }
                <EventList className="col-span-3 h-64 md:min-h-min" />
                <div className="bg-white h-72 max-h-screen col-span-3 flex flex-col rounded-xl border">
                    <div className="flex flex-row justify-between items-center p-6">
                        <div>
                            <h2 className="text-xl font-semibold">All Bookings List</h2>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Modal open={open} onOpenChange={setOpen}>
                                <Modal.Button>
                                    <Button className="px-6 rounded-3xl">Add New <Plus /></Button>
                                </Modal.Button>
                                <Modal.Content className="max-w-md p-12">
                                    <OnComingFeature />
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
                    <ScrollArea className="max-h-56 flex flex-col flex-1">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Attendee</TableHead>
                                    <TableHead>Event</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && <TableRow><TableCell className="flex flex-row justify-center items-center gap-1 w-full" colSpan={7}>Loading bookings... <Loader className="animate-spin" /></TableCell></TableRow>}
                                {!loading && !error && bookings?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6}>No booking available.</TableCell>
                                    </TableRow>
                                )}
                                {bookings.map((booking, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{booking.user.name}</TableCell>
                                        <TableCell>{booking.ticket.event.title}</TableCell>
                                        <TableCell>
                                            <div className={`flex justify-center items-center text-center font-semibold px-4 py-1 rounded-3xl ${booking.status === 'PENDING' ? "bg-gamboge/20 text-gamboge" : booking.status === "CONFIRMED" ? "bg-pine-green/20 text-pine-green" : "bg-fire-engine-red/20 text-fire-engine-red"}`}>
                                                {booking.status}
                                            </div>
                                        </TableCell>
                                        <TableCell>{booking.method}</TableCell>
                                        <TableCell className="text-right">$ {booking.amount}</TableCell>
                                        <TableCell className="flex flex-row">
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
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={4}>Total</TableCell>
                                    <TableCell className="text-right">${total}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </ScrollArea>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <Banner />
                <Activity />
            </div>
        </div>
    )
}
