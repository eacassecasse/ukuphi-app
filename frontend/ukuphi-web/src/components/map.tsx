'use client'

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"
import { useEffect, useState } from "react";

export const defaultMapContainerStyle = {
    width: '100%',
    height: '32vh',
    borderRadius: '15px 15px 15px 15px'
}


const defaultMapZoom = 18;

const defaultMapOptions = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
    mapTypeId: 'satellite',
    disableDefaultUI: false,
};

const Map = ({ location }: { location: string }) => {
    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchCoordinates = async () => {
            const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                location
            )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string}`;

            try {
                const response = await fetch(geocodingUrl);
                const data = await response.json()


                if (data.status === "OK") {
                    const { lat, lng } = data.results[0].geometry.location;
                    setCoordinates({ lat, lng });
                    setIsLoaded(true);
                } else {
                    setError("Failed to fetch location coordinates");
                }
            } catch (error) {
                setError("An Error occured while fetching location data");
            }
        }

        fetchCoordinates();
    }, [location])

    return (
        <div className="w-full h-full max-h-full">
            {
                isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={defaultMapContainerStyle}
                        center={coordinates}
                        zoom={defaultMapZoom}
                        options={defaultMapOptions}
                    >
                        <Marker position={coordinates} />
                    </GoogleMap>
                ) : (
                    <p>{error || "Loading map..."}</p>
                )
            }
        </div>
    )
};

export { Map };