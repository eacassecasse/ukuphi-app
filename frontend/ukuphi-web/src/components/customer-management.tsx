'use client'

import { Edit, Trash2, MoreHorizontal, TrendingDown, TrendingUp, Loader } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Key, useEffect, useState } from "react"

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import useApi from "@/hooks/use-api"

interface CustomerProps {
    id: string;
    name: string;
    email: string;
    phone?: string;
    rank: string;
    image_url?: string;
    payments: [
        {
            id: string;
            amount: number;
            bookedById?: string;
            created_at: string;
            guestEmail: string;
            guestName: string;
            guestPhone: string;
            method: string;
            qr_code: string;
            status: string;
            ticketId: string;
        }
    ]
}

const stats = [
    {
        gradient: "bg-gradient-to-r from-magenta-haze from-[34%] to-burnt-sienna to-[100%]",
        title: "Total Customers",
        value: 250000,
        prevValue: 225000,
    },
    {
        gradient: "bg-gradient-to-r from-amethyst from-[10%] to-glaucous to-[100%]",
        title: "Active Customers",
        value: 190000,
        prevValue: 176700,
    },
    {
        gradient: "bg-gradient-to-r from-dark-purple from-[47%] to-tyrian-purple to-[100%]",
        title: "Pro Members",
        value: 50000,
        prevValue: 52000,
    },
    {
        gradient: "bg-gradient-to-r from-magenta-haze from-[34%] to-burnt-sienna to-[100%]",
        title: "New Customers",
        value: 15000,
        prevValue: 14700,
    }
]



export default function CustomerList() {
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerProps>();
    const [customers, setCustomers] = useState<CustomerProps[]>([]);
    const { fetch } = useApi();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleSelectedCustomer = (customer: CustomerProps) => {
        setSelectedCustomer(customer);
    }

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const data = await fetch("/customers");
                setLoading(false);
                setCustomers(data);
            } catch (error: any) {
                setLoading(false);
                setError(error.message || "An error occurred while fetching customers.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadCustomers();
    }, [fetch]);



    return (
        <div className="w-full flex flex-col flex-1 px-4 space-y-4">
            <div className="grid grid-cols-4 space-x-4">
                {
                    stats.map((stat, index) => {
                        const percentage = Math.round(((stat.value - stat.prevValue) / stat.prevValue) * 100);

                        return (
                            <Card key={index} className={`${stat.gradient} text-primary-foreground rounded-xl space-y-1 py-2 px-4 border`}>
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
                                <CardContent className="flex flex-row justify-between space-y-1 p-0">
                                    <h2 className="text-2xl font-semibold">{stat.value > 1000 ? (Math.round(stat.value / 1000)) + "k+" : stat.value}</h2>
                                    <div className="flex flex-row text-sm space-x-1">
                                        <span>{percentage}%</span>
                                        <div className="flex justify-center items-center w-5 h-5 bg-white rounded-full p-0.5">
                                            {
                                                percentage < 0 ? (<TrendingDown className="text-fire-engine-red w-3 h-3" />) : (<TrendingUp className="text-pine-green w-3 h-3" />)
                                            }
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className={`text-sm space-x-1 p-0 pt-2`}>
                                    <span className={`${percentage < 0 ? "text-fire-engine-red" : "text-pine-green"}`}>{percentage}%</span>
                                    <span>{percentage < 0 ? "decrease this month" : "increase this month"}</span>
                                </CardFooter>
                            </Card>
                        )
                    })
                }
            </div>
            <div className="h-full flex flex-row flex-1 gap-4">
                <div className="bg-white max-h-screen flex flex-col flex-1 rounded-xl border">
                    <div className="flex flex-row justify-between items-center p-6 w-full">
                        <div>
                            <h2 className="text-2xl font-semibold">Customer List</h2>
                        </div>
                    </div>
                    <ScrollArea className="flex flex-col flex-1 w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-2/6 px-6">Customer</TableHead>
                                    <TableHead className="w-2/6">Email</TableHead>
                                    <TableHead className="w-1/6">Phone</TableHead>
                                    <TableHead className="w-1/6">Bookings</TableHead>
                                    <TableHead className="w-2/6">Level</TableHead>
                                    <TableHead className="w-1/6 px-6"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && <TableRow><TableCell className="flex flex-row justify-center items-center gap-1 w-full" colSpan={6}>Loading data... <Loader className="animate-spin" /></TableCell></TableRow>}
                                {!loading && !error && customers?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6}>No customer available.</TableCell>
                                    </TableRow>
                                )}
                                {customers?.map((customer, index: Key | null | undefined) => {
                                    const bookings = customer.payments.length;

                                    return (
                                        <TableRow key={index} onClick={() => handleSelectedCustomer(customer)}>
                                            <TableCell className="flex flex-row items-center space-x-2 font-medium px-6">
                                                <div className="w-10 h-10 bg-muted/50 rounded-full"></div>
                                                <div className="text-sm font-semibold">{customer.name}</div>
                                            </TableCell>
                                            <TableCell>{customer.email}</TableCell>
                                            <TableCell>{customer.phone || "Not set"}</TableCell>
                                            <TableCell>{bookings}</TableCell>
                                            <TableCell>{customer.rank}</TableCell>
                                            <TableCell className="flex flex-row px-6">
                                                <Button variant="link">
                                                    <Edit className="text-erie-black" />
                                                </Button>
                                                <Button variant="link">
                                                    <Trash2 className="text-fire-engine-red" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
                <div className="hidden flex flex-col max-w-[22rem] gap-4 bg-white rounded-xl p-4 border">
                    <div className="aspect-square flex justify-center items-center rounded-xl bg-muted/50">

                    </div>
                </div>
            </div>
        </div>
    )
}
