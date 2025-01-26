'use client'

import { Plus, Calendar, Edit, Trash2, Loader } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Key, useEffect, useState } from "react"
import { Modal } from "@/components/modal"
import { EventForm } from "@/components/event-form"
import { EventProps } from "./dashboard"
import useApi from "@/hooks/use-api"
import { format } from "date-fns"


export default function Schedules() {
    const [events, setEvents] = useState<EventProps[]>([]);
    const { fetchWithAuth } = useApi();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSchedules = async () => {
            try {
                const data = await fetchWithAuth("/schedules", { withCredentials: true });
                setEvents(data || []);
                setLoading(false);
            } catch (error: any) {
                setLoading(false);
                setError(error.message || "An error occurred while fetching schedules.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadSchedules();
    }, [fetchWithAuth]);

    return (
        <div className="w-full px-4">
            <div className="flex flex-1">
                <div className="bg-white max-h-screen col-span-3 flex flex-col flex-1 rounded-xl border w-full">
                    <div className="flex flex-row justify-between items-center p-6 w-full">
                        <div>
                            <h2 className="text-xl font-semibold">All Schedules</h2>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Modal>
                                <Modal.Button>
                                    <Button className="px-6 rounded-3xl">Add New <Plus /></Button>
                                </Modal.Button>
                                <Modal.Content className="max-w-3xl justify-center items-center p-12">
                                    <EventForm />
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
                    <ScrollArea className="flex flex-col flex-1 w-full overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-2/6">Title</TableHead>
                                    <TableHead className="w-2/6">Description</TableHead>
                                    <TableHead className="w-2/6">Status</TableHead>
                                    <TableHead className="w-2/6">Date</TableHead>
                                    <TableHead className="w-3/6">Cover</TableHead>
                                    <TableHead className="w-1/6"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && <TableRow><TableCell className="flex flex-row justify-center items-center gap-1 w-full" colSpan={6}>Loading data... <Loader className="animate-spin" /></TableCell></TableRow>}
                                {!loading && !error && events?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6}>No schedules available.</TableCell>
                                    </TableRow>
                                )}
                                {events?.map((event: EventProps) => (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium">{event.title}</TableCell>
                                        <TableCell>{event.description}</TableCell>
                                        <TableCell className="flex justify-start items-center">
                                            <div className={`flex justify-center items-center text-center font-semibold px-4 py-1 rounded-3xl bg-gamboge/20 text-gamboge`}>
                                                Upcoming
                                            </div>
                                        </TableCell>
                                        <TableCell>{event.date ? format(new Date(event.date), 'yyyy-MM-dd') : "N/A"}</TableCell>
                                        <TableCell>{event.image_url}</TableCell>
                                        <TableCell className="flex flex-row">
                                            <Button variant="link" aria-label="Edit event">
                                                <Edit className="text-erie-black" />
                                            </Button>
                                            <Button variant="link" aria-label="Delete event">
                                                <Trash2 className="text-fire-engine-red" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}
