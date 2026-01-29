// import { useState, useEffect, useRef } from 'react';
// import Geolocation from '@react-native-community/geolocation';
// import { LATITUDE_DELTA, LONGITUDE_DELTA } from '../../config/Constants';
// import { useGeolocationStore } from '../../reducers/zustand';
// import { success } from '../../assets/css/Colors';
// import { shallow } from "zustand/shallow"

// const useGeolocation = () => {
//     // const [location, setLocation] = useState(null);

//     // const [heading, setHeading] = useState(0);

//     const { location, heading, setLocation, setHeading } = useGeolocationStore((state) => state, shallow);
//     const [isTracking, setIsTracking] = useState(false);
//     const timeoutRef = useRef(null);



//     // Function to start tracking
//     const startTracking = () => {
//         setIsTracking(true);
//         fetchLocation();
//     };

//     // Function to stop tracking
//     const stopTracking = () => {
//         setIsTracking(false);
//         clearTimeout(timeoutRef.current); // Clean up timer
//     };

//     const isLocationAvailable = () => {
//         return location !== null;
//     }

//     // Fetch location with heading
//     const fetchLocation = () => {
//         Geolocation.requestAuthorization(() => {
//             Geolocation.getCurrentPosition(
//                 (position) => {
//                     // console.log('geo hook success', position.coords)
//                     const { latitude, longitude, heading: deviceHeading } = position.coords;
//                     setLocation({ latitude, longitude, longitudeDelta: LONGITUDE_DELTA, latitudeDelta: LATITUDE_DELTA });
//                     setHeading(deviceHeading || 0);
//                     // console.log('geo hook #1', position.coords)
//                     // Schedule next update if tracking is active
//                     if (isTracking) {
//                         timeoutRef.current = setTimeout(fetchLocation, 300);
//                     }
//                 },
//                 (error) => {
//                     console.error('Location error:', error);
//                     // Retry after error
//                     if (isTracking) {
//                         setTimeout(fetchLocation, 500);
//                     }
//                 },
//                 {
//                     enableHighAccuracy: true,
//                     timeout: 10000,
//                     maximumAge: 1000,
//                 }
//             );
//         }, (error) => {
//             console.error('Location authorization error:', error);
//         })

//     };

//     // Start tracking when component mounts
//     useEffect(() => {
//         if (isTracking) {
//             fetchLocation(); // Start fetching location
//         }

//         return () => {
//             clearTimeout(timeoutRef.current); // Cleanup timer on unmount
//         };
//     }, [isTracking]);

//     useEffect(() => {
//         console.log('geo hook running render...', location, heading)
//         fetchLocation()
//     }, [])

//     return {
//         location,
//         setLocation,
//         setHeading,
//         heading,
//         isTracking,
//         startTracking,
//         stopTracking,
//         isLocationAvailable
//     };
// };

// export default useGeolocation;

import { useState, useEffect, useRef } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { LATITUDE_DELTA, LONGITUDE_DELTA } from '../../config/Constants';
import { useGeolocationStore } from '../../reducers/zustand';
import { shallow } from "zustand/shallow";

const useGeolocation = () => {
    const { location, heading, setLocation, setHeading } =
        useGeolocationStore((state) => state, shallow);

    const [isTracking, setIsTracking] = useState(false);
    const watchIdRef = useRef(null);

    const startTracking = () => {

        if (watchIdRef.current !== null) {
            return; // already tracking
        }

        setIsTracking(true);

        Geolocation.requestAuthorization();

        watchIdRef.current = Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, heading: deviceHeading } = position.coords;
                setLocation({
                    latitude,
                    longitude,
                    longitudeDelta: LONGITUDE_DELTA,
                    latitudeDelta: LATITUDE_DELTA,
                });
                setHeading(deviceHeading || 0);
            },
            (error) => {
                console.error('watchPosition error:', error);
            },
            {


                enableHighAccuracy: true,
                distanceFilter: 5, // update on every movement
                interval: 800, // Android only, in ms
                fastestInterval: 500, // Android only
                useSignificantChanges: false, // iOS only
            }
        );
    };

    const stopTracking = () => {
        if (watchIdRef.current !== null) {
            Geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setIsTracking(false);
    };

    const isLocationAvailable = () => {
        return location !== null;
    };

    useEffect(() => {
        return () => {
            // Cleanup when component unmounts
            if (watchIdRef.current !== null) {
                Geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, []);

    return {
        location,
        setLocation,
        setHeading,
        heading,
        isTracking,
        startTracking,
        stopTracking,
        isLocationAvailable,
    };
};

export default useGeolocation;

const sampleLongRoute = [
    // NYC to Boston (simplified example)
    { latitude: 40.7128, longitude: -74.0060 }, // NYC
    { latitude: 40.7589, longitude: -73.9851 },
    { latitude: 41.1220, longitude: -74.0410 },
    { latitude: 41.3083, longitude: -73.9022 },
    { latitude: 41.4901, longitude: -71.3129 },
    { latitude: 41.7658, longitude: -72.6734 },
    { latitude: 41.9297, longitude: -72.6488 },
    { latitude: 42.3584, longitude: -71.0598 }, // Boston
];

export const useMockGeolocation = () => {
    const { location, heading, setLocation, setHeading } =
        useGeolocationStore((state) => state, shallow);

    const [isTracking, setIsTracking] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const idTimer = useRef();

    const startTracking = () => {


        setIsTracking(true);

        idTimer.current = setInterval(() => {
            const { latitude, longitude } = sampleLongRoute[currentIndex];
            setCurrentIndex((currentIndex + 1) % sampleLongRoute.length);

            setLocation({
                latitude,
                longitude,
                longitudeDelta: LONGITUDE_DELTA,
                latitudeDelta: LATITUDE_DELTA,
            });
            //calculate mock heading
            const current = sampleLongRoute[currentIndex];
            const next = sampleLongRoute[(currentIndex + 1) % sampleLongRoute.length];
            const heading = Math.atan2(
                next.longitude - current.longitude,
                next.latitude - current.latitude
            ) * (180 / Math.PI);
            //normalize heading to [0, 360)
            setHeading((heading + 360) % 360);
        }, 800);



    };

    const stopTracking = () => {


        if (isTracking) {
            clearInterval(idTimer.current);
        }

        setIsTracking(false);
    };

    const isLocationAvailable = () => {
        return true
    };


    return {
        location,
        setLocation,
        setHeading,
        heading,
        isTracking,
        startTracking,
        stopTracking,
        isLocationAvailable,
    };
};

