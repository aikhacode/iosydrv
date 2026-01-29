import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Animated, Easing } from 'react-native';
import MapView, { MarkerAnimated, AnimatedRegion, PROVIDER_GOOGLE } from 'react-native-maps';
import useGeolocation from './useGeoLocation';
import {
    LATITUDE_DELTA,
    LONGITUDE_DELTA,
    vehicle_image_tracking_bike,
    vehicle_image_tracking_car,
} from '../../config/Constants';

// Simple haversine formula (distance in meters)
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371e3; // Earth radius in meters
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

const SmoothMap = ({ mapViewRef }) => {
    const MOVEMENT_THRESHOLD = 3; // meters

    const { location, heading, startTracking, stopTracking } = useGeolocation();
    const [ready, setReady] = useState(false);
    const [isMoving, setIsMoving] = useState(false);

    const lastPosition = useRef(null);
    const coordinate = useRef(
        new AnimatedRegion({
            latitude: location?.latitude || 0,
            longitude: location?.longitude || 0,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        })
    ).current;

    // rotation value for patrol & heading
    const rotation = useRef(new Animated.Value(0)).current;
    const [markerRotation, setMarkerRotation] = useState(0);
    const patrolRef = useRef(null);
    const isPatrolling = useRef(false);
    const rafRef = useRef(null);


    // Listen to Animated rotation updates
    useEffect(() => {
        const id = rotation.addListener(({ value }) => {
            if (!rafRef.current) {
                rafRef.current = requestAnimationFrame(() => {
                    setMarkerRotation(value);
                    rafRef.current = null;
                });
            }
        });
        return () => {
            rotation.removeListener(id);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [rotation]);


    // Compute new coordinate based on current lat, lon, heading, and distance
    const moveByHeading = (lat, lon, heading, distanceMeters) => {
        const R = 6371000; // Earth radius in meters
        const rad = (heading * Math.PI) / 180;
        const newLat = lat + (distanceMeters * Math.cos(rad)) / R * (180 / Math.PI);
        const newLon =
            lon +
            (distanceMeters * Math.sin(rad)) /
            (R * Math.cos((lat * Math.PI) / 180)) *
            (180 / Math.PI);

        return { latitude: newLat, longitude: newLon };
    };

    // Move forward along heading (for AnimatedRegion)
    const moveForward = (position, heading, distance = 8) => {
        const { latitude, longitude } = position.__getValue();
        const newPos = moveByHeading(latitude, longitude, heading, distance);

        return position.timing({
            latitude: newPos.latitude,
            longitude: newPos.longitude,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        });
    };

    // Rotate smoothly
    const rotate = (rotation, by = 360, duration = 2000) =>
        Animated.timing(rotation, {
            toValue: rotation.__getValue() + by,
            duration,
            easing: Easing.linear,
            useNativeDriver: false,
        });

    /** Start patrol swing animation */
    const startPatrol = () => {
        if (isPatrolling.current) return;
        isPatrolling.current = true;
        let currentHeading = heading

        patrolRef.current = Animated.loop(
            Animated.sequence([
                // Step 1: move forward 3m
                moveForward(coordinate, currentHeading, 8),
                // Step 2: rotate 360°
                // rotate(rotation, 360, 800),
                Animated.timing(rotation, {
                    toValue: 180,
                    duration: 2500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: false,
                }),


                // Step 4: move forward again using new heading
                moveForward(coordinate, currentHeading, -8),
                // Animated.timing(rotation, {
                //     toValue: 30,
                //     duration: 1500,
                //     easing: Easing.inOut(Easing.ease),
                //     useNativeDriver: false,
                // }),
                Animated.timing(rotation, {
                    toValue: -180,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: false,
                }),
            ])
        );
        patrolRef.current.start();
    };

    /** Stop patrol */
    const stopPatrol = () => {
        if (!isPatrolling.current) return;
        isPatrolling.current = false;
        if (patrolRef.current) {
            patrolRef.current.stop();
            patrolRef.current = null;
        }
        rotation.stopAnimation();
    };

    /** Handle movement detection & smooth updates */
    useEffect(() => {
        if (!location?.latitude || !location?.longitude) return;

        const { latitude, longitude } = location;

        // First initialization
        if (!lastPosition.current) {
            lastPosition.current = { latitude, longitude };
            return;
        }

        const dist = haversineDistance(
            lastPosition.current.latitude,
            lastPosition.current.longitude,
            latitude,
            longitude
        );

        const moved = dist > MOVEMENT_THRESHOLD;
        setIsMoving(moved);

        if (moved) {
            // Smoothly animate position
            coordinate.timing({
                latitude,
                longitude,
                duration: 1000,
                useNativeDriver: false,
            }).start();

            lastPosition.current = { latitude, longitude };
        }
    }, [location]);

    /** Patrol ↔ Movement transition */
    useEffect(() => {
        if (isMoving) {
            stopPatrol();

            // Smoothly rotate to current heading (not instant)
            Animated.timing(rotation, {
                toValue: heading || 0,
                duration: 800,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: false,
            }).start();
        } else {
            startPatrol();
        }
    }, [isMoving, heading]);

    /** Follow camera on movement */
    useEffect(() => {
        if (ready && mapViewRef?.current && location) {
            mapViewRef.current.animateCamera(
                {
                    center: location,
                    pitch: 0,
                    zoom: 17,
                    heading: heading || 0,
                },
                { duration: 700 }
            );
        }
    }, [ready, location, heading]);

    /** Start / Stop tracking */
    useEffect(() => {
        startTracking();
        return () => {
            stopTracking();
            stopPatrol();
        };
    }, []);

    const vehicleImage =
        global?.vehicle_type === 4
            ? vehicle_image_tracking_bike
            : vehicle_image_tracking_car;

    // useEffect(() => {
    //     console.log('vhi:', vehicleImage, vehicle_image_tracking_car)
    // }, [vehicleImage])


    return (
        <View style={styles.container}>
            {location && (
                <MapView
                    ref={mapViewRef}
                    style={styles.map}
                    onMapReady={() => setReady(true)}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                >
                    {ready && (
                        <MarkerAnimated
                            coordinate={coordinate}
                            rotation={markerRotation}
                            flat
                            anchor={{ x: 0.5, y: 0.5 }}
                        >
                            <Image
                                source={vehicleImage}
                                style={{ width: 28, height: 28, resizeMode: 'contain' }}
                            />
                        </MarkerAnimated>
                    )}
                </MapView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { ...StyleSheet.absoluteFillObject },
});

export default SmoothMap;
