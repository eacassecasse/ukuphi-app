"use client";

import { EventProps } from "@/components/dashboard";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Loader, MapPin } from "lucide-react";
import { MapComponent } from "@/components/map";
import { MapProvider } from "@/providers/map-provider";
import { Button } from "@/components/ui/button";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { useEffect, useState } from "react";
import useApi from "@/hooks/use-api";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface TicketProps {
    id: string;
    type: string;
    price: number;
    existingQuantity: number;
}

export default function Event() {
    const searchParams = useSearchParams();
    const { fetch } = useApi();
    const [tickets, setTickets] = useState<TicketProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState<{ [key: string]: number }>({});

    const eventParam = searchParams.get("event");
    const event: EventProps = eventParam ? JSON.parse(decodeURIComponent(eventParam)) : null;

    useEffect(() => {
        const loadTickets = async () => {
            try {
                const data = await fetch(`/events/${event.id}/tickets`);
                setTickets(data);
            } catch (error: any) {
                setError(error.message || "An error occurred while fetching tickets");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, [fetch, event.id]);

    const handlePurchase = async (ticketId: string) => {
        if (!selectedAmount[ticketId] || selectedAmount[ticketId] <= 0) return;

        try {
            await fetch(`/tickets/${ticketId}/payments`, {
                method: 'POST',
                data: {
                    amount: selectedAmount[ticketId],
                    description: "DEBIT_CARD",
                },
            });

            // Clear form input after successful purchase
            setSelectedAmount((prev) => ({ ...prev, [ticketId]: 0 }));

            toast({
                title: "Ticket Purchase",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-pine-green p-4">
                        <code className="text-white">{selectedAmount[ticketId]} purchased successfully</code>
                    </pre>
                ),
                duration: 5000,
            });
        } catch (error) {
            console.error("Error purchasing ticket:", error);
            alert("Failed to purchase ticket. Please try again.");
        }
    };

    return (
        <div>
            <div className="relative h-[40rem]">
                <Image src={event.image_url} alt={event.title} width={500} height={500} className="absolute w-full h-full object-cover inset-0 z-10" />
            </div>
            <div className="flex flex-col space-y-8 px-24 py-16">
                <h1 className="text-5xl font-bold mb-8">{event.title}</h1>
                <div className="grid grid-cols-2 space-x-4">
                    <div className="flex flex-col text-lg font-light">
                        <p>{format(new Date(event.date), "PP")}</p>
                        <p>{format(new Date(event.date), "HH:mm")}</p>
                        <p className="flex flex-row flex-nowrap items-center text-lg font-light gap-1 mt-4">
                            <MapPin />
                            {event.location}
                        </p>
                    </div>
                    <div className="flex flex-col text-lg font-light space-y-8">
                        <p>{event.description}</p>
                    </div>
                </div>
                <MapProvider>
                    <div className="h-96">
                        <MapComponent location={event.location} />
                    </div>
                </MapProvider>
                <div className="space-y-8 py-12">
                    <h2 className="text-5xl font-semibold">Tickets</h2>
                    <div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {error && (
                                    <TableRow>
                                        <TableCell colSpan={5}>No data found</TableCell>
                                    </TableRow>
                                )}
                                {!error && loading && (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            Loading... <Loader className="animate-spin" />
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!error &&
                                    !loading &&
                                    tickets.map((ticket) => (
                                        <TableRow key={ticket.id}>
                                            <TableCell>{ticket.type}</TableCell>
                                            <TableCell>${ticket.price}</TableCell>
                                            <TableCell>{ticket.existingQuantity > 0 ? "Available" : "Sold Out"}</TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max={ticket.existingQuantity}
                                                    value={selectedAmount[ticket.id] || ""}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value, 10);
                                                        setSelectedAmount((prev) => ({
                                                            ...prev,
                                                            [ticket.id]: isNaN(value) ? 0 : value,
                                                        }));
                                                    }}
                                                    disabled={ticket.existingQuantity === 0}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="default"
                                                    disabled={ticket.existingQuantity === 0 || !selectedAmount[ticket.id]}
                                                    onClick={() => handlePurchase(ticket.id)}
                                                >
                                                    Purchase
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}
