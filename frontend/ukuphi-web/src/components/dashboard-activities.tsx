import { addDays, differenceInDays, format, isToday, isYesterday, set } from "date-fns";
import { Plus, Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Modal } from "@/components/modal";
import { RegisterForm } from "@/components/register-form";
import { NotificationProps } from "./dashboard-header";
import useApi from "@/hooks/use-api";
import { useEffect, useState } from "react";


const toUSDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

const today = new Date();

const last2TodayNext4Days = Array.from({ length: 7 }, (_, index) => {
    const offset = index - 2;
    const date = addDays(new Date(), offset);

    const day = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date);
    const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);

    return { date, day, weekday };
});


export default function Activity() {
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);
    const { fetch } = useApi();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const data = await fetch("/notifications");
                setLoading(false);
                setNotifications(data);
            } catch (error: any) {
                setLoading(false);
                setError(error.message || "An error occurred while loading activity.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadNotifications();
    }, [fetch]);
    
    return (
        <div className="bg-white h-auto max-h-screen flex flex-col rounded-xl border">
            <div className="flex flex-row justify-between items-center p-6">
                <div>
                    <h2 className="text-xl font-semibold">Activity</h2>
                    <p className="text-xs">{toUSDate(today)}</p>
                </div>
                <div className="flex flex-row gap-2">
                    <Modal>
                        <Modal.Button>
                            <Button className="px-6 rounded-3xl">Add New <Plus /></Button>
                        </Modal.Button>
                        <Modal.Content className="flex justify-center items-center p-12">
                            <RegisterForm className="flex-1" />
                        </Modal.Content>
                    </Modal>
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
                {loading && <div><div className="flex flex-1 justify-center items-center gap-1 w-full">Loading activity... <Loader className="animate-spin" /></div></div>}
                {!loading && !error && notifications?.length === 0 && (
                    <div className="flex flex-1 justify-center items-center gap-1 w-full">
                        <div>No activity available.</div>
                    </div>
                )}
                {
                    !loading && !error && notifications?.length > 0 && (
                        <div className="flex flex-row items-stretch gap-2 p-4">
                            <div className="flex flex-col">
                                <div className={`grid grid-rows-${notifications.length} justify-center items-center space-y-4`}>
                                    {
                                        notifications?.map((notification, index) => {
                                            return (
                                                <div key={index} className="py-12">
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
                                    notifications?.map((notification, index) => {
                                        return (
                                            <Card key={index}>
                                                <CardContent className={`px-6 py-2 ${notification.type === "INFO" ? "bg-byzantine-blue/50" : notification.type === "WARNING" ? "bg-gamboge/30" : "bg-fire-engine-red/15"} rounded-t-md`}>
                                                    <div className="space-y-2">
                                                        <h3 className="font-semibold">{notification.type}</h3>
                                                        <p className="text-sm">{notification.message}</p>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className={`px-6 py-1 ${notification.type === "INFO" ? "bg-byzantine-blue/80" : notification.type === "WARNING" ? "bg-gamboge/60" : "bg-fire-engine-red/45"} rounded-b-md`}>
                                                    <div className="text-xs">
                                                        {format(new Date(notification.sentAt), "HH:mm:ss")}
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    )
                }
            </ScrollArea>
        </div>
    )
}