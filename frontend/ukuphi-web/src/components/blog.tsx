"use client"
import { CldImage } from "next-cloudinary";

export interface EventProps {
    title: string;
    description: string;
    date: {
        day: number;
        month: string;
    };
    image_src: string;
}

export default function Event({ event }: { event: EventProps }) {
    return (
        <div className="flex flex-col rounded-2xl shadow-lg">
            <div className="overflow-hidden rounded-t-2xl">
                <CldImage
                    className="w-fit h-fit aspect-square object-cover"
                    src={event.image_src}
                    alt=""
                    width={500}
                    height={500}
                    crop={{ type: 'auto', source: true }} />
            </div>
            <div className="flex flex-row gap-4 p-5">
                <div className="flex flex-col justify-start items-center text-center mt-2">
                    <div className="text-xs font-semibold text-purple-700">{event.date.month.length > 3 ? event.date.month.substring(0,3).toLocaleUpperCase(): event.date.month.toLocaleUpperCase()}</div>
                    <h2 className="text-3xl font-bold">{event.date.day}</h2>
                </div>
                <div className="grid grid-rows-2 gap-2 col-span-3">
                    <h3 className="text-lg font-bold">
                        {event.title}
                    </h3>
                    <p className="text-base">
                        {event.description.length > 66 ? event.description.substring(0, 66) + "..." : event.description}
                    </p>
                </div>
            </div>
        </div>
    )
}