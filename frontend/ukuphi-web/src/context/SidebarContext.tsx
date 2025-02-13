import React, { createContext, useContext, useState } from "react";

interface SideBarContextType {
    activeMenu: string;
    setActiveMenu: (menu: string) => void;
}
const SidebarContext = createContext<SideBarContextType>({
    activeMenu: "Dashboard",
    setActiveMenu: () => console.warn("setActiveMenu is not implemented"),
});

export const SidebarProvider2 = ({ children }: { children: React.ReactNode }) => {
    const [activeMenu, setActiveMenu] = useState("Dashboard");

    return (
        <SidebarContext.Provider value={{ activeMenu, setActiveMenu }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebarContext = () => useContext(SidebarContext);
