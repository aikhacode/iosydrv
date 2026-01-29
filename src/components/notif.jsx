import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Switch, Pressable } from 'react-native';
import OtpTextInput from 'react-native-text-input-otp';
import { useGlobalStore, useStore } from '../reducers/zustand';
import { useNavigation } from '@react-navigation/native';
import { api_url, get_profile, prefix } from '../config/Constants';
import axios from 'axios';
import { theme_bg_blue } from '../assets/css/Colors';
import database from "@react-native-firebase/database";
import { connect } from 'react-redux';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, FadeIn, FadeOut } from 'react-native-reanimated';
import { isMoment } from 'moment';
import DropShadow from 'react-native-drop-shadow';

const Notif = ({ setOpen, ismodal = false, children }) => {
    const slide = useSharedValue(300)

    const setIsShowTabNavigator = useGlobalStore((state) => state.setIsShowTabNavigator)
    const navigation = useNavigation()

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
        setOpen(false);
    }


    const updateFirebase = (data) => {



        // const shot = data.map((A) => {
        //     return {
        //         vt: Number(A.id),
        //         online_status: A.status ? 1 : 0
        //     }
        // })


        // console.log('region on handle change', props.initial_region)
        // fetch(api_url + prefix + 'update_fitur_active', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ actives: shot, driver_id: global.id, region: props.initial_region })
        // }).then((res) => res.text()).then((res) => console.log(res)).catch((err) => console.log(err))


    }

    const autoClose = () => {

    }



    useEffect(() => {
        // setIsShowTabNavigator(false)

        // slideDown()
        if (!ismodal) {


            // return interval
        }

    }, [])

    // useEffect(() => { console.log('fiturs chg parent', props.initial_region) }, [props.initial_region])

    return (

        <>
            {ismodal ?
                <Pressable onPress={() => closeModal()} style={styles.backdrop} >

                    <Animated.View style={[styles.bottomSheet, { margin: 'auto' }]} entering={FadeIn} exiting={FadeOut}>

                        {children}
                    </Animated.View>

                </Pressable> :
                <Animated.View style={[styles.bottomSheet, { marginLeft: 'auto', marginRight: 'auto' }]} entering={FadeIn} exiting={FadeOut}>
                    <DropShadow
                        style={{

                            marginBottom: 5,
                            marginTop: 5,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 0,
                            },
                            shadowOpacity: 0.2,
                            shadowRadius: 5,
                        }}
                    >
                        {children}
                    </DropShadow>
                </Animated.View>}


        </>
    )
}


export default Notif;


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
    }
})