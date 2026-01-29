import React, { useState, useRef, useEffect } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    StatusBar,
    Image,
    Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { normal, bold, regular, check_phone, api_url, btn_loader, f_xs, f_m, f_l, logo_box } from '../config/Constants';

import axios from 'axios';
import LottieView from 'lottie-react-native';
import PhoneInput from 'react-native-phone-input';
import { useAtom } from "jotai";
import { ModeLoginAtom } from "../helper";
import DropShadow from "react-native-drop-shadow";
// import { getAuth, onAuthStateChanged, signInWithPhoneNumber } from "@react-native-firebase/auth";
import {
    AppleButton,
    appleAuth,
} from '@invertase/react-native-apple-authentication';


const CheckPhone = (props) => {
    const navigation = useNavigation();
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [validation, setValidation] = useState(false);
    const [formattedValue, setFormattedValue] = useState("");
    // const [modeLogin, setModeLogin] = useAtom(ModeLoginAtom)
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    const [confirm, setConfirm] = useState();
    const [isAppleLoginSupported] = useState(appleAuth.isSupported);

    const phone = useRef();


    axios.interceptors.request.use(async function (config) {
        // Do something before request is sent
        //console.log("loading")
        // setLoading(true);
        return config;
    }, function (error) {
        //console.log(error)
        setLoading(false);
        console.log("finish loading")
        // Do something with request error
        return Promise.reject(error);
    });

    // if (initializing) return null;

    // function handleAuthStateChanged(user) {
    //     console.log('user', user)
    //     setUser(user);
    //     if (initializing) setInitializing(false);
    // }

    // useEffect(() => {
    //     console.log('subscriber ue..')
    //     const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    //     return subscriber; // unsubscribe on unmount
    // }, []);

    //mode : 'login' | 'register'
    const check_valid = (mode) => {


        if ('+' + phone.current?.getCountryCode() == phone.current?.getValue()) {
            setValidation(false)
            //alert('Enter your phone number')
        } else if (!phone.current?.isValidNumber()) {
            setValidation(false)
            //alert('Please enter valid phone number')
            Alert.alert('Error', 'Please enter valid phone number')
            // alt({
            //     type: DropdownAlertType.Error,
            //     title: 'Error',
            //     message: 'Please enter valid phone number',
            // });

        } else {
            setValidation(true)
            // Alert.alert(phone.current?.getValue())
            setFormattedValue(phone.current?.getValue())
            call_check_phone(phone.current?.getValue(), mode);
        }
    }

    const call_check_phone = async (phone_with_code, mode) => {
        console.log({ phone_with_code: phone_with_code, mode: mode })
        setLoading(true);
        await axios({
            method: 'post',
            url: api_url + check_phone,
            data: { phone_with_code: phone_with_code, with_otp: 1 }
        })
            .then(response => {
                console.log('check phone', response.data)
                setLoading(false);
                // signInWithPhoneNumber(getAuth(), phone_with_code).then((res) => {
                //     console.log('confirmation', res)
                //     setConfirm(res)
                //     navigate(res, response.data.result, mode, response.data);
                // }).catch((err) => console.error('signinphone err', err))

                navigate(response.data.result, mode, response.data);
            }).catch((err) => console.log('checkphone error', err))


            .catch(error => {
                setLoading(false);
                console.log(error)
                Alert.alert('Error', 'Something went wrong')
                // alt({
                //     type: DropdownAlertType.Error,
                //     title: 'Error',
                //     message: 'Sorry something went wrong.',
                // });

            });
    }

    const navigate = async (data, mode, resp) => {
        let phone_number = phone.current?.getValue();
        phone_number = phone_number.replace("+" + phone.current?.getCountryCode(), "");
        console.log('modelogn', mode, data, resp)
        if (mode === 'login') {
            if (data.is_available == 1) {
                navigation.navigate('OTP', { otp: data.otp, phone_with_code: phone.current?.getValue(), country_code: "+" + phone.current?.getCountryCode(), phone_number: phone_number, id: 0, from: "login" });
                // navigation.navigate('Password', { phone_number: phone.current?.getValue() });


            } else {
                // navigation.navigate('OTP', { otp: data.otp, phone_with_code: phone.current?.getValue(), country_code: "+" + phone.current?.getCountryCode(), phone_number: phone_number, id: 0, from: "register" });
                Alert.alert('Data belum ada... Silakan login dengan nomer hp yg benar')
            }
        }

        if (mode === 'register') {
            if (data.is_available == 1) {

                // navigation.navigate('Password', { phone_number: phone.current?.getValue() });

                Alert.alert('Data sudah ada, silakan register dengan nomer baru...')
            } else {
                navigation.navigate('OTP', { otp: data.otp, phone_with_code: phone.current?.getValue(), country_code: "+" + phone.current?.getCountryCode(), phone_number: phone_number, id: 0, from: "register" });
            }
        }

    }


    async function onAppleSignIn() {
        try {
            const response = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [
                    appleAuth.Scope.EMAIL,
                    appleAuth.Scope.FULL_NAME,
                ],
            });

            const { identityToken, authorizationCode, user } = response;

            if (!identityToken) {
                throw new Error('Apple Sign-In failed - no token');
            }

            // 🔐 Kirim identityToken ke backend / Firebase
            console.log({
                appleUserId: user,
                identityToken,
                authorizationCode,
            });

        } catch (error) {
            console.log('Apple Sign In error', error);
        }
    }



    // console.log('Checkphone might render')
    return (
        <View style={{ backgroundColor: colors.lite_bg, flex: 1 }}>
            <StatusBar
                backgroundColor={colors.theme_bg}
            />
            <View style={[styles.headerTop]} />
            <View style={{ margin: 15, marginBottom: 30 }} >
                <DropShadow
                    style={{
                        width: '100%',
                        marginBottom: 0,
                        marginTop: 5,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 3,
                        // backgroundColor: 'red',
                        justifyContent: 'center'
                    }}
                >
                    <View style={{ height: 120, width: 120, margin: 'auto' }} >
                        <Image style={{ height: undefined, width: undefined, flex: 1 }} source={logo_box} />

                    </View>
                </DropShadow>
                <View style={{ position: 'absolute', top: 94, left: '58%' }}>
                    <Text style={{
                        color: 'black',
                        fontSize: 18,
                        fontWeight: 'bold',
                        width: '100%',
                        textAlign: 'center',

                    }}>Driver</Text>
                </View>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_l, fontFamily: bold }}>Masukan No Telpon</Text>
                <View style={{ margin: 5 }} />
                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: normal }}>No Telpon diperlukan</Text>
                <View style={{ margin: 20 }} />
                <View style={{ width: '80%' }}>
                    <PhoneInput style={{ borderBottomColor: colors.theme_bg_two }}
                        flagStyle={styles.flag_style}
                        ref={phone}
                        initialCountry="id" offset={10}
                        textStyle={styles.country_text}
                        textProps={{
                            placeholder: 'No Telpon',
                            placeholderTextColor: colors.theme_fg_two
                        }}
                        autoFormat={true} />
                    <View style={{ margin: 30 }} />
                    {loading == false ?
                        <View style={{ gap: 10 }}>
                            <TouchableOpacity onPress={check_valid.bind(this, 'login')} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontFamily: bold }}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={check_valid.bind(this, 'register')} activeOpacity={1} style={{ width: '100%', backgroundColor: 'green', borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontFamily: bold }}>Register</Text>
                            </TouchableOpacity>
                        </View>


                        :
                        <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                            <LottieView style={{ flex: 1 }} source={btn_loader} autoPlay loop />
                        </View>
                    }

                    <View style={{ margin: 30 }} />

                    {isAppleLoginSupported && (
                        <AppleButton
                            buttonStyle={AppleButton.Style.BLACK}
                            buttonType={AppleButton.Type.SIGN_IN}
                            style={{
                                width: '100%',
                                height: 48,
                                marginTop: 16,
                            }}
                            onPress={onAppleSignIn}
                        />
                    )}

                </View>

            </View>

        </View >
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: colors.lite_bg,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerTop: {
        height: 10,
        backgroundColor: colors.lite_bg,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textinput: {
        fontSize: f_l,
        color: colors.grey,
        fontFamily: regular,
        height: 60,
        backgroundColor: '#FAF9F6'
    },
    flag_style: {
        width: 38,
        height: 24
    },
    country_text: {
        fontSize: 18,
        borderBottomWidth: 1,
        paddingBottom: 8,
        height: 35,
        fontFamily: regular,
        color: colors.theme_fg_two
    },
});

export default CheckPhone;