'use client'

import { Libraries, useJsApiLoader } from '@react-google-maps/api';
import { ReactNode } from 'react';

const libraries = ['places', 'drawing', 'geometry'];

export function MapProvider({ children }: { children: ReactNode }) {
    const { isLoaded: scriptLoad, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
        libraries: libraries as Libraries
    });

    if (loadError) {
        return <p>Encountered error while loading google maps</p>
    }

    if (!scriptLoad) {
        return <p>Map Script is Loading...</p>
    }

    return children
}