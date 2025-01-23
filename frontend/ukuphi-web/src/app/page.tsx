"use client"

import Bookings from "@/components/ bookings";
import { AppSidebar } from "@/components/app-sidebar";
import CustomerList from "@/components/customer-management";
import Dashboard from "@/components/dashboard";
import Header from "@/components/dashboard-header";
import EventList from "@/components/event-management";
import OnComingFeature from "@/components/onComingFeature";
import Schedules from "@/components/schedules";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { FileProvider } from "@/context/FileContext";
import { useSidebarContext } from "@/context/SidebarContext";
import { useState } from "react";

const users = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "+123456789",
    bookings: "5",
    level: "Gold",
    image_url: "https://example.com/images/alice.jpg"
  },
  {
    name: "Bob Smith",
    email: "bob.smith@example.com",
    phone: "+987654321",
    bookings: "2",
    level: "Silver",
    image_url: "https://example.com/images/bob.jpg"
  },
  {
    name: "Charlie Davis",
    email: "charlie.davis@example.com",
    phone: "+567890123",
    bookings: "8",
    level: "Platinum",
    image_url: "https://example.com/images/charlie.jpg"
  },
  {
    name: "Diana White",
    email: "diana.white@example.com",
    phone: "+345678901",
    bookings: "4",
    level: "Gold"
  },
  {
    name: "Ethan Brown",
    email: "ethan.brown@example.com",
    phone: "+678901234",
    bookings: "1",
    level: "Bronze",
    image_url: "https://example.com/images/ethan.jpg"
  }
];


const events = [
  {
    title: "2025 Maputo Jazz Festival ‘25 Cultural Beats Maputo",
    description: "Experience a night filled with soulful rhythms and African pride.",
    date: {
      day: 15,
      month: "march"
    },
    image_src: "ukuphi-app/event-1"
  },
  {
    title: "2025 Marrabenta Night Live ‘25 Rhythms of Africa Xai-Xai",
    description: "Directly immersed and ready to feel the heartbeat of Africa.",
    date: {
      day: 22,
      month: "april"
    },
    image_src: "ukuphi-app/event-2"
  },
  {
    title: "2025 Chopi Timbila Gala ‘25 Traditional Sounds Inhambane",
    description: "Sitting in harmony to embrace Mozambique's rich traditions.",
    date: {
      day: 8,
      month: "june"
    },
    image_src: "ukuphi-app/event-3"
  },
  {
    title: "Heritage Fest ‘25 African Roots Ilha de Moçambique",
    description: "Positioned to witness the fusion of history and culture live.",
    date: {
      day: 12,
      month: "july"
    },
    image_src: "ukuphi-app/event-4-v1"
  },
  {
    title: "Gorongosa Wildlife Show ‘25 Nature’s Pride Chitengo",
    description: "Closely seated for a breathtaking celebration of the wild.",
    date: {
      day: 20,
      month: "september"
    },
    image_src: "ukuphi-app/event-5"
  },
  {
    title: "Pemba Sunset Carnival ‘25 Coastal Colors Pemba",
    description: "Perfectly placed to enjoy vibrant music and stunning views.",
    date: {
      day: 11,
      month: "november"
    },
    image_src: "ukuphi-app/event-6"
  },
]

const weekdays = {
  label: "Weekdays",
  items: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ]
}

const event_types = {
  label: "Event Type",
  items: [
    "Conference",
    "Workshop",
    "Seminar",
    "Webinar",
    "Networking Event",
    "Panel Discussion",
    "Trade Show",
    "Product Launch",
    "Fundraiser",
    "Concert",
    "Festival",
    "Exhibition",
    "Hackathon",
    "Award Ceremony",
    "Sports Event",
    "Meetup",
    "Virtual Event",
    "Team Building",
    "Lecture",
    "Retreat"
  ]
}

const event_categories = {
  label: "Any Category",
  items: [
    "Technology",
    "Business",
    "Education",
    "Healthcare",
    "Arts & Culture",
    "Music",
    "Sports",
    "Food & Beverage",
    "Science",
    "Fashion",
    "Environment",
    "Politics",
    "Community",
    "Travel & Adventure",
    "Religion & Spirituality",
    "Film & Media",
    "Gaming",
    "History",
    "Literature",
    "Social Impact"
  ]
}

const events1 = [
  {
    title: "Dance Night Extravaganza",
    location: "Los Angeles",
    creation_date: "2025-01-01",
    date: "2025-01-25",
    tickets_sold: 372,
    description: "Some description 1",
    main_artist: {
      name: "Adele",
      image_url: "https://example.com/image1.jpg"
    }
  },
  {
    title: "Country Fiesta",
    location: "Austin",
    creation_date: "2025-01-05",
    date: "2025-02-15",
    tickets_sold: 519,
    description: "Some description 2",
    main_artist: {
      name: "Beyoncé",
      image_url: "https://example.com/image2.jpg"
    }
  },
  {
    title: "Epic Music Festival",
    location: "New York",
    creation_date: "2025-01-01",
    date: "2025-02-20",
    tickets_sold: 644,
    description: "Some description 3",
    main_artist: {
      name: "Taylor Swift",
      image_url: "https://example.com/image3.jpg"
    }
  },
  {
    title: "Summer Beats",
    location: "Los Angeles",
    creation_date: "2025-01-10",
    date: "2025-01-30",
    tickets_sold: 236,
    description: "Some description 4",
    main_artist: {
      name: "Drake",
      image_url: "https://example.com/image4.jpg"
    }
  },
  {
    title: "Rock Fest",
    location: "San Francisco",
    creation_date: "2025-01-15",
    date: "2025-02-03",
    tickets_sold: 162,
    description: "Some description 5",
    main_artist: {
      name: "Imagine Dragons",
      image_url: "https://example.com/image5.jpg"
    }
  }
]

export default function Home() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <Dashboard />;
      case "Bookings":
        return <Bookings />;
      case "Schedule":
        return <Schedules events={events} />;
      case "Event Management":
        return <EventList events={events1} />;
      case "Customer Management":
        return <CustomerList customers={users} />;
      default:
        return <OnComingFeature />;
    }
  }

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="w-full flex flex-col flex-1 gap-8 row-start-2 items-center sm:items-start">
        <SidebarProvider>
          <FileProvider>
            <AppSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            <SidebarInset className="bg-muted/50 flex-1">
              <Header />
              {renderContent()}
            </SidebarInset>
          </FileProvider>
        </SidebarProvider>
      </main>
    </div>
  );
}
