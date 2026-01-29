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
import { updateVehicleName } from '../actions/VehicleDetailActions';
import { Picker } from '@react-native-picker/picker';
import axios from "axios";
import { useRegistrationStore } from "../reducers/zustand";

const CreateVehicleName = (props) => {
    const navigation = useNavigation();
    const { vehicleName, setVehicleName, vehicleBrand, vehicleType, vehicles, setVehicles, motors, setMotors } = useRegistrationStore()
    let alt = useRef(
        (_data?: DropdownAlertData) => new Promise < DropdownAlertData > (res => res),
    );
    const inputRef = useRef();

    const go_back = () => {
        navigation.goBack();
    }

    const call_get_vehicles = () => {
        const mobil = ['MOBIL_AIRPORT', 'MOBIL_REGULER']
        if (mobil.includes(vehicleType)) {

            axios.get(api_url + 'driver/vehicles', {
                params: {
                    's': vehicleBrand,

                }
            }).then((res) => {

                setVehicles(res.data.vehicles.map((v) => { return { name: v.model } }))
            }).catch((err) => {
                console.log('err get vehicles', err)
            })
        } else {
            axios.get(api_url + 'driver/motors', {
                params: {
                    's': vehicleBrand
                }
            }).then((res) => {

                setVehicles(res.data.motors.map((v) => { return { name: v.model } }))
            }).catch((err) => {
                console.log('err get vehicles', err)
            })
        }

    }

    useEffect(() => {
        // setTimeout(() => inputRef.current.focus(), 100)
        call_get_vehicles()

    }, []);

    useEffect(() => {
        console.log('vehicles', vehicles)
    }, [vehicles])


    const check_valid = () => {
        if (vehicleName) {
            navigate();
        } else {
            alt({
                type: DropdownAlertType.Error,
                title: 'Validation error',
                message: 'Please enter your vehicle name',
            });

        }
    }

    const navigate = async () => {
        Keyboard.dismiss()
        // props.updateVehicleName(vehicle_name);
        go_back();
    }



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
                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xl, fontFamily: bold }}>Masukan kendaraan</Text>
                <View style={{ margin: 5 }} />
                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: normal }}>Kendaraan diperlukan</Text>
                <View style={{ margin: 20 }} />
                <View style={{ width: '80%' }}>
                    {/* <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                            <Icon type={Icons.MaterialIcons} name="drive-file-rename-outline" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                        </View>
                        <View style={{ width: '75%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                            ref={inputRef}
                                 secureTextEntry={false}
                               placeholder="Tipe kendaraan"
                               placeholderTextColor={colors.grey}
                                 style={styles.textinput}
                            onChangeText={TextInputValue =>
                                     setVehicleName(TextInputValue)}
                           /> 

                           

                        </View>
                    </View> */}
                    <Picker
                        selectedValue={vehicleName}
                        onValueChange={(itemValue, itemIndex) =>
                            setVehicleName(itemValue)
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
    updateVehicleName: (data) => dispatch(updateVehicleName(data)),

});

const mapStateToProps = (state) => ({
    vehicle_fiture_type: state.vehicle.vehicle_fiture_type,
    vehicle_brand: state.vehicle.vehicle_brand,
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateVehicleName);