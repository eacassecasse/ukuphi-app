'use client'

import { Plus, Calendar, Edit, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Modal } from "./modal"
import OnComingFeature from "./onComingFeature"

const bookings = [
    {
        attendee_name: "Edmilson de Azevedo Cassecasse",
        eventTitle: "Dance Night Extravaganza",
        paymentStatus: "Paid",
        unitPrice: "$25",
        packs: 10,
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        attendee_name: "INV002",
        eventTitle: "Dance Night Extravaganza",
        paymentStatus: "Pending",
        unitPrice: "$15",
        packs: 10,
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        attendee_name: "INV003",
        eventTitle: "Country Fiesta",
        paymentStatus: "Unpaid",
        unitPrice: "$35",
        packs: 10,
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        attendee_name: "INV004",
        eventTitle: "Epic Music Festival",
        paymentStatus: "Paid",
        unitPrice: "$45",
        packs: 10,
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        attendee_name: "INV005",
        eventTitle: "Summer Beats",
        paymentStatus: "Paid",
        unitPrice: "$55",
        packs: 10,
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        attendee_name: "INV006",
        eventTitle: "Rock Fest",
        paymentStatus: "Pending",
        unitPrice: "$20",
        packs: 10,
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        attendee_name: "INV007",
        eventTitle: "Country Fiesta",
        paymentStatus: "Unpaid",
        unitPrice: "$30",
        packs: 10,
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
]

export default function Bookings() {

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
                                {bookings.map((booking, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{booking.attendee_name}</TableCell>
                                        <TableCell>{booking.eventTitle}</TableCell>
                                        <TableCell>
                                            <div className={`flex justify-center items-center text-center font-semibold px-4 py-1 rounded-3xl ${booking.paymentStatus === 'Pending' ? "bg-gamboge/20 text-gamboge" : booking.paymentStatus === "Paid" ? "bg-pine-green/20 text-pine-green" : "bg-fire-engine-red/20 text-fire-engine-red"}`}>
                                                {booking.paymentStatus}
                                            </div>
                                        </TableCell>
                                        <TableCell>{booking.packs}</TableCell>
                                        <TableCell>{booking.paymentMethod}</TableCell>
                                        <TableCell>{booking.unitPrice}</TableCell>
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
        </div>
    )
}
