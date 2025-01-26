'use client'

import { Plus, Calendar, Table, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import { useEffect, useState } from "react";
import useApi from "@/hooks/use-api";
import { BookingProps } from "./dashboard";

export default function Bookings() {
    const [bookings, setBookings] = useState<BookingProps[]>();
    const { fetchWithAuth } = useApi();

    const total = bookings?.reduce((acc, booking) => acc + booking.amount, 0);

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const data = await fetchWithAuth("/bookings", { withCredentials: true });
                console.log(data);
                setBookings(data);
            } catch (error) {
                console.error(error);
            }
        }

        loadBookings();
    }, [fetchWithAuth]);

    const handleAddBooking = () => {
        console.log("Add Booking");
    }

    return (
        <div className="bg-white h-72 max-h-screen col-span-3 flex flex-col rounded-xl border">
            <div className="flex flex-row justify-between items-center p-6">
                <div>
                    <h2 className="text-xl font-semibold">All Bookings List</h2>
                </div>
                <div className="flex flex-row gap-2">
                    <Button className="px-6 rounded-3xl" onClick={handleAddBooking}>Add New <Plus /></Button>
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
            <ScrollArea className="max-h-56 flex flex-col flex-1 border border-purple-400">
                <Table className="border border-red-400">
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
                        {bookings?.map((booking, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{booking.user.name}</TableCell>
                                <TableCell>{booking.ticket.event.title}</TableCell>
                                <TableCell>
                                    <div className={`flex justify-center items-center text-center font-semibold px-4 py-1 rounded-3xl ${booking.status === 'PENDING' ? "bg-gamboge/20 text-gamboge" : booking.status === "CONFIRMED" ? "bg-pine-green/20 text-pine-green" : "bg-fire-engine-red/20 text-fire-engine-red"}`}>
                                        {booking.status}
                                    </div>
                                </TableCell>
                                <TableCell>{booking.method}</TableCell>
                                <TableCell className="text-right">{booking.amount}</TableCell>
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
                            <TableCell className="text-right">MZN {total}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </ScrollArea>
        </div>
    )
}