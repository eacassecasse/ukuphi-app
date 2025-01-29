import { createContext, useContext, useState } from "react";

const NavigationContext = createContext({
  activePage: "landing",
  setActivePage: (page: string) => {},
});

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [activePage, setActivePage] = useState("landing");

  return (
    <NavigationContext.Provider value={{ activePage, setActivePage }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
