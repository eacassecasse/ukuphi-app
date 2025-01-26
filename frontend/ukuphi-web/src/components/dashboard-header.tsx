'use client'

import React, { useEffect, useState } from "react";
import { Search, Bell, BellDot } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useApi from "@/hooks/use-api";
import { useAuth } from "@/context/AuthContext";

export interface NotificationProps {
    type: string;
    message: string;
    sentAt: string;
    status: string;
}

export default function Header() {
    const { fetchWithAuth } = useApi();
    const { user, logout } = useAuth();
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const data = await fetchWithAuth("/notifications", { withCredentials: true });
                setNotifications(data);
            } catch (error) {
                console.error(error);
            }
        }

        loadNotifications();
    }, [fetchWithAuth]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
    };

    return (
        <header className="flex h-20 shrink-0 items-center gap-2 py-8 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex flex-row flex-1 justify-between items-center gap-4 px-4">
                <SidebarTrigger className="-ml-1" />
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
                                {
                                    notifications.filter((notification) => notification.status === "UNREAD").length === 0 ? (
                                        <DropdownMenuItem className="border border-fuschia-600">
                                            No new Notifications.
                                        </DropdownMenuItem>
                                    ) : (
                                        notifications
                                            .filter((notification) => notification.status === "UNREAD")
                                            .map((not, index) => (
                                                <React.Fragment key={index}>
                                                    <DropdownMenuItem>
                                                        {not.message}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                </React.Fragment>
                                            ))
                                    )
                                }

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex flex-row justify-start items-center w-full p-0 rounded-3xl gap-1" variant="outline">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                        <AvatarFallback>{ }</AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm truncate max-w-[calc(100%-3rem)]">{user?.name}</p>
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
                                <DropdownMenuItem onClick={logout}>
                                    Log out
                                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    )
}
