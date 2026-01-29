import { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import database from "@react-native-firebase/database";
import { api_url } from '../config/Constants';
import axios from 'axios';

export default function useLocationTracking() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const watchId = Geolocation.watchPosition(
            pos => {
                setLocation(pos);
            },
            err => {
                setError(err);
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 10,
            }
        );

        return () => {
            Geolocation.clearWatch(watchId);
        };
    }, []);

    return { location, error };
}

export function updateLocationOnFirebase(location, vt, isAntrian, resetCallback) {
    console.log('debounce update loc:', vt, location)
    database().ref(`/drivers/${vt}/${global.id}`).update({
        geo: {
            lng: location.lng,
            lat: location.lat
        }
    })

    const call_pool_detection = async () => {
        console.log('debounce call_pool_detection:...1')
        const resp = await axios.post(`${api_url}geo/check`, {
            lat: location.lat,
            lng: location.lng,
        })

        console.log('debounce call_pool_detection:..2', resp.data)
        if (resp.status === 200) {
            const inside = resp.data.inside
            console.log('debounce call_pool_detection:...3', inside)
            if (!inside) {

                axios.delete(`${api_url}antrian/${global.id}`).then(() => {
                    console.log('debounce delete antrian')
                    resetCallback()
                })

            }
        }


    }

    if (isAntrian) call_pool_detection()


}