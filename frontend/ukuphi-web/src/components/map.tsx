'use client'

import { AdvancedMarker, Map, MapCameraChangedEvent, Pin } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export const defaultMapContainerStyle = {
    width: '100%',
    height: '32vh',
    borderRadius: '15px 15px 15px 15px'
}


const defaultMapZoom = 13;

const defaultMapOptions = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
    mapTypeId: 'satellite',
    disableDefaultUI: false,
};

const handleCameraChange = (ev: MapCameraChangedEvent) => {
    console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom);
}

const MapComponent = ({ location, height }: { location: string | string[], height?: string }) => {
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number; address: string }[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchCoordinates = async () => {
            const locations = Array.isArray(location) ? location : [location];

            const promises = locations.map(async (loc) => {
                const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    loc
                )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string}`;

                try {
                    const response = await fetch(geocodingUrl);
                    const data = await response.json()


                    if (data.status === "OK") {
                        const { lat, lng } = data.results[0].geometry.location;
                        return { lat, lng, address: loc };
                    } else {
                        throw new Error(`Failed to fetch location coordinates for location ${loc}`);
                    }
                } catch (err: any) {
                    throw new Error(err.message);
                }
            });

            try {
                const coordinates = (await Promise.all(promises)).filter(Boolean);
                const uniqueCoordinates = Array.from(
                    new Set(
                        coordinates.map(coord => `${coord.lat},${coord.lng}`) // Create unique keys using lat,lng
                    )
                ).map(key => {
                    const [lat, lng] = key.split(',').map(Number); // Split the string back into lat and lng
                    return coordinates.find(coord => coord.lat === lat && coord.lng === lng)!; // Retrieve the original object
                });

                setCoordinates(uniqueCoordinates);
                setIsLoaded(true);
            } catch (error: any) {
                setError(error.message);
            }
        }

        fetchCoordinates();
    }, [location])

    return (
        <div className="w-full h-full max-h-full">
            {
                isLoaded ? (
                    <Map
                        center={
                            coordinates.length > 0
                                ? { lat: coordinates[0].lat, lng: coordinates[0].lng }
                                : { lat: 0, lng: 0 }
                        }
                        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID as string}
                        zoom={defaultMapZoom}
                        onCameraChanged={handleCameraChange}
                    >
                        {
                            coordinates.map((coord) => {
                                return (
                                <AdvancedMarker key={coord.address} position={{ lat: coord.lat, lng: coord.lng }}>
                                    <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                                </AdvancedMarker>)
                            })
                        }
                    </Map>
                ) : (
                    <p>{error || "Loading map..."}</p>
                )
            }
        </div>
    )
};

export { MapComponent };