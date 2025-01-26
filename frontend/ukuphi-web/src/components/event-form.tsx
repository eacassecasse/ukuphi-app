"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Modal } from "@/components/modal"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { CalendarIcon, ClipboardPaste, ClockIcon, Edit, PlusCircle, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { generateTimeOptions } from "@/utils/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { MapProvider } from "@/providers/map-provider"
import { MapComponent } from '@/components/map'

import React, { useEffect, useMemo, useState } from "react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import useApi from "@/hooks/use-api"
import { cloudinaryService } from "@/lib/cloudinary"
import { toast } from "@/hooks/use-toast"


const formSchema = z.object({
    title: z
        .string({
            required_error: "Title is required.",
        })
        .min(2, {
            message: "Title must be at least 2 characters.",
        }),
    description: z.string().max(195, {
        message: "Description must be at most 195 characters.",
    }),
    cover: z.any()
        .refine((files) => files instanceof FileList, {
            message: "Cover must be a valid file.",
        })
        .refine((files) => files.length > 0, {
            message: "A cover file is required.",
        })
        .refine((files) => Array.from(files).every((file) => file.size < 5 * 1024 * 1024), {
            message: "Cover file must be smaller than 5MB.",
        })
        .refine((files) => Array.from(files).every((file) => ["image/jpeg", "image/png"].includes(file.type)), {
            message: "Only JPEG and PNG files are allowed",
        }),
    datetime: z.object({
        date: z.date().optional(),
        startAt: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
            message: "Time must be in HH:MM format (24-hour).",
        }).optional(),
        endAt: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
            message: "Time must be in HH:MM format (24-hour).",
        }).optional(),
    }),
    location: z.object({
        type: z.enum(["physical", "virtual"]),
        address: z.string().optional(),
        link: z.string().optional(),
    }).refine((data) => (data.type === "physical" && !!data.address) || (data.type === "virtual" && !!data.link && /^https?:\/\//.test(data.link)), {
        message: "Address or Link is required based on the location type",
        path: ["location"],
    }),
    ticket: z.object({
        type: z.string().optional(),
        price: z.string().optional(),
        existingQuantity: z.string().optional(),
    }).optional(),
    tickets: z.array(
        z.object({
            type: z.string().optional(),
            price: z.string().optional(),
            existingQuantity: z.string().optional(),
        })
    ).optional()
})

