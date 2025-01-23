"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Modal } from "@/components/modal"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { ArrowLeft, CalendarIcon, ClockIcon } from "lucide-react"
import { format } from "date-fns"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { generateTimeOptions } from "@/utils/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { useFile } from "@/context/FileContext"

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
        time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
            message: "Time must be in HH:MM format (24-hour).",
        }).optional(),
    }),
    location: z.object({
        type: z.enum(["physical", "virtual"]),
        address: z.string().optional(),
        link: z.string().url().optional(),
    }).refine((data) => (data.type === "physical" ? !!data.address : !!data.link), {
        message: "Address or Link is required based on the location type",
        path: ["location"],
    }),
    ticket: z.object({
        type: z.string().optional(),
        price: z.number().optional(),
        existingQuantity: z.number().optional(),
    }).optional()
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
                time: "12:00",
            },
            location: {
                type: "physical",
                address: "",
                link: "",
            },
            ticket: {
                type: "",
                price: 0,
                existingQuantity: 0,
            }
        },
    });

    const { file, setFile } = useFile();
    const [currentTab, setCurrentTab] = useState("details");
    const tabs = ["details", "dateAndLocation", "tickets"];
    const locationType = form.watch("location.type");
    const timeOptions = generateTimeOptions();
    const fileRef = form.register("cover");

    const handleNext = () => {
        const currentIndex = tabs.indexOf(currentTab);

        if (currentIndex < tabs.length - 1) {
            setCurrentTab(tabs[currentIndex + 1]);
        }
    };

    const handleBack = () => {
        const currentIndex = tabs.indexOf(currentTab);

        if (currentIndex > 0) {
            setCurrentTab(tabs[currentIndex - 1]);
        }
    }

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const payload = formSchema.safeParse(values);

        if (payload.success) {
            console.log(`{data: ${payload.data}`); // Consider removing or replacing with actual submission logic
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="details" onClick={() => setCurrentTab("details")}>Details</TabsTrigger>
                        <TabsTrigger value="dateAndLocation" onClick={() => setCurrentTab("dateAndLocation")}>Date and location</TabsTrigger>
                        <TabsTrigger value="tickets" onClick={() => setCurrentTab("tickets")}>Tickets</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="space-y-4 px-2 py-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="What is the event name?" {...field} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="cover"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cover</FormLabel>
                                    <FormControl>
                                        <Input
                                            accept="image/*"
                                            type="file"
                                            {...fileRef}
                                            onChange={
                                                (ev) => {
                                                    console.log(ev.target.files)
                                                    setFile(ev.target.files?.[0] || null)
                                                    field.onChange(ev)
                                                }
                                            }
                                            required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Add a description to encourage customers to attend to the event." className="resize-none" {...field} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </TabsContent>
                    <TabsContent value="dateAndLocation" className="space-y-6 px-2 py-4">
                        <div className="flex flex-row justify-between space-x-6">
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
                            <FormField
                                control={form.control}
                                name="datetime.time"
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
                                                <ScrollArea className="h-48 w-[6rem] border border-red-500">
                                                    <div className="flex flex-col space-y-2">
                                                        {
                                                            timeOptions.map((option) => (
                                                                <Button key={option} variant={option === field.value ? "default" : "ghost"} onClick={() => { field.onChange(option); form.setValue("datetime.time", option) }}>{option}</Button>
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
                        <div>
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
                        <FormField
                            control={form.control}
                            name="location.type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={(value: "physical" | "virtual") => {
                                                field.onChange(value);
                                                form.setValue("location.type", value)
                                            }}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="physical" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Physical
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="virtual" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Virtual
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                        {locationType === "physical" && (
                            <FormField
                                control={form.control}
                                name="location.address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-row items-center gap-2">
                                                <Input placeholder="Where will the event take place?" {...field} />
                                                <Button type="button" variant="secondary">Pick on the map</Button>
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
                                            <div className="flex flex-row items-center gap-2">
                                                <Input placeholder="Link to the event" {...field} />
                                                <Button type="button" variant="secondary">Paste</Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </TabsContent>
                    <TabsContent value="tickets" className="space-y-4 px-2 py-2">
                        <div className="grid grid-cols-2 space-x-2 space-y-6">
                            <FormField
                                control={form.control}
                                name="ticket.type"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Type</FormLabel>
                                        <FormControl>
                                            <Input placeholder="What is the ticket type (standard, VIP...)?" {...field} />
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
                                            <Input placeholder="How much does the ticket cost?" {...field} />
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
                                            <Input placeholder="How many tickets/seats are available for this event?" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <div className="col-span-2">
                                <Button className="flex w-full" type="button" variant="default">Add Ticket</Button>
                            </div>
                        </div>
                        <ScrollArea className="h-48 rounded-xl border">
                            <div className="space-y-2">
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
                <div className={`flex flex-row ${currentTab !== "details" ? "justify-between" : "justify-end"} items-center mt-4`}>
                    {
                        currentTab !== "details" && (
                            <Button variant="link" type="button" onClick={handleBack} className="px-6 space-x-1"><ArrowLeft /> back</Button>
                        )
                    }
                    <div className="space-x-2">
                        <Modal.Close asChild>
                            <Button type="button" variant="outline" className="px-6">Cancel</Button>
                        </Modal.Close>
                        {
                            currentTab !== "tickets" ? (
                                <Button variant="default" type="button" onClick={handleNext} className="px-6">Next</Button>
                            ) :
                                (
                                    <Button variant="default" type="submit" className="px-6">Create</Button>
                                )
                        }
                    </div>
                </div>
            </form>
        </Form>
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
