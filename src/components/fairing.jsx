import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Pressable, KeyboardAvoidingView, Alert } from 'react-native';
import OtpTextInput from 'react-native-text-input-otp';
import { useGlobalStore } from '../reducers/zustand';
import { useNavigation } from '@react-navigation/native';
import { api_url, prefix } from '../config/Constants';
import axios from 'axios';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import withTranslation from '../hook/withTranslation'
import { formatCurrency } from '../helper';

const Fairing = ({ setStatus, t }) => {
    const slide = React.useRef(new Animated.Value(300)).current;
    const [otp, setOtp] = React.useState('');
    const setIsShowTabNavigator = useGlobalStore((state) => state.setIsShowTabNavigator)
    const navigation = useNavigation()

    const slideUp = () => {
        // Will change slide up the bottom sheet
        Animated.timing(slide, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
        }).start();
    };

    const slideDown = () => {
        // Will slide down the bottom sheet
        Animated.timing(slide, {
            toValue: 300,
            duration: 800,
            useNativeDriver: true,
        }).start();
    };


    useEffect(() => {
        setIsShowTabNavigator(false)
        slideUp()
    }, [])


    const closeModal = () => {

        slideDown();
        setIsShowTabNavigator(true)
        setTimeout(() => {
            setStatus(false);
        }, 800)

    }

    const accept = async () => {

        // await axios({
        //     method: "post",
        //     url: api_url + `${prefix}get_fairing_trip`,
        //     data: { otp: otp }
        // })
        //     .then(async (response) => {
        //         // console.log('acc', response)
        //         console.log(response)

        //     })
        //     .catch((error) => {
        //         console.log('crc err', error);
        //     });
        fetch(api_url + `${prefix}get_fairing_trip_new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ otp, driver_id: global.id })
        }).then((res) => res.json()).then((res) => {
            console.log('fairing', res)
            if (res.error) {
                console.log('fairing err', res)
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'ERROR',
                    textBody: `${res.msg}`,
                })
            } else {
                if (res.result != 0 && res.valid) {

                    navigation.navigate("BookingRequest", {
                        trip_id: res.result,
                    });

                } else {
                    Toast.show({
                        type: ALERT_TYPE.DANGER,
                        title: 'SALDO DRIVER',
                        textBody: `Maaf, silakan topup kembali, saldo anda (${formatCurrency(res.saldo)}) tidak mencukupi untuk menerima order ini..`,
                    })
                }

            }
            setStatus(false)
            setIsShowTabNavigator(true)


        }).catch((error) => {
            console.log(error)
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'ERROR',
                textBody: `Error detected on server please contact admin..${error}`,
            })
        })


    }


    return (

        <Pressable onPress={closeModal} style={styles.backdrop} >
            <Pressable style={{ width: '100%', height: '60%', }}>
                <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slide }] }]}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{t('otp_fairing')}</Text>
                    <KeyboardAvoidingView behavior={'padding'} style={{ marginTop: 20 }}>
                        <OtpTextInput
                            otp={otp}
                            setOtp={setOtp}
                            digits={4}
                            style={{ backgroundColor: 'white', borderBottomWidth: 2, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0 }}
                            fontStyle={{ fontWeight: 'bold', fontSize: 25 }}
                            focusedStyle={{ borderColor: '#40A2E3' }}
                        />
                        <TouchableOpacity onPress={accept.bind(this)} style={styles.button}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>{t('accept_trip')}</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </Animated.View>
            </Pressable>

        </Pressable>

    )
}


export default withTranslation(Fairing);


const styles = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        flex: 1,
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',

    },
    bottomSheet: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingHorizontal: 15,
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
    }
})