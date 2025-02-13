import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  activeMenu,
  setActiveMenu
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
  }[];
  activeMenu?: string;
  setActiveMenu?: (menu: string) => void
}) {

  const handleClick = (title: string) => {
    setActiveMenu && setActiveMenu(title)
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {

            const isActive = item.title === activeMenu

            return (<SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} onClick={() => handleClick(item.title)} isActive={isActive}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>)
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
