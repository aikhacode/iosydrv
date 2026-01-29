import Geolocation from '@react-native-community/geolocation';
// import FusedLocation from "react-native-fused-location";
import { PermissionsAndroid, Platform } from "react-native";
import { api_url, get_driver, GOOGLE_KEY, LATITUDE_DELTA, LONGITUDE_DELTA, prefix } from "./config/Constants";
import { initialLat, initialLng, initialRegion } from './actions/BookingActions';
import axios from 'axios';
import polyline from "@mapbox/polyline";


export const handleAxiosError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
    console.log(error.config);
}

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',

        maximumSignificantDigits: 5
    }).format(value);
}

export const formatNumber = (number, digit = 2) => {
    return new Intl.NumberFormat("id-ID", { minimumFractionDigits: digit, maximumFractionDigits: digit }).format(number)
}


export const getCurrentLocation = () =>
    new Promise((resolve, reject) => {
        // Set options.
        // FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);
        // FusedLocation.setLocationInterval(5000);
        // FusedLocation.setFastestLocationInterval(5000);
        // FusedLocation.setSmallestDisplacement(10);

        // // Keep getting updated location.
        // FusedLocation.getFusedLocation().then((loc) => {
        //     resolve(loc);
        // }).catch((err) => {
        //     reject(err.message)
        // })
        // // console.log('fusedloc-start', location)
        Geolocation.getCurrentPosition(
            position => {
                const cords = position.coords
                // console
                resolve(cords);
            },
            error => {
                console.log('loc err', error)
                reject(error.message);
            },
            { enableHighAccuracy: true }
            // { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        )
    })




// export const watchLocation = (resolve, reject) => {
//     // Place listeners.
//     // // Keep getting updated location.
//     // FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);
//     // FusedLocation.setLocationInterval(5000);
//     // FusedLocation.setFastestLocationInterval(5000);
//     // FusedLocation.setSmallestDisplacement(10);
//     // FusedLocation.startLocationUpdates();
//     // const subscription = FusedLocation.on(
//     //     // "fusedLocation",
//     //     // async (location) => {
//     //     'fusedLocation', async (location) => {
//     //         resolve({ location, subscription })
//     //     })

//     // // Optional
//     // const errSubscription = FusedLocation.on('fusedLocationError', error => {
//     //     reject(error)
//     // });

//     try {
//         const watchID = Geolocation.watchPosition(
//             (position) => {
//                 console.log('watchPosition', JSON.stringify(position));
//                 resolve(position, watchID)
//             },
//             (error) => reject(error)
//         );

//     } catch (error) {
//         reject(error)
//     }


// }

// export const stopWatchLocation = (subscription, setSubcription) => {
//     console.log('watch will stop')
//     if (subscription) {
//         // FusedLocation.off(subscription)
//         // FusedLocation.stopLocationUpdates()
//         subscription !== null && Geolocation.clearWatch(subscription);
//         setSubcription(null)
//         console.log('watch has stop')
//     }


// }



export const locationPermission = () => new Promise(async (resolve, reject) => {
    if (Platform.OS === 'ios') {
        try {
            const permissionStatus = await Geolocation.requestAuthorization('whenInUse');
            if (permissionStatus === 'granted') {
                return resolve("granted");
            }
            reject('Permission not granted');
        } catch (error) {
            return reject(error);
        }
    }
    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve("granted");
        }
        return reject('Location Permission denied');
    }).catch((error) => {
        console.log('Ask Location permission error: ', error);
        return reject(error);
    });
});

export const animate = (latitude, longitude, markerRef) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS == 'android') {
        if (markerRef) {
            markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
        }
    } else {
        // coordinate.timing(newCoordinate).start();
    }
}

// export const onCenter = (mapRef, curLoc) => {
//     console.log('about to run onCenter')
//     if (mapRef) {
//         console.log('jalan center', curLoc)
//         mapRef.current.animateToRegion({
//             latitude: curLoc.latitude,
//             longitude: curLoc.longitude,
//             latitudeDelta: LATITUDE_DELTA,
//             longitudeDelta: LONGITUDE_DELTA
//         })

//         // mapRef.current.animateCamera({
//         //     center: curLoc,
//         //     pitch: 0,
//         //     altitude: 1000,
//         // }, { duration: 300 });
//     }

// }

export const onCenter = (mapRef, curLoc) => {
    console.log('about to run onCenter')

    if (mapRef && mapRef.current && curLoc) {
        // Add a small delay to ensure map is fully loaded
        setTimeout(() => {
            try {
                console.log('jalan center', curLoc)
                mapRef.current.animateToRegion({
                    latitude: curLoc.latitude,
                    longitude: curLoc.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }, 1000) // duration in ms
            } catch (error) {
                console.log('Error centering map:', error)
            }
        }, 100)
    } else {
        console.log('Missing required parameters:', { mapRef: !!mapRef, current: !!(mapRef && mapRef.current), curLoc: !!curLoc })
    }
}



