import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    TextInput,
    Keyboard,
    StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { normal, bold, regular, f_xl, f_xs, f_m, api_url } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import DropdownAlert, {
    DropdownAlertData,
    DropdownAlertType,
} from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import withTranslation from '../hook/withTranslation'
import { updateVehicleBrand } from '../actions/VehicleDetailActions';
import { Picker } from '@react-native-picker/picker';
import axios from "axios";
import { useRegistrationStore } from "../reducers/zustand";

const CreateVehicleBrand = (props) => {
    const navigation = useNavigation();
    const { vehicleBrand, vehicleType, setVehicles, vehicles, setMotors, setVehicleBrand } = useRegistrationStore()
    let alt = useRef(
        (_data?: DropdownAlertData) => new Promise < DropdownAlertData > (res => res),
    );
    const inputRef = useRef();

    const go_back = () => {
        navigation.goBack();
    }

    console.log(props.vehicle_fiture_type)

    const call_get_vehicles = () => {
        const mobil = ['MOBIL_AIRPORT', 'MOBIL_REGULER']
        if (mobil.includes(vehicleType)) {
            axios.get(api_url + 'driver/vehicles', {
                params: {
                    'group': 'brand',

                }
            }).then((res) => {
                console.log('res', res.data.vehicles.map((v) => { return { name: v.brand } }))
                setVehicles(res.data.vehicles.map((v) => { return { name: v.brand } }))
            }).catch((err) => {
                console.log('err get vehicles', err)
            })
        } else {
            axios.get(api_url + 'driver/motors', {
                params: {
                    'group': 'brand'
                }
            }).then((res) => {
                console.log('res', res.data)
                setVehicles(res.data.motors.map((v) => { return { name: v.brand } }))
            }).catch((err) => {
                console.log('err get vehicles', err)
            })
        }

    }

    useEffect(() => {
        // setTimeout(() => inputRef.current.focus(), 100)
        call_get_vehicles();
    }, []);


    const check_valid = () => {
        if (vehicleBrand) {
            navigate();
        } else {
            alt({
                type: DropdownAlertType.Error,
                title: 'Error',
                message: 'Please enter your vehicle brand',
            });

        }
    }

    const navigate = async () => {
        Keyboard.dismiss()
        // props.updateVehicleBrand(vehicle_brand);
        go_back();
    }

    useEffect(() => {
        console.log('rendering CreateVehicleBrand', vehicleBrand)
    }, [vehicleBrand]);

    return (
        <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>
            <StatusBar
                backgroundColor={colors.theme_bg}
            />
            <View style={[styles.header]}>
                <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                </TouchableOpacity>
            </View>
            <View style={{ margin: 20 }} />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xl, fontFamily: bold }}>Masukan brand kendaraan (Toyota, Daihatsu,...)</Text>
                <View style={{ margin: 5 }} />
                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: normal }}>Brand kendaraan di perlukan</Text>
                <View style={{ margin: 20 }} />
                <View style={{ width: '80%' }}>
                    {/* <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                            <Icon type={Icons.MaterialIcons} name="branding-watermark" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                        </View>
                        <View style={{ width: '75%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                            <TextInput
                                ref={inputRef}
                                secureTextEntry={false}
                                placeholder="Vehicle Brand"
                                placeholderTextColor={colors.grey}
                                style={styles.textinput}
                                onChangeText={TextInputValue =>
                                    setVehicleBrand(TextInputValue)}
                            />
                        </View>
                    </View> */}
                    <Picker
                        selectedValue={vehicleBrand}
                        onValueChange={(itemValue, itemIndex) =>
                            setVehicleBrand(itemValue)
                        }
                        style={styles.picker}
                    >
                        <Picker.Item label="Pilih Brand Kendaraan" value="" />
                        {vehicles.map((vehicle, index) => (
                            <Picker.Item key={index} label={vehicle.name} value={vehicle.name} />
                        ))}
                    </Picker>
                    <View style={{ margin: 30 }} />
                    <TouchableOpacity onPress={check_valid.bind(this)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontFamily: bold }}>Selesai</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <DropdownAlert alert={func => (alt = func)} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: colors.lite_bg,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textinput: {
        fontSize: f_m,
        color: colors.grey,
        fontFamily: regular,
        height: 60,
        backgroundColor: colors.text_container_bg,
        width: '100%'
    },
    picker: {
        marginTop: 20,
        marginHorizontal: 10,
        backgroundColor: colors.theme_bg_three,
        color: colors.theme_fg_two,
    },
});

const mapDispatchToProps = (dispatch) => ({
    updateVehicleBrand: (data) => dispatch(updateVehicleBrand(data)),
});

export default withTranslation(connect(null, mapDispatchToProps)(CreateVehicleBrand));