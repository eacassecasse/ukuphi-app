"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { DropdownMenuShortcut } from "./ui/dropdown-menu";
import { Modal } from "./modal";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { useState } from "react";

export default function Header({ onNavigate, className }: { onNavigate: (destination: string) => void; className?: string }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isRegisterOpen, setRegisterOpen] = useState(false);

    const openLogin = () => setLoginOpen(true);
    const closeLogin = () => setLoginOpen(false);

    const openRegister = () => setRegisterOpen(true);
    const closeRegister = () => setRegisterOpen(false);

    return (
        <header className={cn("relative", className)}>
            <div className="mx-auto flex flex-row flex-nowrap items-center space-x-8 px-32 py-8">
                {/* Brand */}
                <Link href="/" className="text-4xl font-bold">
                    Ukuphi
                </Link>

                <div className="flex w-full flex-row justify-between">
                    {/* Primary Navigation */}
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Button type="button" variant="link" onClick={() => router.push('/')}>Home</Button>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Button type="button" variant="link" onClick={() => router.push("/events")}>Events</Button>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Button onClick={() => onNavigate("dashboard")} type="button" variant="link">Schedule</Button>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Button type="button" variant="link">Blog</Button>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Button type="button" variant="link">Support</Button>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Secondary Navigation */}
                    <div>
                        {user && user?.role === "ATTENDEE" ?
                            (
                                <div className="grid grid-cols-2 border">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="flex" asChild>
                                            <Button className="flex flex-row justify-start items-center w-full max-h-full p-0 rounded-3xl gap-1" variant="outline">
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
                            )
                            :
                            (
                                <NavigationMenu>
                                    <NavigationMenuList>
                                        <NavigationMenuItem>
                                            <Button type="button" variant="link" onClick={openLogin}>Login</Button>
                                        </NavigationMenuItem>
                                        <NavigationMenuItem>
                                            <Button type="button" variant="default" onClick={openRegister}>Register</Button>
                                        </NavigationMenuItem>
                                    </NavigationMenuList>
                                </NavigationMenu>
                            )
                        }
                    </div>
                </div>
            </div>

            {/* Modals for Login and Register */}
            <Modal open={isLoginOpen} onOpenChange={setLoginOpen}>
                <Modal.Content className="flex flex-col justify-center items-center p-12 space-y-4">
                    <LoginForm className="flex-1 w-full" />
                    <div className="w-full text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Button variant="link" onClick={() => { setLoginOpen(false); setRegisterOpen(true); }}>
                            Sign up
                        </Button>
                    </div>
                </Modal.Content>
            </Modal>

            <Modal open={isRegisterOpen} onOpenChange={setRegisterOpen}>
                <Modal.Content className="flex flex-col justify-center items-center p-12 space-y-4">
                    <RegisterForm className="flex-1 w-full" />
                    <div className="text-center text-sm">
                        Have an account already?{" "}
                        <Button variant="link" onClick={() => { setRegisterOpen(false); setLoginOpen(true); }}>
                            Sign in
                        </Button>
                    </div>
                </Modal.Content>
            </Modal>
        </header>
    );
}
