import React, { useState, useEffect, memo, useCallback, useMemo, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    StatusBar,
    BackHandler,
    FlatList
} from "react-native";
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight, screenWidth, normal, bold, api_url, get_bill, regular, app_name, f_25, f_s, f_xs, f_m, change_trip_status, f_xl, LATITUDE_DELTA, LONGITUDE_DELTA, GOOGLE_KEY } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { Badge } from 'react-native-paper';
import axios from 'axios';
import { formatCurrency } from "../helper";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const Bill = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const [loading, setLoading] = useState(false);
    const [on_load, setOnLoad] = useState(0);
    const [data, setData] = useState("");
    const [trip_id, setTripId] = useState(route.params.trip_id);
    const [from, setFrom] = useState(route.params.from);
    const [isViewMap, setIsViewMap] = useState(false)


    const getTotalFare = (total, tol, parkir) => {
        return parseFloat(tol) + parseFloat(parkir) + parseFloat(total);
    }
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            if (from == 'shared_trip') {
                call_change_trip_status()
            }
        });
        call_get_bill();
        // BackHandler.addEventListener("hardwareBackPress", handle_back_button_click);
        return () => {
            unsubscribe
            // BackHandler.removeEventListener("hardwareBackPress", handle_back_button_click);
        };
    }, []);

    const call_change_trip_status = async () => {
        setLoading(true);
        await axios({
            method: 'post',
            url: api_url + change_trip_status,
            data: { trip_id: trip_id, status: 5 }
        })
            .then(async response => {
                //call_get_ongoing_trip_details_shared();
            })
            .catch(error => {
                setLoading(false);
            });
    }

    const handle_back_button_click = () => {
        navigation.navigate('Home')
    }

    const go_back = () => {
        navigation.goBack();
    }

    const call_get_bill = () => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + get_bill,
            data: { trip_id: trip_id }
        })
            .then(async response => {
                setLoading(false);
                setData(response.data.result)
                setOnLoad(1);
                console.log(response.data.result)
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong')
            });
    }

    const harga_perjalanan = useMemo(() => {

        return data ? parseFloat(data.total) - parseFloat(data.tol) - parseFloat(data.parkir) - parseFloat(data?.fare.biaya_layanan) - parseFloat(data?.fare.surcharge) : 0;
    }, [data])

    const pendapatan_bersih = useMemo(() => {
        return data ? parseFloat(data.bersih) - parseFloat(data?.fare.biaya_layanan) - parseFloat(data?.fare.surcharge) : 0;
    }, [data])

    const navigate_rating = (data) => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Rating", params: { data: data } }],
            })
        );
    }

    const BillMultiDrops = useCallback(() => {
        const [dataMultiDrops, setDataMultiDrops] = useState([])
        useEffect(() => {
            if (data) {
                if (data.is_multiple_drops) {
                    setDataMultiDrops(data.stops.map((el, idx) => ({ ...el, no: idx + 1 })))
                } else {
                    setDataMultiDrops([{ id: 1001, no: '', address: data.drop_address }])
                }
            }
        }, [data])
        return (
            <FlatList
                data={dataMultiDrops}
                renderItem={({ item }) => (<Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_xs, fontFamily: regular }}>{item.no}. {item.address}</Text>)}
                keyExtractor={item => item.id}
            />

        )
    }, [data])

    const RincianPendapatan = () => (<>
        <View style={{
            flexDirection: 'row', padding: 12,
            paddingLeft: 16, paddingRight: 16, backgroundColor: 'white', borderRadius: 10
        }}>
            <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_m, fontFamily: regular }}>Pendapatan Bersih</Text>
                    {/* <View style={{ margin: 5 }} />
                                    <Icon type={Icons.MaterialIcons} name="credit-card" color={colors.theme_fg_two} style={{ fontSize: 30 }} /> */}
                </View>
            </View>
            <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xl, fontFamily: bold }}>{formatCurrency(pendapatan_bersih)}</Text>
            </View>
        </View>

        <View style={{ margin: 7 }} />

        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', padding: 25, backgroundColor: 'white', borderRadius: 20 }}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: normal }}>Harga perjalanan</Text>
                </View>
                <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_s, fontFamily: normal }}>{formatCurrency(harga_perjalanan)}</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderColor: colors.grey, marginTop: 10, paddingTop: 10 }}>
                <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: normal }}>Biaya Lokasi</Text>
                </View>
                <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_s, fontFamily: normal }}>{formatCurrency(data.fare.surcharge)}</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderColor: colors.grey, marginTop: 10, paddingTop: 10 }}>
                <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: normal }}>Biaya Layanan</Text>
                </View>
                <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_s, fontFamily: normal }}>{formatCurrency(data.fare.biaya_layanan)}</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderColor: colors.grey, marginTop: 10, paddingTop: 10 }}>
                <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: normal }}>Tip</Text>
                </View>
                <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_s, fontFamily: normal }}>{formatCurrency(data.tip)}</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderColor: colors.grey, marginTop: 10, paddingTop: 10 }}>
                <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: normal }}>Tol</Text>
                </View>
                <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_s, fontFamily: normal }}>{formatCurrency(data.tol)}</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderColor: colors.grey, marginTop: 10, paddingTop: 10 }}>
                <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: normal }}>Parkir</Text>
                </View>
                <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_s, fontFamily: normal }}>{formatCurrency(data.parkir)}</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderColor: colors.grey, marginTop: 10, paddingTop: 10 }}>
                <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: normal }}>Dibayarkan Penumpang</Text>
                    {data.payment_method === 39 ?
                        <Text numberOfLines={1} style={{
                            color: 'white', backgroundColor: 'green',
                            borderRadius: 3, padding: 8, marginTop: 10, fontSize: f_xs, fontFamily: normal
                        }}>{data.payment_method === 39 ? 'NON TUNAI' : 'TUNAI'}</Text> : null}


                </View>
                <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <Text numberOfLines={1} style={{ color: 'black', fontSize: f_s, fontFamily: normal, fontWeight: 'bold' }}>{formatCurrency(data.total)}</Text>
                </View>
            </View>

        </View>
    </>
    )

    const MapPerjalanan = () => {
        const mapView_ref = useRef(null)
        const [region_viewmap, setRegionViewMap] = useState()
        const destination_region = data.stops.map((itm) => {
            return {
                latitude: itm.latitude,
                longitude: itm.longitude
            }
        })[0]
        useEffect(() => {
            console.log('Map Perjalanan', data)
            setRegionViewMap({ latitude: parseFloat(data.pickup_lat), longitude: parseFloat(data.pickup_lng), latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA })
        }, [])
        return (
            <>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    ref={mapView_ref}
                    style={{ width: '100%', height: '300' }}
                    region={region_viewmap}
                >
                    <Marker
                        key={'pickup'}
                        coordinate={{ latitude: parseFloat(data.pickup_lat), longitude: parseFloat(data.pickup_lng) }}
                        title={'Pickup address'}
                        description={data.pickup_address}
                    />

                    <Marker
                        key={'destination'}
                        coordinate={{ latitude: parseFloat(destination_region.latitude), longitude: parseFloat(destination_region.longitude) }}
                        title={'Pickup address'}
                        description={data.pickup_address}
                        pinColor="green"
                    />

                    {/* {data.stops.map((item, idx) => (<Marker key={idx}
                        coordinate={{ latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude) }}
                        title={'Dropoff address #' + idx}
                        description={item.address}
                    />))} */}
                    {/* <MapViewDirections
                        Icons
                        origin={{ latitude: parseFloat(data.pickup_lat), longitude: parseFloat(data.pickup_lng) }}
                        destination={{ latitude: destination_region.latitude, longitude: destination_region.longitude }}
                        apikey={GOOGLE_KEY}
                        strokeWidth={3}
                        strokeColor="blue"
                        // waypoints={getWayPoints(drop_address_state)}
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between`, params);
                        }}
                        onReady={result => {

                            // fetchTime(result.distance, result.duration),
                            mapView_ref.current.fitToCoordinates(result.coordinates, {
                                edgePadding: {
                                    right: 10,
                                    bottom: 0,
                                    left: 10,
                                    top: 50,
                                },
                            });
                        }}
                        onError={(errorMessage) => {
                            console.log('GOT AN ERROR map perjalanan');
                        }}
                    >

                    </MapViewDirections> */}


                </MapView>
            </>
        )
    }
    const insets = useSafeAreaInsets()

    return (
        <SafeAreaView style={{ ...styles.container, }}>
            <StatusBar
                backgroundColor={colors.theme_bg}
            />
            {on_load == 1 &&
                <View style={{ paddingBottom: insets.bottom }}>
                    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg, padding: 20, flexDirection: 'row' }}>
                        <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '10%', alignItems: 'flex-start', justifyContent: 'center' }}>
                            <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
                        </TouchableOpacity>
                        <View style={{ width: '90%', marginLeft: 16 }}>
                            <Text numberOfLines={1} style={{ color: colors.theme_fg_three, fontSize: f_25, fontFamily: regular, fontWeight: 'bold' }}>Perincian Pendapatan</Text>
                        </View>
                    </View>
                    <View style={{ padding: 20 }}>


                        <View style={{ margin: 1 }} />

                        {isViewMap ? <MapPerjalanan /> : <RincianPendapatan />}

                    </View>
                    <View style={{ borderTopWidth: 1, marginTop: 0, marginBottom: 0, borderColor: colors.theme_fg_two, borderStyle: 'dashed' }} />
                    <View style={{ padding: 20, backgroundColor: 'white', margin: 20, borderRadius: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_m, fontFamily: normal }}>Detail Perjalanan</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setIsViewMap(!isViewMap)
                                }}
                                activeOpacity={0.5}
                                style={{ backgroundColor: colors.btn_color, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                            ><Text style={{ color: 'white', padding: 10 }}>View</Text></TouchableOpacity>
                        </View>

                        <View
                            style={{ margin: 5 }} />
                        <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: regular }}>{data.trip_type_name} - {data.vehicle_type} | {data.distance} km</Text>
                        <View>
                            <View style={{ width: '100%', marginTop: 20 }}>
                                <TouchableOpacity activeOpacity={1} style={{ width: '100%' }}>
                                    <View style={{ flexDirection: 'row', width: '100%', height: 50 }}>
                                        <View style={{ width: '10%', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4 }}>
                                            <Badge status="success" backgroundColor="green" size={10} />
                                        </View>
                                        <View style={{ margin: 3 }} />
                                        <View style={{ width: '90%', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                            <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: regular }}>Pickup Address</Text>
                                            <View style={{ margin: 2 }} />
                                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_xs, fontFamily: regular }}>{data.pickup_address}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                {data.trip_type != 2 &&
                                    <TouchableOpacity activeOpacity={1} style={{ width: '100%' }}>
                                        <View style={{ flexDirection: 'row', width: '100%', height: 'auto' }}>
                                            <View style={{ width: '10%', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4 }}>
                                                <Badge status="error" backgroundColor="red" size={10} />
                                            </View>
                                            <View style={{ margin: 3 }} />
                                            <View style={{ width: '88%', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: regular }}>Drop Address</Text>
                                                <View style={{ margin: 2 }} />
                                                <BillMultiDrops />

                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{ borderTopWidth: 1, marginTop: 10, marginBottom: 10, borderColor: colors.theme_fg_two, borderStyle: 'dashed' }} />
                </View>
            }
            {
                data.customer_rating == 0 && from != 'trips' &&
                <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={handle_back_button_click.bind(this)} activeOpacity={1} style={{ width: '45%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontFamily: bold }}>Home</Text>
                    </TouchableOpacity>
                    <View style={{ width: '3%' }} />
                    <TouchableOpacity onPress={navigate_rating.bind(this, data)} activeOpacity={1} style={{ width: '45%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontFamily: bold }}> Ulasan</Text>
                    </TouchableOpacity>
                </View>
            }
            {
                data.customer_rating == 0 && from == 'trips' &&
                <View style={{ position: 'absolute', bottom: 0, width: '90%', height: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: "center" }}>
                    <TouchableOpacity onPress={navigate_rating.bind(this, data)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontFamily: bold }}>Ulasan</Text>
                    </TouchableOpacity>
                </View>
            }
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: screenHeight,
        width: screenWidth,
    },
});

export default Bill;