'use client'

import { Plus, Calendar, Edit, Trash2, Loader } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Modal } from "./modal"
import OnComingFeature from "./onComingFeature"
import { useEffect, useState } from "react"
import useApi from "@/hooks/use-api"
import { BookingProps } from "./dashboard"


export default function Bookings() {
    const [bookings, setBookings] = useState<BookingProps[]>([]);
    const { fetch } = useApi();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const total = bookings?.reduce((acc, booking) => acc + booking.amount, 0);

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const data = await fetch("/bookings");
                setLoading(false);
                setBookings(data);
            } catch (error: Error | any) {
                setLoading(false);
                setError(error.message || "An error occured while fetching bookings.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadBookings();
    }, [fetch]);

    return (
        <div className="w-full px-4">
            <div className="flex flex-1">
                <div className="bg-white max-h-screen col-span-3 flex flex-col flex-1 rounded-xl border w-full">
                    <div className="flex flex-row justify-between items-center p-6 w-full">
                        <div>
                            <h2 className="text-xl font-semibold">All Bookings List</h2>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Modal>
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
                    <ScrollArea className="flex flex-col flex-1 w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-3/6">Attendee</TableHead>
                                    <TableHead className="w-2/6">Event</TableHead>
                                    <TableHead className="w-2/6">Status</TableHead>
                                    <TableHead className="w-2/6">Packs</TableHead>
                                    <TableHead className="w-3/6">Method</TableHead>
                                    <TableHead className="w-2/6">Unit Price</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="w-1/6"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && <TableRow><TableCell className="flex flex-row justify-center items-center gap-1 w-full" colSpan={7}>Loading data... <Loader className="animate-spin" /></TableCell></TableRow>}
                                {!loading && !error && bookings?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6}>No booking available.</TableCell>
                                    </TableRow>
                                )}
                                {bookings?.map((booking, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{booking.user.name}</TableCell>
                                        <TableCell>{booking.ticket.event.title}</TableCell>
                                        <TableCell>
                                            <div className={`flex justify-center items-center text-center font-semibold px-4 py-1 rounded-3xl ${booking.status === 'PENDING' ? "bg-gamboge/20 text-gamboge" : booking.status === "CONFIRMED" ? "bg-pine-green/20 text-pine-green" : "bg-fire-engine-red/20 text-fire-engine-red"}`}>
                                                {booking.status}
                                            </div>
                                        </TableCell>
                                        <TableCell>{Math.floor(booking.amount / booking.ticket.price)}</TableCell>
                                        <TableCell>{booking.method}</TableCell>
                                        <TableCell>${booking.ticket.price}</TableCell>
                                        <TableCell className="text-right">${booking.amount}</TableCell>
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
                                    <TableCell colSpan={6}>Total</TableCell>
                                    <TableCell className="text-right">${total}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}
