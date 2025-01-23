'use client'

import { MoreHorizontal, Plus, Calendar, Edit, Trash2, } from "lucide-react"
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
import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { EventForm } from "./event-form"
import { RegisterForm } from "./register-form"
import OnComingFeature from "./onComingFeature"


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

const events = [
    {
        title: "Dance Night Extravaganza",
        location: "Los Angeles",
        creation_date: "2025-01-01",
        date: "2025-01-25",
        tickets_sold: 372,
        main_artist: {
            name: "Adele",
            image_url: "https://example.com/image1.jpg"
        }
    },
    {
        title: "Country Fiesta",
        location: "Austin",
        creation_date: "2025-01-05",
        date: "2025-02-15",
        tickets_sold: 519,
        main_artist: {
            name: "Beyoncé",
            image_url: "https://example.com/image2.jpg"
        }
    },
    {
        title: "Epic Music Festival",
        location: "New York",
        creation_date: "2025-01-01",
        date: "2025-02-20",
        tickets_sold: 644,
        main_artist: {
            name: "Taylor Swift",
            image_url: "https://example.com/image3.jpg"
        }
    },
    {
        title: "Summer Beats",
        location: "Los Angeles",
        creation_date: "2025-01-10",
        date: "2025-01-30",
        tickets_sold: 236,
        main_artist: {
            name: "Drake",
            image_url: "https://example.com/image4.jpg"
        }
    },
    {
        title: "Rock Fest",
        location: "San Francisco",
        creation_date: "2025-01-15",
        date: "2025-02-03",
        tickets_sold: 162,
        main_artist: {
            name: "Imagine Dragons",
            image_url: "https://example.com/image5.jpg"
        }
    }
]

const bookings = [
    {
        attendee_name: "INV001",
        eventTitle: "Dance Night Extravaganza",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        attendee_name: "INV002",
        eventTitle: "Dance Night Extravaganza",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        attendee_name: "INV003",
        eventTitle: "Country Fiesta",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        attendee_name: "INV004",
        eventTitle: "Epic Music Festival",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        attendee_name: "INV005",
        eventTitle: "Summer Beats",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        attendee_name: "INV006",
        eventTitle: "Rock Fest",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        attendee_name: "INV007",
        eventTitle: "Country Fiesta",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
]

const notifications = [
    {
        type: "info",
        content: "Your profile has been updated successfully.",
        time: "09:15 AM",
        status: "read"
    },
    {
        type: "warning",
        content: "Your subscription is about to expire in 3 days.",
        time: "11:30 AM",
        status: "read"
    },
    {
        type: "error",
        content: "Failed to upload the document. Please try again.",
        time: "01:45 PM",
        status: "unread"
    },
    {
        type: "success",
        content: "Payment of $50 has been processed successfully.",
        time: "03:20 PM",
        status: "read"
    },
    {
        type: "info",
        content: "A new event has been added to your calendar.",
        time: "04:10 PM",
        status: "unread"
    },
    {
        type: "warning",
        content: "Your account password was changed recently.",
        time: "06:50 PM",
        status: "unread"
    },
];



export default function Dashboard() {
    const [open, setOpen] = useState(false)
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
                <EventList className="col-span-3 h-64 md:min-h-min" events={events} />
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
                                {bookings.map((booking, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{booking.attendee_name}</TableCell>
                                        <TableCell>{booking.eventTitle}</TableCell>
                                        <TableCell>
                                            <div className={`flex justify-center items-center text-center font-semibold px-4 py-1 rounded-3xl ${booking.paymentStatus === 'Pending' ? "bg-gamboge/20 text-gamboge" : booking.paymentStatus === "Paid" ? "bg-pine-green/20 text-pine-green" : "bg-fire-engine-red/20 text-fire-engine-red"}`}>
                                                {booking.paymentStatus}
                                            </div>
                                        </TableCell>
                                        <TableCell>{booking.paymentMethod}</TableCell>
                                        <TableCell className="text-right">{booking.totalAmount}</TableCell>
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
                                    <TableCell className="text-right">$2,500.00</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </ScrollArea>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <Banner />
                <Activity activities={notifications} />
            </div>
        </div>
    )
}
