import Dashboard from "@/components/dashboard";
import { SidebarProvider } from "@/components/ui/sidebar";

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

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen border border-red-500 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <SidebarProvider>
          <Dashboard />
        </SidebarProvider>
      </main>
      {/* <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer> */}
    </div>
  );
}