export function EventForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            cover: undefined,
            datetime: {
                date: new Date(),
                startAt: "12:00",
                endAt: "00:00",
            },
            location: {
                type: "physical",
                address: "",
                link: "",
            },
            ticket: {
                type: "",
                price: "0",
                existingQuantity: "0",
            }
        },
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [tickets, setTickets] = useState<{ type: string; price: string; quantity: string }[]>([])
    const [ticketType, setTicketType] = useState<string | null>(null);
    const [ticketPrice, setTicketPrice] = useState<string | null>(null);
    const [ticketQuantity, setTicketQuantity] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { fetchWithAuth } = useApi();

    const locationType = form.watch("location.type");
    const address = useMemo(() => form.watch("location.address"), [form]);
    const timeOptions = generateTimeOptions();
    const fileRef = form.register("cover");

    useEffect(() => {
        if (locationType === "physical") {
            form.setValue("location.link", "https://example.com");
        }
        else if (locationType === "virtual") {
            form.setValue("location.address", "");
        }
    }, [locationType, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const formData = { ...values, tickets }
            const payload = await formSchema.parseAsync(formData);
            const file = payload.cover[0];
            const startAt = payload.datetime.startAt;
            let imageUrl;
            let [hours, minutes] = ["12", "00"];


            if (startAt && typeof startAt === "string") {
                [hours, minutes] = startAt?.split(":")
            }

            if (file) {
                imageUrl = await cloudinaryService.upload(file);
            }

            const data = await fetchWithAuth('/events', {
                method: 'POST',
                data: {
                    title: payload.title,
                    description: payload.description,
                    image_url: imageUrl,
                    date: payload.datetime.date && new Date(`${payload.datetime.date.toISOString().split('T')[0]}T${hours}:${minutes}:00`), // create a datetime with date and startAt
                    location: payload.location.address || payload.location.link,
                },
            });

            if (payload.tickets && payload.tickets.length > 0) {
                try {
                    const requests = payload.tickets.map(async (ticket) => {
                        const dat = await fetchWithAuth(`events/${data.id}/tickets`, {
                            method: 'POST',
                            data: {
                                type: ticket.type,
                                price: ticket.price,
                                existingQuantity: ticket.existingQuantity,
                            },
                        });

                        return dat;
                    })

                    const responses = await Promise.all(requests);
                    toast({
                        title: "Tickets",
                        description: (
                            <pre className="mt-2 w-[340px] rounded-md bg-fire-engine-red p-4">
                                <code className="text-white">Tickets created successfully</code>
                            </pre>
                        ),
                        duration: 5000,
                    })
                } catch (error) {
                    toast({
                        title: "Ticket creation failed",
                        description: (
                            <pre className="mt-2 w-[340px] rounded-md bg-fire-engine-red p-4">
                                <code className="text-white">{(error as Error).message || "Unknown error occurred"}</code>
                            </pre>
                        ),
                        duration: 5000,
                    })
                    console.log(error);
                }
            }
            setLoading(false);
            toast({
                title: "Event creation",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-fire-engine-red p-4">
                        <code className="text-white">Event created successfully</code>
                    </pre>
                ),
                duration: 5000,
            })
        } catch (error: any) {
            setLoading(false);
            setError(error.message || "An error occurred while creating the event.");
            toast({
                title: "Event creation failed",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-fire-engine-red p-4">
                        <code className="text-white">{(error as Error).message || "Unknown error occurred"}</code>
                    </pre>
                ),
                duration: 5000,
            })
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log(errors);
            })}>
                <div className="grid grid-cols-2 space-x-4 space-y-8">
                    <FormField
                        control={form.control}
                        name="cover"
                        render={({ field }) => {

                            return (
                                <FormItem className="col-span-2">
                                    <FormLabel className={`flex items-center justify-center w-full h-80 gap-1 border-2 border-dashed rounded-md cursor-pointer ${preview ? `border-transparent bg-cover bg-center` : "border-gray-400 hover:border-cyan-500 hover:bg-cyan-50"}`} style={{
                                        backgroundImage: preview ? `url(${preview})` : undefined,
                                    }}>
                                        {!preview && (
                                            <>
                                                <PlusCircle />
                                                <span className="text-lg font-semibold">Add event cover</span>
                                            </>
                                        )}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            accept="image/*"
                                            type="file"
                                            {...fileRef}
                                            className="hidden"
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                const file = event.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = () => {
                                                        setPreview(reader.result as string); // Set preview to the image data URL
                                                        field.onChange(event.target.files);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }} />

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Event Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="What is the event name?" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    <div className="col-span-2 flex flex-row justify-between space-x-6">
                        <FormField
                            control={form.control}
                            name="datetime.date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-3">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[14rem] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <div className="flex flex-row space-x-4">
                            <FormField
                                control={form.control}
                                name="datetime.startAt"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row justify-center items-end space-x-2">
                                        <FormLabel className="text-nowrap mb-3">Starts at</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[8rem] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            field.value
                                                        ) : (
                                                            <span>Pick a time</span>
                                                        )}
                                                        <ClockIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <ScrollArea className="h-48 w-[6rem]">
                                                    <div className="flex flex-col space-y-2">
                                                        {
                                                            timeOptions.map((option) => (
                                                                <Button key={option} variant={option === field.value ? "default" : "ghost"} onClick={() => { field.onChange(option); form.setValue("datetime.startAt", option) }}>{option}</Button>
                                                            ))
                                                        }
                                                    </div>
                                                </ScrollArea>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <FormField
                                control={form.control}
                                name="datetime.endAt"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row justify-center items-end space-x-2">
                                        <FormLabel className="text-nowrap mb-3">Ends at</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[8rem] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            field.value
                                                        ) : (
                                                            <span>Pick a time</span>
                                                        )}
                                                        <ClockIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <ScrollArea className="h-48 w-[6rem]">
                                                    <div className="flex flex-col space-y-2">
                                                        {
                                                            timeOptions.map((option) => (
                                                                <Button key={option} variant={option === field.value ? "default" : "ghost"} onClick={() => { field.onChange(option); form.setValue("datetime.endAt", option) }}>{option}</Button>
                                                            ))
                                                        }
                                                    </div>
                                                </ScrollArea>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <Card>
                            <CardContent className="px-6 py-2 bg-byzantine-blue/10 rounded-md">
                                <div className="space-y-2">
                                    <p className="text-sm text-primary">
                                        <span className="font-semibold">Notice: </span>
                                        Normally the start time can be delayed due to the late arriving of the participants.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="col-span-2">
                        <FormField
                            control={form.control}
                            name="location.type"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                    <FormLabel>How will the event take place? </FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={(value: "physical" | "virtual") => {
                                                field.onChange(value);
                                                form.setValue("location.type", value)
                                            }}
                                            defaultValue={field.value}
                                            className="flex flex-row items-center space-x-10"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="physical" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    At a physical location
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="virtual" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Through virtual platforms
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </div>

                    <div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Add a description to encourage customers to attend to the event." className="h-60 resize-none" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </div>
                    <div className="">
                        {locationType === "physical" && (
                            <FormField
                                control={form.control}
                                name="location.address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <div className="relative flex flex-col items-center justify-center gap-2">
                                                <Input placeholder="Where will the event take place?" className="pl-10" {...field} disabled={form.watch("location.type") !== "physical"} />
                                                <div className="absolute left-3 top-5 -translate-y-1/2 text-red-400">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0c3.59 0 6.5-1.567 6.5-5C18.5 4.567 15.59 3 12 3 8.41 3 5.5 4.567 5.5 8c0 3.433 2.91 5 6.5 5zm0 0V21"
                                                        />
                                                    </svg>
                                                </div>
                                                <MapProvider>
                                                    {
                                                        address?.trim() && <MapComponent location={address.trim()} />
                                                    }
                                                </MapProvider>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {locationType === "virtual" && (
                            <FormField
                                control={form.control}
                                name="location.link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Link</FormLabel>
                                        <FormControl>
                                            <div className="relative flex flex-row items-center gap-2">
                                                <Input placeholder="Link to the event" className="pr-20" {...field} disabled={form.watch("location.type") !== "virtual"} />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-sm"
                                                    onClick={() => {
                                                        navigator.clipboard.readText().then((text) => {
                                                            field.onChange(text);
                                                            form.setValue("location.link", text);
                                                        });
                                                    }}><ClipboardPaste /></Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 space-x-2 space-y-6">
                    <FormField
                        control={form.control}
                        name="ticket.type"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                    <Input placeholder="What is the ticket type (standard, VIP...)?" {...field} onChange={(e) => {
                                        field.onChange(e.target.value);
                                        form.setValue("ticket.type", e.target.value);
                                        setTicketType(e.target.value);
                                    }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="ticket.price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input placeholder="How much does the ticket cost?" type="number" {...field} onChange={(e) => {
                                        field.onChange(e.target.value);
                                        setTicketPrice(e.target.value);
                                    }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="ticket.existingQuantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Available Tickets</FormLabel>
                                <FormControl>
                                    <Input placeholder="How many tickets/seats are available for this event?" type="number" {...field} onChange={(e) => {
                                        field.onChange(e.target.value);
                                        setTicketQuantity(e.target.value);
                                    }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <div className="col-span-2">
                        <Button className="flex w-full" type="button" variant="default" onClick={() => {
                            if (ticketType && ticketPrice && ticketQuantity) {
                                setTickets((prev) => [
                                    ...prev,
                                    { type: ticketType, price: parseFloat(ticketPrice).toPrecision(2), quantity: parseInt(ticketQuantity).toFixed() },
                                ]);
                                // Clear the fields
                                setTicketType(null);
                                setTicketPrice(null);
                                setTicketQuantity(null);
                                form.resetField("ticket.type");
                                form.resetField("ticket.price");
                                form.resetField("ticket.existingQuantity");
                            }
                        }}>Add Ticket</Button>
                    </div>
                    <ScrollArea className="col-span-2 h-48 rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ticket Type</TableHead>
                                    <TableHead>Ticket Price</TableHead>
                                    <TableHead>Available Seats</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map((ticket, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{ticket.type}</TableCell>
                                        <TableCell>{ticket.price}</TableCell>
                                        <TableCell>{ticket.quantity}</TableCell>
                                        <TableCell className="flex flex-row">
                                            <Button variant="link" type="button" aria-label="Edit event" onClick={() => {
                                                // Logic to edit ticket
                                                setTicketType(ticket.type);
                                                setTicketPrice(ticket.price);
                                                setTicketQuantity(ticket.quantity);
                                                setTickets(tickets.filter((_, i) => i !== index)); // Remove ticket for editing
                                            }}>
                                                <Edit className="text-erie-black" />
                                            </Button>
                                            <Button variant="link" type="button" aria-label="Delete event" onClick={() => {
                                                // Logic to delete ticket
                                                setTickets(tickets.filter((_, i) => i !== index));
                                            }}>
                                                <Trash2 className="text-fire-engine-red" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
                <div className={`flex flex-row justify-end items-center mt-4`}>
                    <div className="space-x-2">
                        <Modal.Close asChild>
                            <Button type="button" variant="outline" className="px-6">Cancel</Button>
                        </Modal.Close>
                        <Button variant="default" type="submit" className="px-6">Create</Button>
                    </div>
                </div>
            </form>
        </Form >
    )
};

// Uncomment and use this component to reduce code duplication
// interface EventFormFieldProps {
//     name: FieldPath<z.infer<typeof formSchema>>;
//     label: string;
//     placeholder: string;
//     description?: string;
//     inputType?: string;
//     formControl: Control<z.infer<typeof formSchema>, any>;
// }
// const EventFormField: React.FC<EventFormFieldProps> = ({
//     name, label, placeholder, description, inputType = "text", formControl
// }) => {
//     return (
//         <FormField
//             control={formControl}
//             name={name}
//             render={
//                 ({ field }) => (
//                     <FormItem>
//                         <FormLabel>{label}</FormLabel>
//                         <FormControl>
//                             <Input type={inputType} placeholder={placeholder} {...field} />
//                         </FormControl>
//                         {description && <FormDescription>{description}</FormDescription>}
//                         <FormMessage />
//                     </FormItem>
//                 )
//             }
//         />
//     )
// }
