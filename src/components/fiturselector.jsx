import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Switch, KeyboardAvoidingView, Pressable, Dimensions, Button, Image } from 'react-native';
import OtpTextInput from 'react-native-text-input-otp';
import { useAntrianStore, useGlobalStore, useOneWay, useOnewayDashboardStore, useStore } from '../reducers/zustand';
import { useNavigation } from '@react-navigation/native';
import { api_url, logo, prefix, QRCODE_ANTRIAN_VALUE, screenHeight, screenWidth, selector_img } from '../config/Constants';
import axios from 'axios';
import { theme_bg_blue } from '../assets/css/Colors';
import database from "@react-native-firebase/database";
import { connect } from 'react-redux';
import { callBandaraFiturs, get_driver_fiturs, getCurrentLocation, mapDispatchToProps, mapStateToProps, pushAntrian, translate_driver_fiturs } from '../helper';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, } from 'react-native-reanimated';
import Icon, { Icons } from './Icons';
import * as colors from "../assets/css/Colors";


import { Camera, CameraType } from 'react-native-camera-kit';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { shallow } from 'zustand/shallow';

const FiturSelector = (props) => {
    const slide = useSharedValue(300)

    const setIsShowTabNavigator = useGlobalStore((state) => state.setIsShowTabNavigator)
    const navigation = useNavigation()
    const fiturs = useStore((state) => state.fiturs)
    const setFiturs = useStore((state) => state.setFiturs)
    const { setOpen } = props
    const [isScan, setIsScan] = useState(false)
    const [scannedValue, setScannedValue] = useState('');
    const [permitRenderScan, setPermitRenderScan] = useState(false)
    const onewayFlag = useOnewayDashboardStore((state) => state.onewayFlag)



    const slideUp = () => {
        // Will change slide up the bottom sheet
        slide.value = withTiming(0, {
            duration: 800,
        })
        // Animated.timing(slide, {
        //     toValue: 0,
        //     duration: 800,
        //     useNativeDriver: true,
        // }).start();
    };

    const slideDown = () => {
        // Will slide down the bottom sheet
        // Animated.timing(slide, {
        //     toValue: 300,
        //     duration: 800,
        //     useNativeDriver: true,
        // }).start();
        slide.value = withTiming(300, { duration: 800 })
    };





    const closeModal = () => {

        slideDown();
        // setIsShowTabNavigator(true)
        setTimeout(() => {
            setOpen(false);
        }, 400)

    }




    const Fitur = ({ data, handleParent }) => {
        const [value, setValue] = useState(data.status)
        const handleChange = (status) => {

            // if (data?.autobid === 0) {
            console.log('fitur change', data)
            setValue(status)
            handleParent(data, status)
            // }

        }

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                <Text style={{ color: 'black' }}>{data.name}</Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={value ? theme_bg_blue : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => handleChange(!value)}
                    value={value}
                    disabled={(data.autobid === 1) && data.status}
                />
            </View>
        )
    }

    const Fiturs = ({ data }) => {
        const [value, setValue] = useState(Array.isArray(data) ? data : [])
        // console.log('fiturs comp', data)
        const changeParent = (data, status) => {
            const isBike = data.id === 4 && status
            const isOther = [3, 9].includes(data.id) && status
            console.log('fiturs parent', { data, status })
            const A = value.map((B) => {
                if (B.id == data.id) B.status = status

                return B
            }).map((C) => {
                //if status true



                if (isBike) {
                    C.status = C.id !== 4 ? false : true
                } else {
                    C.status = C.id === 4 ? false : C.status
                }

                return C
            })

            // console.log('A', A)
            setValue(A)
            setFiturs(A)
            updateFirebase(A)

        }


        return (<>{value.map((fitur, idx) =>
        (
            <Fitur key={idx} data={fitur} handleParent={changeParent} />
        ))}</>)
    }



    const updateFirebase = (data) => {

        // const refDriver = database().ref(`drivers/${fitur}/${global.id}`)
        // refDriver.update({ online_status: status ? 1 : 0 })

        const shot = data.map((A) => {
            return {
                vt: Number(A.id),
                online_status: A.status ? 1 : 0
            }
        })

        // console.log(JSON.stringify({ actives: shot, driver_id: global.id }))
        // axios({
        //     method: "post",
        //     url: api_url + prefix + 'update_fitur_active',
        //     data: { actives: shot, driver_id: global.id },
        // })
        //     .then(async (response) => {
        //         console.log(response)
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });
        console.log('region on handle change', props.initial_region)
        fetch(api_url + prefix + 'update_fitur_active', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ actives: shot, driver_id: global.id, region: props.initial_region })
        }).then((res) => res.text()).then((res) => console.log(res)).catch((err) => console.log(err))

        // refDriver.on('value', (snapshot) => {
        // const driver_id = snapshot.val() ? snapshot.val().driver_id ? snapshot.val().driver_id : null : null
        // const booking = snapshot.val() ? snapshot.val().booking ? snapshot.val().booking : null : null
        // const driver_id = getValueOfSnapshot(snapshot, 'driver_id')
        // const booking = getValueOfSnapshot(snapshot, 'booking')
        // const d = { driver_id, booking }


        // if (!d.driver_id) refDriver.update({ driver_id: Number(global.id) })
        // if (!d.booking) database().ref(`drivers/${fitur}/${global.id}/booking`).update({ booking_status: 0 })

        // })
    }



    useEffect(() => {
        // setIsShowTabNavigator(false)
        get_driver_fiturs(global.id).then((__fiturs__) => {
            const fiturs__ = __fiturs__.result
            console.log('1', fiturs)

            const getDriverFiturs = (driver_id, fiturs) => new Promise(async (resolve, reject) => {


                translate_driver_fiturs(driver_id).then((res) => resolve(res.result)).catch((err) => reject(err))
            })

            const getDataV = (id) => {
                const result = fiturs__.fitures_name.filter((val) => {
                    return val.id == id
                })
                return result[0]
            }

            const tmp = fiturs__.vehicle_actives.map((item, idx) => {

                return {
                    id: item,
                    name: getDataV(item).vehicle_type,
                    status: false

                }
            })

            console.log('tmp', tmp)

            getDriverFiturs(global.id, tmp).then((res) => {
                console.log('getDriverFiturs', res)

                setFiturs(res)


                // updateFirebase(res)
            }).catch((err) => console.log('err gdf', err))


        }).catch((error) => console.log('gdf err', error))
        slideUp()
    }, [])

    useEffect(() => { console.log('fiturs chg parent', props.initial_region) }, [props.initial_region])

    const SelectorLayanan = () => (<><View style={{ marginTop: 20, }}>
        {fiturs ? <Fiturs data={fiturs} /> : null}


    </View></>)

    const handleAntrianScan = useCallback(() => {
        if (!isAntrianRunning)
            setIsScan(true)


    }, [isAntrianRunning])

    const [bandaraFitur, setBandaraFitur] = useState([])

    // const getFiturBandara = useCallback(() => {
    //     callBandaraFiturs().then((res) => {
    //         const data = res.data.map((itm) => {
    //             return itm.vehicle_type
    //         })

    //         return data
    //     }).catch((err) => console.log(err))
    // }, [])

    const PerformanceDriver = memo(() => {
        const [permitScan, setPermitScan] = useState(false)

        useEffect(() => {
            callBandaraFiturs().then((res) => {
                const data = res.data.data.map((itm) => {
                    return itm.vehicle_type
                })

                const arrA = fiturs.map((itm) => itm.id)
                const hasCommon = data.some((itm) => arrA.includes(itm))

                setPermitScan(hasCommon)

            })
            console.log(fiturs)
        }, [])

        useEffect(() => {
            //gama ride off
            const filterRide = fiturs.filter((itm) => itm.id === 4)

            if (filterRide.length) {
                if (filterRide[0].status) {
                    setPermitScan(false)
                    console.log('gamaride on')
                }
            }

            const call_bandara = async () => {

                const url = api_url + 'antrian/fiturs_bandara'

                //bandara
                const resp = await axios.get(url)
                if (resp.status == 200) {
                    const dataBandara = resp.data.data.map((itm) => {
                        return itm.vehicle_type
                    })

                    const filterBandara = fiturs.filter((itm) => dataBandara.includes(itm.id) && itm.status)
                    if (filterBandara.length) {

                        setPermitScan(true)
                    } else {

                        setPermitScan(false)
                    }
                }

                //outside

                const resp2 = await axios.get(url + '?zone=0')
                if (resp2.status == 200) {
                    const dataBandara2 = resp2.data.data.map((itm) => {
                        return itm.vehicle_type
                    })

                    const filterBandara2 = fiturs.filter((itm) => dataBandara2.includes(itm.id) && itm.status)
                    if (filterBandara2.length) {

                        setPermitScan(false)
                    }
                }

            }

            call_bandara()


        }, [fiturs])


        const ScanButtonPart = memo(({ isAntrianRunning, handleAntrianScan }) => {
            return (
                <><View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>Antrian</Text>
                    <TouchableOpacity disabled={isAntrianRunning} onPress={() => handleAntrianScan()} activeOpacity={0.5} style={{ width: 60, padding: 8, borderRadius: 8, backgroundColor: isAntrianRunning ? 'gray' : '#40A2E3' }}>
                        <Text style={{ fontSize: 14, fontWeight: 'regular', color: 'white', textAlign: 'center' }}>{isAntrianRunning ? 'Done' : 'Scan'}</Text>
                    </TouchableOpacity>
                </View>

                    <View style={{ borderTopColor: 'gray', borderTopWidth: 0.5, marginTop: 15 }}></View></>
            )
        })

        return (
            <><KeyboardAvoidingView behavior={'padding'} style={{ marginTop: 20, }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14, fontWeight: 'regular', color: 'black' }}>Penerimaan bid</Text>
                    <Text style={{ fontSize: 14, fontWeight: 'regular', color: 'black' }}>Penyelesaian trip</Text>
                </View>


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, }}>
                        <Icon type={Icons.Ionicons} name="speedometer-outline" color={'orange'} style={{ fontSize: 22 }} />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>100%</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, }}>
                        <Icon type={Icons.Ionicons} name="walk-outline" color={'orange'} style={{ fontSize: 22 }} />

                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>100%</Text>
                    </View>
                </View>

                <View style={{ borderTopColor: 'gray', borderTopWidth: 0.5, marginTop: 15 }}></View>

                {permitScan ? <ScanButtonPart isAntrianRunning={isAntrianRunning} handleAntrianScan={handleAntrianScan} /> : null
                }

                {onewayFlag ? null : <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>Ketersediaan layanan</Text>

                    </View>

                    <SelectorLayanan />
                </View>}




                <OneWaySwitch permitted={permitScan} />

            </KeyboardAvoidingView ></>
        )
    })

    const { isAntrianRunning, setIsAntrianRunning, latitude: geolat, longitude: geolng } = useAntrianStore((state) => state, shallow)

    useEffect(() => {
        if (scannedValue == QRCODE_ANTRIAN_VALUE) {
            setIsScan(false)
            // setIsAntrianRunning(true)
            pushAntrian({ latitude: geolat, longitude: geolng }).then((res) => {
                if (res.key)
                    global.keyAntrian = res.key
                console.log('push antrian ', res)
            }).catch((err) => console.log('push antrian err', err))
        } else {
            // setIsAntrianRunning(false)
        }
    }, [scannedValue])

    const ScanAntrian = () => {

        const cameraRef = useRef(null);

        const onReadCode = (event) => {
            setScannedValue(event.nativeEvent.codeStringValue)
        }
        return (
            <><Camera
                ref={cameraRef}
                cameraType={CameraType.Back} // front/back(default)
                flashMode="auto"
                scanBarcode={true}

                onReadCode={onReadCode}
                showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner, that stops when a code has been found. Frame always at center of the screen
                laserColor='red' // (default red) optional, color of laser in scanner frame
                frameColor='white' // (default white) optional, color of border of scanner frame
            /></>

        )
    }

    const { oneWay, setOneWay } = useOneWay()
    const [isOneWayPickDialog, setIsOneWayDialog] = useState(false)

    const OneWaySwitch = ({ permitted }) => {
        const [notPermitted, setNotPermitted] = useState(false)

        // useEffect(() => {
        // setNotPermitted(!permitted)
        // }, [permitted])

        useEffect(() => {
            console.log('oneway', oneWay)
        }, [oneWay])

        const handleOneWayTick = (b) => {

            setOneWay(!oneWay);
            setIsOneWayDialog(!oneWay)
        }

        return (
            <View>
                <View style={{ borderTopColor: 'gray', borderTopWidth: 0.5, marginTop: 15 }}></View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>One Way Trip</Text>

                </View>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                    <Text style={{ color: 'black' }}>Tujuan searah</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={oneWay ? theme_bg_blue : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={handleOneWayTick}
                        value={oneWay}
                    // disabled={notPermitted}
                    />
                </View> */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                    <Text style={{ color: 'black' }}>Setup Tujuan</Text>
                    <Button title='Setup' onPress={() => navigation.navigate('Oneway')}></Button>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 0, marginBottom: 10 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'regular', color: 'black', fontStyle: 'italic', textAlign: 'left' }}>Kuota sehari 2x</Text>

                </View>
            </View>
        )

    }




    const MainContent = useCallback(() => {


        return (
            <>{isScan ? <ScanAntrian /> : <PerformanceDriver />}</>
        )
    }, [])

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: slide.value }],
        };
    });

    return (
        <Pressable onPress={closeModal} style={styles.backdrop} >

            <Animated.View style={[{ ...styles.bottomSheet }, animatedStyle]}>
                <MainContent />
            </Animated.View>


        </Pressable>
    )
}


export default connect(mapStateToProps, mapDispatchToProps)(FiturSelector);


const styles = StyleSheet.create({
    backdrop: {
        position: 'absolute',

        flex: 1,
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        // backgroundColor: 'red',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',

    },
    bottomSheet: {
        width: '85%',
        height: '72%',
        margin: 'auto',

        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 25,
        paddingVertical: 20
    },
    input: {
        width: '100%',
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#bcbcbc',
        paddingHorizontal: 15,
        marginBottom: 10
    },
    button: {
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#40A2E3',
        alignItems: 'center',
        marginTop: 15
    },
    overlay: {
        position: 'absolute',
        bottom: 80,
        width: '100%',
        alignItems: 'center',
    },
    scanText: {
        color: 'white',
        fontSize: 18,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 6,
    },
    cameraWrapper: {
        width: screenWidth * 0.9,
        height: 300, // set the camera view height
        overflow: 'hidden',
        borderRadius: 10,
    },
    text: {
        marginTop: 20,
        fontSize: 16,
    },
})