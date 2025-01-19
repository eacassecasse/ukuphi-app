import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]

export default function Dashboard() {
    return (
        <div className="flex flex-col flex-1">
            <div className="p-4 border border-purple-400">.col-1</div>
            <div>
                <ScrollArea>
                    <div className="grid grid-cols-2 gap-2 h-72 w-48 max-w-full max-h-screen border border-indigo-700">
                        <div className="border rounded-md border-purple-700">
                            <form>
                                <FormField
                                    name="search"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Search</FormLabel>
                                            <FormControl>
                                                <Input placeholder="shadcn" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </div>
                        <div className="border rounded-md border-purple-700">.col-2</div>
                        <div className="col-span-2 border rounded-md border-purple-700">.col-3</div>
                        <div className="col-span-2 border rounded-md border-purple-700">.col-4</div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}