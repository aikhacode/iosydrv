import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Animated, Easing } from 'react-native';
import MapView, { MarkerAnimated, AnimatedRegion } from 'react-native-maps';
import useGeolocation from './useGeoLocation';
import {
    LATITUDE_DELTA,
    LONGITUDE_DELTA,
    vehicle_image_tracking_bike,
    vehicle_image_tracking_car,
} from '../../config/Constants';

const SmoothMap = ({ mapViewRef }) => {
    const MOVEMENT_THRESHOLD = 0.000018; // ~5 meters
    const { location, heading, startTracking, stopTracking } = useGeolocation();
    const [ready, setReady] = useState(false);
    const [isMoved, setIsMoved] = useState(false);

    const lastActivePosition = useRef(null);

    const coordinate = useRef(
        new AnimatedRegion({
            latitude: location?.latitude || 0,
            longitude: location?.longitude || 0,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        })
    ).current;

    // rotation value used for patrol (degrees)
    const rotation = useRef(new Animated.Value(0)).current;
    const patrolAnimationRef = useRef(null);
    const isPatrolling = useRef(false);

    // numeric rotation that we'll pass to Marker.rotation
    const [markerRotation, setMarkerRotation] = useState(0);
    // throttle updates to requestAnimationFrame to avoid too many setState calls
    const lastValueRef = useRef(0);
    const rafRef = useRef(null);
    const checkIsMovedRef = useRef(null)
    const lastCheckIsMoved = useRef(null)
    // listen to rotation Animated.Value and update markerRotation (throttled)
    useEffect(() => {
        const id = rotation.addListener(({ value }) => {
            lastValueRef.current = value;
            if (rafRef.current === null) {
                rafRef.current = requestAnimationFrame(() => {
                    setMarkerRotation(lastValueRef.current);
                    rafRef.current = null;
                });
            }
        });
        return () => {
            rotation.removeListener(id);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [rotation]);

    const startPatrol = () => {
        if (isPatrolling.current) return;
        isPatrolling.current = true;

        // Swing left/right between -20 and +20 degrees
        const swing = Animated.loop(
            Animated.sequence([
                Animated.timing(rotation, {
                    toValue: 90,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: false, // false because we read value on JS thread
                }),
                Animated.timing(rotation, {
                    toValue: -90,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: false,
                }),
            ])
        );

        patrolAnimationRef.current = swing;
        swing.start();
        // console.log('startPatrol');
    };

    const stopPatrol = (reason) => {
        if (!isPatrolling.current && !patrolAnimationRef.current) {
            // console.log('stopPatrol: nothing to stop', reason);
            return;
        }
        // console.log('stopPatrol:', reason);
        isPatrolling.current = false;
        if (patrolAnimationRef.current) {
            try {
                patrolAnimationRef.current.stop();
            } catch (e) {
                /* ignore */
            }
            patrolAnimationRef.current = null;
        }
        rotation.setValue(0); // reset to neutral
        setMarkerRotation(0);
    };

    // handle incoming location updates and detect movement > threshold
    useEffect(() => {
        if (!location?.latitude || !location?.longitude) return;

        const { latitude, longitude } = location;

        if (!lastActivePosition.current) {
            lastActivePosition.current = { latitude, longitude };
            setIsMoved(false);
            stopPatrol('init');
            return;
        }

        const moved =
            Math.abs(latitude - lastActivePosition.current.latitude) > MOVEMENT_THRESHOLD ||
            Math.abs(longitude - lastActivePosition.current.longitude) > MOVEMENT_THRESHOLD;

        setIsMoved(moved);

        if (isMoved) {
            // animate marker position to new location
            coordinate.timing({
                latitude,
                longitude,
                duration: 800,
                useNativeDriver: false,
            }).start();
            lastActivePosition.current = { latitude, longitude };
        }
        console.log('location', location)
    }, [location, coordinate]);

    // start/stop patrol when idle/moving
    useEffect(() => {

        if (isMoved) {
            stopPatrol('movement detected');
        } else {
            // idle
            startPatrol();
        }
    }, [isMoved]);

    // camera follow
    useEffect(() => {
        if (ready && mapViewRef?.current && location) {
            mapViewRef.current.animateCamera(
                {
                    center: location,
                    pitch: 0,
                    altitude: 1000,
                    heading: heading || 0,
                    zoom: 17,
                },
                { duration: 600 }
            );
        }
    }, [ready, mapViewRef, location, heading]);

    // start geolocation tracking
    useEffect(() => {

        startTracking();
        return () => {
            stopPatrol('unmount');
            stopTracking();

        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const vehicleImage =
        global?.vehicle_type === 4 ? vehicle_image_tracking_bike : vehicle_image_tracking_car;

    return (
        <View style={styles.container}>
            {location && (
                <MapView
                    ref={mapViewRef}
                    style={styles.map}
                    onMapReady={() => setReady(true)}
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
                            // pass numeric rotation here (degrees)
                            rotation={markerRotation}
                            // make marker lie flat so rotation behaves like a compass
                            flat
                            anchor={{ x: 0.5, y: 0.5 }}
                        >
                            <Image
                                source={vehicleImage}
                                style={{
                                    width: 28,
                                    height: 28,
                                    resizeMode: 'contain',
                                }}
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
