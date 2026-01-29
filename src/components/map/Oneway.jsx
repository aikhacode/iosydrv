//Fixed
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    StatusBar
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import * as colors from '../../assets/css/Colors';
import { screenHeight, screenWidth, bold, regular, api_url, get_about, logo, f_25, f_m, f_l, f_s, f_xl, LATITUDE_DELTA, LONGITUDE_DELTA, pin_new, api_url_driver } from '../../config/Constants';
import Icon, { Icons } from '../../components/Icons';
import axios from 'axios';
import MapView, { Marker } from "react-native-maps";
import useGeolocation from "./useGeoLocation";
import withTranslation from '../../hook/withTranslation'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import GooglePlacesInput from "../GooglePlacesInput";
import { shallow } from "zustand/shallow";
import { getAddress } from "../../helper";
import { get } from "@react-native-firebase/database";

const SHEET_ON_ADDRESS = 0
const SHEET_ON_PICK = 1
const SHEET_ON_DIALOG = 2

const OnewayComponent = (props) => {
    const { t } = props
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [on_load, setOnLoad] = useState(0);
    const [data, setData] = useState("");
    const [ready, setReady] = useState(false);
    const mapRef = useRef(null);
    const [markerReady, setMarkerReady] = useState(false)
    const { location, setLocation, heading, isTracking, startTracking, stopTracking, isLocationAvailable } = useGeolocation((state) => state, shallow);
    const [tmpRegion, setRegionTmp] = useState({ ...location, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA })
    const [markers, setMarkers] = useState([])
    const [sheetCurrent, setSheetCurrent] = useState(SHEET_ON_ADDRESS)
    const [dialogFrom, setDialogFrom] = useState('none')
    const [addressFromGPS, setAddressFromGPS] = useState('')


    const go_back = () => {
        navigation.goBack();
    }
    const [markerLoc, setMarkerLoc] = useState({})
    const [mapregion, setmapregion] = useState(location)

    useEffect(() => {

    }, [])

    useEffect(() => {
        // call_get_about();

        setMarkerLoc({ ...location })
    }, [location]);

    // const call_get_about = () => {
    //     setLoading(true);
    //     axios({
    //         method: 'post',
    //         url: api_url + get_about,
    //         data: { lang: global.lang }
    //     })
    //         .then(async response => {
    //             setLoading(false);
    //             setData(response.data.result)
    //             setOnLoad(1);
    //         })
    //         .catch(error => {
    //             setLoading(false);
    //             alert('Sorry something went wrong')
    //         });
    // }

    useEffect(() => {
        console.log('ue smooth', location)
        // if (location && mapRef.current) {

        //     mapRef.current.animateCamera({
        //         center: { ...tmpRegion, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA },
        //         pitch: 0,
        //         altitude: 1000,
        //     }, { duration: 300 });
        // }
        // setTimeout(() => {
        //     setMarkerReady(true)
        // }, 300)

        console.log('tmpRegion', tmpRegion)
        getAddress(tmpRegion.latitude, tmpRegion.longitude).then((address) => {
            setAddressFromGPS(address.formatted_address)
            console.log('ue tmpregion', addressFromGPS)
        })


    }, [tmpRegion]);

    const onRegionChangeComplete_ = useCallback((region, details) => {
        console.log('onregionchange', region, details)
        setRegionTmp({ ...region, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA })

    }, [])

    const addMarker = useCallback(async () => {
        setMarkers([{
            latitude: tmpRegion.latitude,
            longitude: tmpRegion.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,

        }])


        axios({
            method: 'post',
            url: api_url_driver + 'onewaygps',
            data: {
                get: 0,
                driver_id: global.id,
                latitude: tmpRegion.latitude || 0,
                longitude: tmpRegion.longitude || 0,
                place: 'address',
            }
        })
            .then(response => {
                console.log('set one way', response)
            })
            .catch(error => {
                console.error('set one way error', error)
            });
    }, [tmpRegion])

    const isFocused = useIsFocused()

    useEffect(() => {
        axios({
            method: 'post',
            url: api_url_driver + 'onewaygps',
            data: {
                get: 1,
                driver_id: global.id,
                latitude: tmpRegion.latitude || 0,
                longitude: tmpRegion.longitude || 0,
                place: 'address',
            }
        })
            .then(response => {
                console.log('get one way', response)
                const lat = parseFloat(response.data.gps.latitude)
                const lng = parseFloat(response.data.gps.longitude)
                setRegionTmp({ latitude: lat, longitude: lng, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA })
                setMarkers([
                    {
                        latitude: lat,
                        longitude: lng,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }
                ])
                setmapregion({ latitude: lat, longitude: lng, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA })
            })
            .catch(error => {
                console.error('get one way error', error)
            });
    }, [isFocused])

    // ref
    const bottomSheetRef = useRef(null);

    // callbacks
    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
    }, []);

    const handlePressMap = useCallback((e) => {
        if (sheetCurrent !== SHEET_ON_PICK) {
            return
        }
        const { latitude, longitude } = e.nativeEvent.coordinate;
        console.log("Tapped at:", latitude, longitude);

        // set state for marker
        setMarkers([
            {
                latitude,
                longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
        ]);

        setRegionTmp({ latitude, longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA })

        // // save to backend
        // axios.post(api_url_driver + "onewaygps", {
        //     get: 0,
        //     driver_id: global.id,
        //     latitude,
        //     longitude,
        // })
        //     .then((res) => console.log("set one way success", res.data))
        //     .catch((err) => console.error("set one way error", err));
    }, [sheetCurrent])

    const handlePlaceSelected = useCallback((place) => {
        console.log('place', place)
        const { lat: latitude, lng: longitude } = place.geometry.location
        setRegionTmp({ latitude, longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA })
        setmapregion({ latitude, longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA })
        // set state for marker
        setMarkers([
            {
                latitude,
                longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
        ]);

        // // save to backend
        // axios.post(api_url_driver + "onewaygps", {
        //     get: 0,
        //     driver_id: global.id,
        //     latitude,
        //     longitude,
        // })
        //     .then((res) => console.log("set one way success", res.data))
        //     .catch((err) => console.error("set one way error", err));
    }, [])

    const handleUpdateBE = () => {
        // axios.post(api_url_driver + "onewaygps", {
        //     get: 0,
        //     driver_id: global.id,
        //     latitude: tmpRegion.latitude,
        //     longitude: tmpRegion.longitude,
        //     place: 'address',
        // })
        //     .then((res) => console.log("set one way success", res.data))
        //     .catch((err) => console.error("set one way error", err));
        setSheetCurrent(SHEET_ON_DIALOG)
        setDialogFrom('pick')
    }

    const handleCloseSheet = useCallback(() => {
        bottomSheetRef.current.snapToIndex(0)
    }, [])



    const SheetCurrent = useCallback(({ currentSheet }) => {
        const [isProcessing, setIsProcessing] = useState(false)

        const handleEdit = useCallback(() => {
            setSheetCurrent(SHEET_ON_PICK)
        }, [])

        const handleOff = useCallback(() => {
            setAddressFromGPS('')
            axios.post(api_url_driver + "onewaygps", {
                get: 3,
                driver_id: global.id,
                latitude: tmpRegion.latitude,
                longitude: tmpRegion.longitude,
                place: '-',
            })
                .then((res) => {
                    console.log("set one way success", res.data)
                    setSheetCurrent(SHEET_ON_ADDRESS)
                    setDialogFrom('address')
                    bottomSheetRef.current.close()
                    navigation.goBack()

                })
                .catch((err) => console.error("set one way error", err))
                .finally(() => {

                })

        }, [])

        const handleYes = useCallback(() => {
            console.log('dialogfrom', dialogFrom)
            if (dialogFrom === 'pick') {
                console.log('addressFromGPS', dialogFrom, addressFromGPS)
                // save to backend
                setIsProcessing(true)
                axios.post(api_url_driver + "onewaygps", {
                    get: 0,
                    driver_id: global.id,
                    latitude: tmpRegion.latitude,
                    longitude: tmpRegion.longitude,
                    place: addressFromGPS,
                })
                    .then((res) => {
                        console.log("set one way success", res.data)
                        setSheetCurrent(SHEET_ON_ADDRESS)
                        setDialogFrom('address')
                        go_back()

                    })
                    .catch((err) => console.error("set one way error", err))
                    .finally(() => {
                        setIsProcessing(false)
                    })

            }

        }, [])

        const handleNo = useCallback(() => {
            setSheetCurrent(SHEET_ON_ADDRESS)
            setDialogFrom('none')
        }, [])



        if (currentSheet === SHEET_ON_PICK) {
            // setDialogFrom('pick')
            return (
                <BottomSheetView style={styles2.contentContainer} >
                    <View style={{ width: '100%', borderWidth: 1, borderColor: 'gray', borderRadius: 8 }}>
                                <GooglePlacesInput
                            minLength={5}
                            onPlaceSelected={handlePlaceSelected}
                        />

                    </View>
                        <View style={{ width: '100%', flexDirection: 'row-reverse' }}>
                        <TouchableOpacity onPress={handleUpdateBE} activeOpacity={0.5} style={{ marginTop: 10, width: 130, height: 35, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.btn_color, borderRadius: 8 }}>
                            <Text style={{ color: colors.theme_fg_three }}>{t('set_oneway_destination')}</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetView>
            )
        }


        if (currentSheet === SHEET_ON_ADDRESS) {

            // const address = getAddressNow()
            // console.log('address', getAddressNow())
            // console.log('tmpRegion', tmpRegion)
            // getAddress(tmpRegion.latitude, tmpRegion.longitude).then((address) => {
            //     setAddressFromGPS(address.formatted_address)
            //     console.log(addressFromGPS, address)
            // })
            return (
                <BottomSheetView style={styles2.contentContainer} >

                    <View style={{ width: '90%', }}>
                        <Text style={{ color: 'black', width: '90%' }}>{addressFromGPS}</Text>
                        <View style={{ width: '100%', flexDirection: 'row', gap: 20, marginTop: 15 }}>
                            <TouchableOpacity onPress={handleEdit} activeOpacity={0.5} style=
                                {{ width: '20%', widthmarginTop: 10, height: 35, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.btn_color, borderRadius: 8 }}>
                                <Text style={{ color: colors.theme_fg_three }}>{t('edit')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleOff} activeOpacity={0.5} style=
                                {{ width: '20%', widthmarginTop: 10, height: 35, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.btn_color, borderRadius: 8 }}>
                                <Text style={{ color: colors.theme_fg_three }}>{t('off')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheetView>
            )
        }

        if (currentSheet === SHEET_ON_DIALOG) {

            return (
                <BottomSheetView style={styles2.contentContainer} >
                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <Text style={{ color: 'black', width: '90%' }}>{t('continue_action')}</Text>
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', gap: 15 }}>


                        <TouchableOpacity loading={isProcessing} onPress={handleYes} activeOpacity={0.5} style={{ marginTop: 10, width: 130, height: 35, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.btn_color, borderRadius: 8 }}>
                            <Text style={{ color: colors.theme_fg_three }}>{t('ok')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNo} activeOpacity={0.5} style={{ marginTop: 10, width: 130, height: 35, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.btn_color, borderRadius: 8 }}>
                            <Text style={{ color: colors.theme_fg_three }}>{t('cancel')}</Text>
                        </TouchableOpacity>


                    </View>
                </BottomSheetView>
            )
        }

        return null

    }, [addressFromGPS, dialogFrom])

    return (
        <GestureHandlerRootView style={styles2.container}>
            <View >
                <View style={styles.container}>
                    <StatusBar
                        backgroundColor={colors.theme_bg}
                    />
                    <View style={[styles.header]}>
                        <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
                        </TouchableOpacity>
                        <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>{t('one_way_setting')}</Text>
                        </View>
                    </View>
                    <View>

                        {location ?
                            <MapView
                                ref={mapRef}
                                // showsUserLocation={true}
                                region={{
                                    latitude: mapregion.latitude,
                                    longitude: mapregion.longitude,
                                    latitudeDelta: LATITUDE_DELTA,
                                    longitudeDelta: LONGITUDE_DELTA,
                                }}
                                style={{
                                    ...StyleSheet.absoluteFillObject,
                                    height: screenHeight,
                                    width: screenWidth,
                                    backgroundColor: colors.theme_bg,
                                }}
                                onMapReady={() => setReady(true)}
                                onRegionChangeComplete={onRegionChangeComplete_}
                                onPress={handlePressMap}
                            >
                                {markers.map((item, index) => (
                                    <Marker
                                        key={index}
                                        coordinate={{
                                            latitude: item.latitude || 0,
                                            longitude: item.longitude || 0
                                        }}

                                        title={t('your_location')}
                                    />
                                ))}



                            </MapView> : null}

                        {/* <View style={{ ...StyleSheet.absoluteFillObject, height: 65, width: 65, alignSelf: 'center', top: (screenHeight / 2) - 58, left: (screenWidth / 2) - 32, zIndex: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={pin_new} style={{ width: 65, height: 65, zIndex: 8 }} />

                        </View>

                    </View> */}


                    </View>
                </View>


                <BottomSheet
                    ref={bottomSheetRef}
                    // onChange={handleSheetChanges}

                    snapPoints={['32%', '60%']}

                    index={0}
                    style={{ zIndex: 5 }}
                    enablePanDownToClose={false}

                >

                    <SheetCurrent currentSheet={sheetCurrent} />

                </BottomSheet>
            </View>
        </GestureHandlerRootView>

    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: colors.theme
    },
    header: {
        height: 60,
        backgroundColor: colors.theme_bg,
        flexDirection: 'row',
        alignItems: 'center'
    },
});

const styles2 = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'grey',
    },
    contentContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
});



export default withTranslation(OnewayComponent);
