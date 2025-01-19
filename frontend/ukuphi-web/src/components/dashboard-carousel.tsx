'use client'

import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi
} from "@/components/ui/carousel"
import { useState } from "react";
import { Button } from "./ui/button";

export function Banner() {
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    React.useEffect(() => {
        if (!carouselApi) return;

        const updateCarouselState = () => {
            setCurrentIndex(carouselApi.selectedScrollSnap());
            setTotalItems(carouselApi.scrollSnapList().length);
        }

        updateCarouselState();

        carouselApi.on('select', updateCarouselState);

        return () => {
            carouselApi.off('select', updateCarouselState);
        }
    }, [carouselApi]);

    const scrollToIndex = (index: number) => {
        carouselApi?.scrollTo(index);
    }

    return (
        <div className="relative w-full max-w-sm mx-auto">
            <Carousel setApi={setCarouselApi} opts={{ loop: true }} className="w-full max-w-sm h-full z-10">
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index}>
                            <div>
                                <Card className="h-full border-0 shadow-sm">
                                    <CardContent className="flex aspect-video items-center justify-center">
                                        <span className="text-4xl font-semibold">{index + 1}</span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center space-x-1 z-20">
                {
                    Array.from({ length: totalItems }).map((_, index) => (
                        <Button variant="outline" key={index} onClick={() => scrollToIndex(index)} className={`w-3 h-3 rounded-full p-0 min-w-0 ${ currentIndex === index ? "bg-erie-black": "bg-gray-300"}`}/>
                    ))
                }
            </div>
        </div>
    )
}
