"use client"

import * as React from "react"
import {
  BarChart2,
  Calendar,
  CalendarCheck,
  GalleryVerticalEnd,
  LifeBuoy,
  Settings,
  House,
  Ticket,
  Users
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card"
import { NavSecondary } from "@/components/nav-secondary"
import { Separator } from "@/components/ui/separator"
import { Modal } from "@/components/modal"
import { EventForm } from "@/components/event-form"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: House,
      isActive: true,
    },
    {
      title: "Bookings",
      url: "#",
      icon: Ticket,
    },
    {
      title: "Schedule",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Event Management",
      url: "#",
      icon: CalendarCheck,
    },
    {
      title: "Customer Management",
      url: "#",
      icon: Users,
    },
    {
      title: "Reports",
      url: "#",
      icon: BarChart2,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Help & Support",
      url: "#",
      icon: LifeBuoy,
    },
  ],
}

export function AppSidebar({ activeMenu, setActiveMenu, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Ukuphi</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <div className="px-4">
          <Separator />
        </div>
        <NavSecondary items={data.navSecondary} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </SidebarContent>
      <SidebarFooter>
        <div className={`p-1 transition-all duration-300 ease-in-out ${state === "expanded" ? "flex opacity-100 max-h-[1000px]" : "hidden opacity-0 max-h-0"}`}>
          <Card className="shadow-none">
            <form>
              <CardHeader className="text-center p-4 pb-0">
                <CardDescription>
                  Host events with ease and connect with your audience!
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2.5 p-4">
                <Modal>
                  <Modal.Button>
                    <Button
                      className="w-full bg-sidebar-foreground text-sidebar-primary-foreground shadow-none"
                      size="sm"
                    >
                      Create an Event
                    </Button>
                  </Modal.Button>
                  <Modal.Content className="max-w-3xl justify-center items-center p-12">
                    <EventForm />
                  </Modal.Content>
                </Modal>
              </CardContent>
            </form>
          </Card>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
