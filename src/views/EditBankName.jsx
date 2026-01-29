import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    TextInput,
    StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { normal, bold, regular, update_kyc, api_url, btn_loader, f_xl, f_xs, f_m, profile_confirm } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import DropdownAlert, {
    DropdownAlertData,
    DropdownAlertType,
} from 'react-native-dropdownalert';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { Picker } from "@react-native-picker/picker";

const EditBankName = (props) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [bank_name, setBankName] = useState('');

    const banks = [
        "BNI", "BRI", "BCA", "CIMB NIAGA", "MANDIRI", "BSI SYARIAH", "BANK DANAMON", "BANK DKI", "BANK BJB", "BANK SINAR MAS",
        // "Bank Mandiri",
        // "Bank Rakyat Indonesia (BRI)",
        // "Bank Central Asia (BCA)",
        // "Bank Negara Indonesia (BNI)",
        // "Bank CIMB Niaga",
        // "Bank Danamon",
        // "Bank Permata",
        // "Bank Panin",
        // "Bank OCBC NISP",
        // "Bank Maybank Indonesia",
        // Add more banks as needed
    ];

    let alt = useRef(
        (_data?: DropdownAlertData) => new Promise < DropdownAlertData > (res => res),
    );
    const inputRef = useRef();

    const go_back = () => {
        navigation.goBack();
    }

    // useEffect(() => {
    //     setTimeout(() => inputRef.current.focus(), 100)
    // }, []);

    axios.interceptors.request.use(async function (config) {
        // Do something before request is sent
        //console.log("loading")
        setLoading(true);
        return config;
    }, function (error) {
        //console.log(error)
        setLoading(false);
        console.log("finish loading")
        // Do something with request error
        return Promise.reject(error);
    })
    const check_valid = () => {
        if (bank_name) {
            call_update_kyc();
        } else {
            alt({
                type: DropdownAlertType.Error,
                title: 'Validation error',
                message: 'Please enter your bank name',
            });

        }
    }

    const call_update_kyc = () => {

        axios({
            method: 'post',
            url: api_url + profile_confirm,
            data: { driver_id: global.id, field: 'bank_name', data: bank_name }
        })
            .then(async response => {
                setLoading(false);
                alt({
                    type: DropdownAlertType.Success,
                    title: 'Successfully sent..',
                    message: 'Your bank name has been sent. Please wait for admin approval',
                });
                go_back();

            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong')
            });
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
                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xl, fontFamily: bold }}>Masukan Bank anda</Text>
                <View style={{ margin: 5 }} />
                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: normal }}>Nama bank di Indonesia</Text>
                <View style={{ margin: 20 }} />
                <View style={{ width: '80%' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                            <Icon type={Icons.MaterialCommunityIcons} name="bank-outline" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                        </View>
                        <View style={{ width: '75%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                            {/* <TextInput
                                ref={inputRef}
                                secureTextEntry={false}
                                placeholder="Bank Name"
                                placeholderTextColor={colors.grey}
                                style={styles.textinput}
                                onChangeText={TextInputValue =>
                                    setBankName(TextInputValue)}
                            /> */}
                            <Picker
                                selectedValue={bank_name}
                                style={styles.picker}
                                onValueChange={(itemValue) => setBankName(itemValue)}
                            >
                                {/* <Picker.Item label="Select a bank" value="" /> */}
                                {banks.map((bank, index) => (
                                    <Picker.Item key={index} label={bank} value={bank} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={{ margin: 30 }} />
                    {loading == false ?
                        <TouchableOpacity onPress={check_valid.bind(this)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontFamily: bold }}>Done</Text>
                        </TouchableOpacity>
                        :
                        <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                            <LottieView source={btn_loader} autoPlay loop />
                        </View>
                    }
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
        height: 60,
        width: '100%',
        color: colors.grey,
        fontFamily: regular,
    },
});

export default EditBankName;