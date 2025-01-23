import * as React from "react"
import { type LucideIcon } from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
    items,
    activeMenu,
    setActiveMenu,
    ...props
}: {
    items: {
        title: string
        url: string
        icon: LucideIcon
    }[];
    activeMenu?: string;
    setActiveMenu?: (menu: string) => void
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {

    const handleClick = (title: string) => {
        setActiveMenu && setActiveMenu(title)
    }

    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        const isActive = item.title === activeMenu

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild size="default" tooltip={item.title} onClick={() => handleClick(item.title)} isActive={isActive}>
                                    <a href={item.url}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
