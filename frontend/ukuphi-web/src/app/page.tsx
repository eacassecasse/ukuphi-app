"use client"

import Bookings from "@/components/ bookings";
import { AppSidebar } from "@/components/app-sidebar";
import CustomerList from "@/components/customer-management";
import Dashboard from "@/components/dashboard";
import Header from "@/components/dashboard-header";
import EventList from "@/components/event-management";
import LandingPage from "@/components/landing-page";
import { LoginForm } from "@/components/login-form";
import { Modal } from "@/components/modal";
import OnComingFeature from "@/components/onComingFeature";
import { RegisterForm } from "@/components/register-form";
import Schedules from "@/components/schedules";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { FileProvider } from "@/context/FileContext";
import { useNavigation } from "@/context/NavigationContext";
import { useEffect, useState } from "react";

export default function Home() {
  const { activePage, setActivePage } = useNavigation();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { user } = useAuth();

  const handleNavigation = (destination: string) => {
    if (destination === "dashboard") {
      if (user) {
        // Authenticated user, allow navigation to dashboard
        setActiveMenu("Dashboard");
        setActivePage("dashboard");
      } else {
        // Show login modal if not authenticated
        setIsOpen(true);
      }
    } else {
      setActivePage(destination);
    }
  };

  const renderContent = () => {
    if (!user || user.role === "ATTENDEE") {
      return <LandingPage onNavigate={handleNavigation} />
    }

    switch (activeMenu) {
      case "Dashboard":
        return <Dashboard />;
      case "Bookings":
        return <Bookings />;
      case "Schedule":
        return <Schedules />;
      case "Event Management":
        return <EventList />;
      case "Customer Management":
        return <CustomerList />;
      default:
        return <OnComingFeature />;
    }
  }

  useEffect(() => {
    if (user && user.role !== "ATTENDEE") {
      setIsOpen(false);
      setActiveMenu("Dashboard");
      setActivePage("dashboard");
    } else if (user && user.role === "ATTENDEE") {
      setActivePage("landing");
    }
  }, [user, setActivePage])

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="w-full flex flex-col flex-1 gap-8 row-start-2 items-center sm:items-start">
        {
          activePage === "dashboard" && user && user.role !== "ATTENDEE" ? (
            <SidebarProvider>
              <FileProvider>
                <AppSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                <SidebarInset className="bg-muted/50 flex-1">
                  <Header />
                  {renderContent()}
                </SidebarInset>
              </FileProvider>
            </SidebarProvider>
          ) : (
            <>
              <Modal open={isOpen} onOpenChange={setIsOpen}>
                <Modal.Content className="flex flex-col justify-center items-center p-12 space-y-4">
                  {
                    isRegistering ? (
                      <>
                        <RegisterForm className="flex-1 w-full" />

                        <div className="text-center text-sm">
                          Have an account already?{" "}
                          <Button variant="link" onClick={() => setIsRegistering(false)}>
                            Sign in
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <LoginForm className="flex-1 w-full" />

                        <div className="w-full text-center text-sm">
                          Don&apos;t have an account?{" "}
                          <Button variant="link" onClick={() => setIsRegistering(true)}>
                            Sign up
                          </Button>
                        </div>
                      </>
                    )
                  }
                </Modal.Content>
              </Modal>
              <LandingPage onNavigate={handleNavigation} />
            </>
          )
        }
      </main>
    </div >
  );
}