export const getValueOfSnapshot = (snapshot, field) => {
    return snapshot.val() ? snapshot.val()[`${field}`] ? snapshot.val()[`${field}`] : null : null
}

export const mapStateToProps = (state) => {
    return {
        initial_lat: state.booking.initial_lat,
        initial_lng: state.booking.initial_lng,
        initial_region: state.booking.initial_region,
    };
}

export const mapDispatchToProps = (dispatch) => ({
    initialLat: (data) => dispatch(initialLat(data)),
    initialLng: (data) => dispatch(initialLng(data)),
    initialRegion: (data) => dispatch(initialRegion(data))
});


export const get_driver_fiturs = (driver_id) => new Promise(async (resolve, reject) => {
    const resp = await fetch(api_url + 'driver/get_fiturs', {
        headers: {
            'Content-Type': 'application/json'

        },
        method: 'POST',
        body: JSON.stringify({ driver_id })
    })
    if (resp.ok) {
        resolve(await resp.json())
    } else {
        reject(resp)
    }

})


export const translate_driver_fiturs = (driver_id) => new Promise(async (resolve, reject) => {

    fetch(api_url + prefix + 'translate_driver_fiturs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ driver_id })
    }).then((res) => res.json()).then((res) => {
        resolve(res)
    }).catch((err) => reject(err))
})

export const autoCompletedInSeconds = (method, second) => {
    let intervalInstance = setInterval(() => {
        method()
        clearInterval(intervalInstance)
        console.log('auto completed stop ... ')
    }, second)


}

export const call_update_tol_parkir = (trip_id, tol, parkir) => {
    // setLoading(true);
    return axios({
        method: 'post',
        url: api_url + 'driver/update_tolparkir',
        data: {
            trip_id: trip_id,
            tol: tol, parkir: parkir
        }
    })
        .then(response => {


            // setLoading(false);
            console.log('update_tolparkir done', response)
            // if (response.data.status == 'success') {
            //     console.log(response)
            // }




        })
        .catch(error => {
            // setLoading(false);
            console.log(error)
        });
}

export const reAdjustTripStatusName = (trip_status) => {
    switch (trip_status) {
        case 'Mulai Trip':
            return 'Sudah bersama penumpang'
        case 'Sampai Tujuan 1':
            return 'Mulai Trip'
        case 'Sampai Tujuan 2':
            return 'Tujuan berikutnya'
        case 'Sampai Tujuan 3':
            return 'Tujuan berikutnya'
        case 'Trip selesai':
            return 'Sampai tujuan'
        case 'Completed':
            return 'Total pembayaran'

        default: return trip_status
    }
}

export const getDistance = (pos1, pos2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371000; // Earth radius in meters
    const dLat = toRad(pos2.latitude - pos1.latitude);
    const dLon = toRad(pos2.longitude - pos1.longitude);
    const lat1 = toRad(pos1.latitude);
    const lat2 = toRad(pos2.latitude);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};


export const getItemLayout = (data, index) => ({
    length: 50, // approximate height of each item, adjust as needed
    offset: 50 * index,
    index,
});


export const pushAntrian = (obj) => new Promise((resolve, reject) => {
    console.log('pushAntrian obj', obj)
    axios({
        method: 'post',
        url: 'https://star.gamaindonesian.com/api/antrian/push',
        data: {
            driver_id: global.id.toString(),
            latitude: obj.latitude.toString(),
            longitude: obj.longitude.toString(),
        }
    }).then((res) => resolve(res?.data)).catch((err) => reject(err))
})

export const callAntrian = () => new Promise((resolve, reject) => {
    console.log('callAntrian driver')
    axios({
        method: 'delete',
        url: 'https://star.gamaindonesian.com/api/antrian/' + global.id.toString(),

    }).then((res) => resolve(res?.data)).catch((err) => reject(err))
})

export const callBandaraFiturs = () => axios({
    method: 'get',
    url: 'https://star.gamaindonesian.com/api/driver/fiturs/zone/1',

})

export const getAddress = async (lat, lng) => {
    const apiKey = GOOGLE_KEY;
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    const data = await response.json();
    if (data.status === "OK") {
        return data.results[0];
    } else {
        throw new Error("Geocoding failed: " + data.status);
    }
}

export const getCoordsFromDirection = async (origin, destination) => {
    const apiKey = GOOGLE_KEY;
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`
    );

    const data = await response.json();
    const points = polyline.decode(data.routes[0].overview_polyline.points);
    const coords = points.map(([latitude, longitude]) => ({ latitude, longitude }));

    return coords;
}

export const call_get_driver = (driver_id) => new Promise((resolve, reject) => {
    console.log('get_driver driver_id', driver_id)
    axios({
        method: 'get',
        url: api_url + get_driver,
        params: { driver_id }
    }).then((res) => resolve(res?.data)).catch((err) => reject(err))
})

// Helper: Calculate distance between two coords in meters
export const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};