import React, { useState, useRef, useEffect } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    TextInput,
    View,
    SafeAreaView,
    ScrollView,
    StatusBar
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { connect } from 'react-redux';
import axios from 'axios';
import { bold, regular, api_url, vehicle_update, btn_loader, f_xl, f_xs, f_m } from '../config/Constants';
import DropdownAlert, {
    DropdownAlertData,
    DropdownAlertType,
} from 'react-native-dropdownalert';
import LottieView from 'lottie-react-native';
import VehiclePickFormDefault from "../components/vehicle/vehiclepick";
import { useRegistrationStore } from "../reducers/zustand";

const VehicleDetails = (props) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [is_enabled, setEnabled] = useState(true);
    const [valid, setValid] = useState(false);
    const vehicleStore = useRegistrationStore()
    let alt = useRef(
        (_data?: DropdownAlertData) => new Promise < DropdownAlertData > (res => res),
    );


    const go_back = () => {
        navigation.goBack();
    }

    const navigate = (route) => {
        navigation.navigate(route);
    }

    useEffect(() => {
        console.log('rendering VehicleStore', vehicleStore)
    }, [vehicleStore])

    const call_vehicle_update = async () => {
        setLoading(true);
        console.log('chu', props.vehicle_type_multi)
        await axios({
            method: 'post',
            url: api_url + vehicle_update,
            data: {
                driver_id: global.id, vehicle_type: props.vehicle_type, brand: vehicleStore.vehicleBrand,
                color: vehicleStore.vehicleColor, vehicle_name: vehicleStore.vehicleName, vehicle_number: vehicleStore.vehicleNumber,
                actives: vehicleStore.vehicleFitur
            }
        })
            .then(async response => {
                console.log(response.data)
                setLoading(false);
                navigate_doc();
            })
            .catch(error => {
                setLoading(false);
                alt({
                    type: DropdownAlertType.Error,
                    title: 'Error',
                    message: 'Sorry something went wrong',
                });
            });
    }

    const navigate_doc = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "VehicleDocument" }],
            })
        );
    }

    const check_validate = async () => {
        console.log('selesai reg')
        if (vehicleStore.vehicleBrand == "" || vehicleStore.vehicleColor == "" ||
            vehicleStore.vehicleName == "" ||
            vehicleStore.vehicleType == "" || vehicleStore.vehicleNumber == "") {
            alt({
                type: DropdownAlertType.Error,
                title: 'Error',
                message: 'Please enter all the required fields',
            });
        } else {
            call_vehicle_update();
        }
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
            {/* <ScrollView> */}
            <VehiclePickFormDefault onvalid={setValid} valid={valid} />
            {/* </ScrollView> */}
            {(valid && loading == false) &&
                <TouchableOpacity activeOpacity={1} onPress={check_validate.bind(this)} style={{ width: '90%', position: 'absolute', bottom: 20, marginLeft: '5%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontFamily: bold }}>Selesai</Text>
                </TouchableOpacity>
            }
            {(valid && loading) &&
                <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                    <LottieView style={{ flex: 1 }} source={btn_loader} autoPlay loop />
                </View>
            }

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
});

function mapStateToProps(state) {
    return {
        vehicle_name: state.vehicle.vehicle_name,
        vehicle_brand: state.vehicle.vehicle_brand,
        vehicle_color: state.vehicle.vehicle_color,
        vehicle_number: state.vehicle.vehicle_number,
        vehicle_type: state.vehicle.vehicle_type,
        vehicle_type_lbl: state.vehicle.vehicle_type_lbl,
        vehicle_type_multi: state.vehicle.vehicle_type_multi
    };
}

export default connect(mapStateToProps, null)(VehicleDetails);