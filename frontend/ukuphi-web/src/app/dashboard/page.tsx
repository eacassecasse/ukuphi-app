'use client'

import { MoreHorizontal, Plus, Calendar, Edit, Trash2, Check, Search, Bell, BellDot, ChevronDown, ChevronUp } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProgressBar from "@/components/dashboard-progressbar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { addDays, differenceInDays, isToday, isYesterday } from "date-fns"
import { MapProvider } from "@/providers/map-provider"
import { Map } from "@/components/map"
import { SetStateAction, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Input } from "@/components/ui/input"

interface EventProps {
  title: string;
  location: string;
  creation_date: string;
  date: string;
  tickets_sold: number;
  main_artist: {
    name: string;
    image_url: string;
  }
}
const stats = [
  {
    gradient: "bg-gradient-to-r from-magenta-haze from-[34%] to-burnt-sienna to-[100%]",
    title: "Total Earnings",
    value: 15000,
    total: 50000,
    icon: "summer_5181124.png",
    unit: "$",
  },
  {
    gradient: "bg-gradient-to-r from-dark-purple from-[47%] to-tyrian-purple to-[100%]",
    title: "Ticket Sales",
    value: 350,
    total: 500,
    icon: "tuvalu_18282394.png",
    unit: ""
  },
  {
    gradient: "bg-gradient-to-r from-amethyst from-[10%] to-glaucous to-[100%]",
    title: "Read Notifications",
    value: 22,
    total: 400,
    icon: "number-1_16900393.png",
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



const toUSDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  const [month, day] = formattedDate.split(' ');
  return { day, month }
}

export default function Page() {
  const [selectedEvent, setSelectedEvent] = useState<EventProps>();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSelectedEvent = (event: EventProps) => {
    setSelectedEvent(event);
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  };

  const toggleSideBar = () => {
    setIsCollapsed((prev) => !prev);
  }

  const today = new Date();
  const last2TodayNext4Days = Array.from({ length: 7 }, (_, index) => {
    const offset = index - 2;
    const date = addDays(new Date(), offset);

    const day = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date);
    const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);

    return { date, day, weekday };
  });

  return (
    <SidebarProvider>
      <MapProvider>
        <AppSidebar />
        <SidebarInset className="bg-muted/50">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex flex-row flex-1 justify-between items-center gap-4 px-4">
              <SidebarTrigger className="-ml-1" onClick={toggleSideBar} />
              <div className="flex w-3/5 items-center gap-2">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Search..."
                    onChange={handleSearch}
                    className="pl-10 rounded-3xl"
                  />
                  <Search className="absolute top-2/4 left-3 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 w-2/6 gap-2">
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="flex flex-row justify-center items-center w-full p-0 rounded-3xl gap-1" variant="outline">
                        <div className="flex justify-center items-center">
                          {
                            notifications.length === 0 ? (
                              <Bell className="h-24 w-24" />
                            ) : (
                              <BellDot size={108} className="h-24 w-24" />
                            )
                          }
                        </div>
                        <p className="text-sm">Notifications</p>

                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          Profile
                          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Billing
                          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Settings
                          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem>Email</DropdownMenuItem>
                              <DropdownMenuItem>Message</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>More...</DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Support</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        Log out
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="flex flex-row justify-start flex-nowrap items-center w-full p-0 rounded-3xl gap-1" variant="outline">
                        <div className="w-10 h-10 rounded-full border border-cyan-400">
                          .c
                        </div>
                        <p className="text-sm">Username</p>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          Profile
                          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Billing
                          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Settings
                          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem>Email</DropdownMenuItem>
                              <DropdownMenuItem>Message</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>More...</DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Support</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        Log out
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </header>
          <div className="grid auto-rows-min gap-4 px-4 md:grid-cols-3">
            <div className="md:col-span-2 grid sm:grid-cols-3 gap-4">
              {
                stats.map((stat) => (
                  <Card key={stat.title} className={`aspect-video ${stat.gradient} text-primary-foreground rounded-xl space-y-1 pt-2 px-4 border`}>
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
                    <CardFooter className="self-end place-self-end p-0 border border-emerald-400">
                      icon
                    </CardFooter>
                  </Card>
                ))
              }
              <div className="col-span-3 h-64 grid grid-cols-2 rounded-xl gap-4 p-6 bg-white md:min-h-min">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-semibold">Event List</h2>
                      <p className="text-xs">Today Active Events 120</p>
                    </div>
                    <Select>
                      <SelectTrigger className="w-2/6 rounded-3xl">
                        <SelectValue placeholder="Active" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="banana">Banana</SelectItem>
                          <SelectItem value="blueberry">Blueberry</SelectItem>
                          <SelectItem value="grapes">Grapes</SelectItem>
                          <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <ScrollArea className="max-h-56 flex flex-col flex-1">
                    <div className="flex flex-col gap-2">
                      {
                        events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event, index) => {
                          const creationDate = new Date(event.creation_date);
                          const eventDate = new Date(event.date);

                          const totalDays = Math.round((eventDate.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24));
                          const elapsedDays = Math.round((today.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24));
                          const currentDay = Math.max(elapsedDays, 0);

                          const shortTitle = event.title.split(" ").slice(0, 4).join(" ");

                          const isSelected = selectedEvent?.title === event.title

                          return (
                            <Card key={index} className={`flex flex-row justify-between items-center px-4 rounded-xl shadown-md ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-primary hover:text-primary-foreground"}`} onClick={() => handleSelectedEvent(event)}>
                              <CardHeader className="flex flex-col gap-0 p-2">
                                <h3 className="font-semibold">{shortTitle}</h3>
                                <p className="text-sm">{event.location}</p>
                              </CardHeader>
                              <CardContent className="flex flex-row justify-center items-center gap-2 p-0">
                                <div className="flex flex-col justify-center items-center text-xs font-semibold">
                                  <h3>{formatDate(eventDate).day}</h3>
                                  <h3>{formatDate(eventDate).month.toLocaleUpperCase()}</h3>
                                </div>
                                <div className=" ml-auto">
                                  <ProgressBar value={currentDay} total={totalDays} />
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                      }
                    </div>
                  </ScrollArea>
                </div>
                <div className="flex flex-col gap-4">
                  {
                    selectedEvent ? (
                      <>
                        <div className="flex flex-row justify-between items-center gap-3">
                          <div className="flex items-center space-x-2">
                            <Image src={selectedEvent.main_artist.image_url} alt="" width={16} height={16} />
                            <div className="flex flex-col space-y-2">
                              <Skeleton className="h-4 w-36" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                          <Separator orientation="vertical" />
                          <div className="flex flex-col space-y-2">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <Map location={selectedEvent.location} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-row justify-between items-center gap-3">
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-14 w-14 rounded-full" />
                            <div className="flex flex-col space-y-2">
                              <Skeleton className="h-4 w-36" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                          <Separator orientation="vertical" />
                          <div className="flex flex-col space-y-2">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <Skeleton className="h-full w-full rounded-xl" />
                        </div>
                      </>
                    )
                  }
                </div>
              </div>
              <div className="bg-white h-72 max-h-screen col-span-3 flex flex-col rounded-xl border">
                <div className="flex flex-row justify-between items-center p-6">
                  <div>
                    <h2 className="text-xl font-semibold">All Bookings List</h2>
                  </div>
                  <div className="flex flex-row gap-2">
                    <Button className="px-6 rounded-3xl">Add New <Plus /></Button>
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
              <div className="aspect-video rounded-xl bg-muted/50 border" />
              <div className="bg-white h-auto max-h-screen col-span-3 flex flex-col rounded-xl gap border">
                <div className="flex flex-row justify-between items-center p-6">
                  <div>
                    <h2 className="text-xl font-semibold">Activity</h2>
                    <p className="text-xs">{toUSDate(today)}</p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <Button className="px-4 rounded-3xl">Add New <Plus /></Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 justify-center items-center gap-2 px-4 py-2">
                  {
                    last2TodayNext4Days.map((day, index) => {
                      const diff = differenceInDays(day.date, new Date());
                      const isTodayStyle = isToday(day.date);
                      const isSpecial = !isTodayStyle && (isYesterday(day.date) || (diff >= 0 && diff <= 1));
                      const styleClass = isTodayStyle
                        ? "border rounded-md shadow-lg p-2"
                        : isSpecial
                          ? "text-erie-black"
                          : "text-erie-black/50";

                      return (
                        <div key={index} className={`flex flex-col items-center justify-center text-xs font-semibold gap-1 ${styleClass}`}>
                          <h3>{day.weekday}</h3>
                          <h3>{day.day}</h3>
                        </div>
                      );
                    })
                  }
                </div>
                <ScrollArea className="h-[23rem]">
                  <div className="flex flex-row items-stretch gap-2 p-4">
                    <div className="flex flex-col">
                      <div className={`grid grid-rows-${notifications.length} justify-center items-center gap-4`}>
                        {
                          notifications.map((notification, index) => {
                            return (
                              <div key={index} className="py-11">
                                <div className={`rounded-full ${notification.status === "read" ? "p-1 bg-primary" : "p-2 border border-primary"}`}>
                                  {notification.status === "read" ? (<Check className="h-4 w-4 text-white" absoluteStrokeWidth={true} />) : <div className="flex-1" />}
                                </div>
                              </div>
                            );
                          })
                        }
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-4">
                      {
                        notifications.map((notification, index) => {
                          return (
                            <Card key={index}>
                              <CardContent className={`px-6 py-2 ${notification.type === "info" ? "bg-byzantine-blue/50" : notification.type === "warning" ? "bg-gamboge/30" : "bg-fire-engine-red/15"} rounded-t-md`}>
                                <div className="space-y-2">
                                  <h3 className="font-semibold">{notification.type.toLocaleUpperCase()}</h3>
                                  <p className="text-sm">{notification.content}</p>
                                </div>
                              </CardContent>
                              <CardFooter className={`px-6 py-1 ${notification.type === "info" ? "bg-byzantine-blue/80" : notification.type === "warning" ? "bg-gamboge/60" : "bg-fire-engine-red/45"} rounded-b-md`}>
                                <div className="text-xs">
                                  {notification.time.toLocaleLowerCase()}
                                </div>
                              </CardFooter>
                            </Card>
                          );
                        })
                      }
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </SidebarInset>
      </MapProvider>
    </SidebarProvider>
  )
}
